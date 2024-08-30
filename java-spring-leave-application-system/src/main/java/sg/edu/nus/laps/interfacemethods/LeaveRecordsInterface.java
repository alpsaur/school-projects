package sg.edu.nus.laps.interfacemethods;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.LeaveRecords;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaveRecordsInterface {
    List<LeaveRecords> getAppliedLeaveRecordsByManagerId(int id);

    List<LeaveRecords> getLeaveHistoryByDatesByManagerId(LocalDate startDate, LocalDate endDate, int id);

    Page<LeaveRecords> getLeaveHistoryByManagerId(int id,Pageable pageable);
    List<LeaveRecords> getLeaveRecordsByManagerIdForReport(LocalDate startDate, LocalDate endDate, int id);

    int updateLeaveRecordStatus(int id, ApplicationStatus status, String comment);

    Optional<LeaveRecords> getLeaveRecordById(int id);

    LeaveRecords searchLeaveRecordById(int id);

    Page<LeaveRecords> getLeaveHistoryByStaffId(int staffId, Pageable pageable);

    int updateLeaveRecordStatus(int id, ApplicationStatus status);

    List<LeaveRecords> getLeaveRecordsByMonth(String monthSelection);

    Boolean saveLeaveRecord(LeaveRecords leaveRecords);

    void deleteLeaveRecordById(int id);

    List<LeaveRecords> getLeaveHistoryByManagerIdByLeaveTypeForReport(LocalDate startDate, LocalDate endDate, int id, String leaveType);
}
