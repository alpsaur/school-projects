package sg.edu.nus.laps.interfacemethods;

import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.CompensationRecord;

import java.util.List;
import java.util.Optional;

public interface CompensationRecordInterface {
    List<CompensationRecord> getAllCompensationRecordsByManagerId(int managerId);
    List<CompensationRecord> getAppliedCompensationRecordsByManagerId(int managerId);
    List<CompensationRecord> getProcessedCompensationRecordsByManagerId(int managerId);

    List<CompensationRecord> getCompensationRecordByStaffId(int staffId);

    List<CompensationRecord> GetCompensationRecordsByStaffId(int staffId);

    int updateCompensationRecordStatus(int id, ApplicationStatus status, String comment);

    Boolean approveCompensationRequest(int compensationId, int staffId, Double numOfLeave);

    Boolean saveCompensationRecord(CompensationRecord compensationRecord);

    CompensationRecord searchCompensationRecordById(int compensationId);

    void deleteCompensationRecordById(int compensationId);
}
