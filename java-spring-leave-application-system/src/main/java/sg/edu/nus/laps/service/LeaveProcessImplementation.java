package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.interfacemethods.LeaveBalanceInterface;
import sg.edu.nus.laps.interfacemethods.LeaveProcessInterface;
import sg.edu.nus.laps.interfacemethods.LeaveRecordsInterface;
import sg.edu.nus.laps.interfacemethods.WPHCalendarInterface;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveRecords;

import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@Transactional
public class LeaveProcessImplementation implements LeaveProcessInterface {

    private final LeaveRecordsInterface leaveRecordsService;
    private final LeaveBalanceInterface leaveBalanceService;
    private final WPHCalendarInterface wphCalendarService;

    @Autowired
    public LeaveProcessImplementation(
            final LeaveRecordsImplementation leaveRecordsService,
            final LeaveBalanceImplementation leaveBalanceService,
            final WPHCalendarImplementation wphCalendarService
    ) {
        this.leaveRecordsService = leaveRecordsService;
        this.leaveBalanceService = leaveBalanceService;
        this.wphCalendarService = wphCalendarService;
    }

    @Override
    public void rejectAppliedLeave(Integer leaveId, String comment) {
        leaveRecordsService.updateLeaveRecordStatus(leaveId, ApplicationStatus.rejected, comment);
    }

    @Override
    public Boolean approveAppliedLeave(Integer leaveId, String comment) throws Exception {
        Optional<LeaveRecords> leaveRecordsOptional = leaveRecordsService.getLeaveRecordById(leaveId);
        if (leaveRecordsOptional.isEmpty()) {
            throw new Exception("Leave record not found");
        }
        LeaveRecords leaveRecord = leaveRecordsOptional.get();
        int leaveCode = leaveRecord.getLeaveType().getLeaveCode();
        int staffId = leaveRecord.getStaff().getId();
        LeaveBalance leaveBalance = leaveBalanceService.getLeaveBalanceByStaffIdByLeaveCode(staffId, leaveCode);

        //Handle Compensation Leave(leaveCode ==3)
        if (leaveCode == 3) {
            if (leaveBalance.getCurrentBalance() >= 0.5) {
                approveLeave(leaveId, comment);
                updateLeaveBalances(leaveBalance, 0.5, staffId, leaveCode);
                return true;
            } else {
                rejectLeave(leaveId);
                return false;
            }
        }

        //Handle Annual and Medical Leave
        double duration = ChronoUnit.DAYS.between(leaveRecord.getStartDate(), leaveRecord.getEndDate()) + 1;
        double leaveDeduction = calculateLeaveDeduction(leaveRecord, duration);
        double leaveQuota = getLeaveQuota(leaveBalance);

        if (leaveQuota < leaveDeduction) {
            rejectLeave(leaveId);
            return false;
        } else {
            updateLeaveBalances(leaveBalance, leaveDeduction, staffId, leaveCode);
            approveLeave(leaveId, comment);
            return true;
        }
    }

    private double calculateLeaveDeduction(LeaveRecords leaveRecord, double duration) {
        if (duration <= 14) {
            double numOfWPHDays = wphCalendarService.getNumberOfWPHDays(leaveRecord.getStartDate(), leaveRecord.getEndDate());
            return duration - numOfWPHDays;
        }
        return duration;
    }

    private static double getLeaveQuota(LeaveBalance leaveBalance) {

        if (leaveBalance.getLeaveType().getLeaveCode() == 1) {
            return leaveBalance.getCurrentBalance() + leaveBalance.getForwardBalance();
        } else {
            return leaveBalance.getCurrentBalance();
        }
    }

    private void rejectLeave(int leaveId) {
        ApplicationStatus status = ApplicationStatus.rejected;
        leaveRecordsService.updateLeaveRecordStatus(leaveId, status, "No Enough Leave Balance.");
    }

    private void approveLeave(int leaveId, String comment) {
        ApplicationStatus status = ApplicationStatus.approved;
        leaveRecordsService.updateLeaveRecordStatus(leaveId, status, comment.isEmpty() ? null : comment);
    }

    private void updateLeaveBalances(LeaveBalance leaveBalance, double leaveDeduction, int staffId, int leaveCode) {
        //handle Compensation and Medical leave
        if (leaveCode != 1) {
            leaveBalanceService.updateCurrentLeaveBalanceByStaffIdByLeaveCode(staffId, leaveCode, leaveBalance.getCurrentBalance() - leaveDeduction);
        } else {
            if (leaveBalance.getForwardBalance() >= leaveDeduction) {
                leaveBalanceService.updateForwardLeaveBalanceByStaffIdByLeaveCode(staffId, leaveCode, leaveBalance.getForwardBalance() - leaveDeduction);
            } else {
                double remainingDeduction = leaveDeduction - leaveBalance.getForwardBalance();
                leaveBalanceService.updateForwardLeaveBalanceByStaffIdByLeaveCode(staffId, leaveCode, 0.0);
                leaveBalanceService.updateCurrentLeaveBalanceByStaffIdByLeaveCode(staffId, leaveCode, leaveBalance.getCurrentBalance() - remainingDeduction);
            }
        }
    }
}
