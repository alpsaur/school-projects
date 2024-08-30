package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.interfacemethods.LeaveRecordsInterface;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.LeaveRecords;
import sg.edu.nus.laps.repository.LeaveRecordsRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class LeaveRecordsImplementation implements LeaveRecordsInterface {

    @Autowired
    LeaveRecordsRepository leaveRecordsRepository;

    @Override
    public List<LeaveRecords> getAppliedLeaveRecordsByManagerId(int id) {
        return leaveRecordsRepository.findAppliedLeaveRecordsByManagerId(id);
    }

    @Override
    public List<LeaveRecords> getLeaveHistoryByDatesByManagerId(LocalDate startDate, LocalDate endDate, int id) {
        return leaveRecordsRepository.findLeaveHistoryByDatesByManagerId(startDate, endDate, id);
    }

    @Override
    public Page<LeaveRecords> getLeaveHistoryByManagerId(int id,Pageable pageable) {
        return leaveRecordsRepository.findLeaveHistoryByManagerId(id,pageable);
    }

    @Override
    public List<LeaveRecords> getLeaveRecordsByManagerIdForReport(LocalDate startDate, LocalDate endDate, int id) {
        return leaveRecordsRepository.findLeaveRecordsByManagerIdForReport(startDate, endDate, id);
    }

    @Override
    public Page<LeaveRecords> getLeaveHistoryByStaffId(int staffId, Pageable pageable) {
        return leaveRecordsRepository.findLeaveRecordByStaffId(staffId,pageable);
    }

    @Transactional(readOnly = false)
    @Override
    public int updateLeaveRecordStatus(int id, ApplicationStatus status, String comment) {
        return leaveRecordsRepository.updateLeaveRecordStatus(id, status, comment);
    }

    @Transactional(readOnly = false)
    @Override
    public int updateLeaveRecordStatus(int id, ApplicationStatus status) {
        return leaveRecordsRepository.updateLeaveRecordsStatus(id, status);
    }

    @Override
    public Optional<LeaveRecords> getLeaveRecordById(int id) {
        return leaveRecordsRepository.findById(id);
    }

    @Override
    public LeaveRecords searchLeaveRecordById(int id) {
        return leaveRecordsRepository.findLeaveRecordsById(id);
    }

    @Override
    public List<LeaveRecords> getLeaveRecordsByMonth(String monthSelection) {
        LocalDate today = LocalDate.now();
        int month;
        if (monthSelection.equalsIgnoreCase("thisMonth")) {
            month = today.getMonthValue();
        } else if (monthSelection.equalsIgnoreCase("nextMonth")) {
            month = today.plusMonths(1).getMonthValue();
        } else {
            month = today.minusMonths(1).getMonthValue();
        }
        return leaveRecordsRepository.findLeaveRecordsByMonth(month);
    }

    @Transactional
    @Override
    public Boolean saveLeaveRecord(LeaveRecords leaveRecord) {
        if (leaveRecordsRepository.save(leaveRecord) != null)
            return true;
        else
            return false;
    }

    @Transactional
    @Override
    public void deleteLeaveRecordById(int id) {
        leaveRecordsRepository.deleteById(id);
    }

    @Override
    public List<LeaveRecords> getLeaveHistoryByManagerIdByLeaveTypeForReport(LocalDate startDate, LocalDate endDate, int id, String leaveType) {
        return leaveRecordsRepository.findLeaveHistoryByManagerIdByLeaveTypeForReport(startDate, endDate, id, leaveType);
    }
}
