package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.interfacemethods.CompensationRecordInterface;
import sg.edu.nus.laps.interfacemethods.LeaveBalanceInterface;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.CompensationRecord;
import sg.edu.nus.laps.repository.CompensationRecordRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CompensationRecordImplementation implements CompensationRecordInterface {
    @Autowired
    private CompensationRecordRepository compensationRecordRepository;
    @Autowired
    private LeaveBalanceInterface leaveBalanceService;

    @Autowired
    public void setLeaveBalanceService(LeaveBalanceImplementation leaveBalanceService) {
        this.leaveBalanceService = leaveBalanceService;
    }

    @Override
    public List<CompensationRecord> getAllCompensationRecordsByManagerId(int managerId) {
        return compensationRecordRepository.findAllCompensationRecordsByManagerId(managerId);
    }

    @Override
    public List<CompensationRecord> getAppliedCompensationRecordsByManagerId(int managerId) {
        return compensationRecordRepository.findAllAppliedCompensationRecordsByManagerId(managerId);
    }

    @Override
    public List<CompensationRecord> getProcessedCompensationRecordsByManagerId(int managerId) {
        return compensationRecordRepository.findAllProcessedCompensationRecordsByManagerId(managerId);
    }

    @Override
    public List<CompensationRecord> getCompensationRecordByStaffId(int staffId) {
        return compensationRecordRepository.findCompensationRecordByStaffId(staffId);
    }


    @Override
    @Transactional(readOnly = false)
    public int updateCompensationRecordStatus(int id, ApplicationStatus status, String comment) {
        return compensationRecordRepository.updateCompensationRecordStatus(id, status, comment);
    }

    @Override
    @Transactional(readOnly = false)
    public Boolean approveCompensationRequest(int compensationId, int staffId, Double numOfLeave) {
        if (numOfLeave < 0.5) {
            updateCompensationRecordStatus(compensationId, ApplicationStatus.rejected, " No Enough Overtime Hours.");
            return false;
        }
        updateCompensationRecordStatus(compensationId, ApplicationStatus.approved, null);
        double currentBalance = leaveBalanceService.getLeaveBalanceByStaffIdByLeaveCode(staffId, 3).getCurrentBalance();
        leaveBalanceService.updateCurrentLeaveBalanceByStaffIdByLeaveCode(staffId, 3, currentBalance + numOfLeave);
        return true;
    }

    @jakarta.transaction.Transactional
    @Override
    public Boolean saveCompensationRecord(CompensationRecord compensationRecord){
        if(compensationRecordRepository.save(compensationRecord)!=null)
            return true;
        else
            return false;
    }

    @Transactional
    @Override
    public List<CompensationRecord> GetCompensationRecordsByStaffId(int staffId){
        return compensationRecordRepository.findAllCompensationRecordsByStaffId(staffId);
    }

    @Transactional
    @Override
    public CompensationRecord searchCompensationRecordById(int compensationId){
        return compensationRecordRepository.findById(compensationId).get();
    }

    @Transactional
    @Override
    public void deleteCompensationRecordById(int compensationId){
        compensationRecordRepository.deleteById(compensationId);
    }

}


