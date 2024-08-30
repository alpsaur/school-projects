package sg.edu.nus.laps.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.LeaveRecords;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRecordsRepository extends JpaRepository<LeaveRecords, Integer> {
    @Query("select l from LeaveRecords l where l.staff.id=:staffId " +
            "and year(l.startDate)=year(CURRENT_DATE)")
    Page<LeaveRecords> findLeaveRecordByStaffId(@Param("staffId") int staffId, Pageable pageable);

    @Query("SELECT r FROM LeaveRecords r WHERE " +
            "r.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.applied " +
            "AND r.staff.managedBy.id = :managerId " +
            "AND year(r.startDate)=year(current date) " +
            "ORDER BY r.staff.id")
    List<LeaveRecords> findAppliedLeaveRecordsByManagerId(@Param("managerId") int managerId);

    @Query("SELECT r FROM LeaveRecords r WHERE " +
            "(r.startDate <= :endDate AND r.endDate >= :startDate) " +
            "AND (r.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.approved OR r.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.rejected) " +
            "AND r.staff.managedBy.id = :managerId " +
            "AND year(r.startDate)=year(current date)" +
            "ORDER BY r.startDate DESC")
    List<LeaveRecords> findLeaveHistoryByDatesByManagerId(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("managerId") int managerId);

    @Query("SELECT r FROM LeaveRecords r WHERE " +
            "(r.startDate <= :endDate AND r.endDate >= :startDate) " +
            "AND r.staff.managedBy.id = :managerId " +
            "ORDER BY r.startDate DESC")
    List<LeaveRecords> findLeaveRecordsByManagerIdForReport( @Param("startDate") LocalDate startDate,
                                                             @Param("endDate") LocalDate endDate,
                                                             @Param("managerId") int managerId);

    @Query("SELECT r FROM LeaveRecords r WHERE " +
            "(r.startDate <= :endDate AND r.endDate >= :startDate) " +
            "AND r.staff.managedBy.id = :managerId " +
            "AND r.leaveType.leaveType = :leaveType ORDER BY r.startDate")
    List<LeaveRecords> findLeaveHistoryByManagerIdByLeaveTypeForReport(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("managerId") int managerId,
            @Param("leaveType") String leaveType);

    @Query("SELECT r FROM LeaveRecords r " +
            "WHERE (r.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.approved OR r.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.rejected) " +
            "AND r.staff.managedBy.id = :managerId " +
            "AND year(r.startDate)=year(CURRENT_DATE)" +
            "ORDER BY r.startDate DESC")
    Page<LeaveRecords> findLeaveHistoryByManagerId(@Param("managerId") int managerId, Pageable pageable);

    @Modifying
    @Transactional
    @Query("update LeaveRecords r set r.status=:status where r.id=:id")
    int updateLeaveRecordsStatus(@Param("id") int id, @Param("status") ApplicationStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE LeaveRecords r SET r.status = :status, r.comment = :comment WHERE r.id = :id")
    int updateLeaveRecordStatus(@Param("id") int id, @Param("status") ApplicationStatus status, @Param("comment") String comment);

    @Query("select r from LeaveRecords r where r.id=:id")
    LeaveRecords findLeaveRecordsById(@Param("id") int id);

    @Query("select lr from LeaveRecords lr where (FUNCTION('MONTH', lr.startDate) = :month OR FUNCTION('MONTH', lr.endDate) = :month)" +
            "AND lr.staff.enabled = true" + " AND lr.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.approved")
    List<LeaveRecords> findLeaveRecordsByMonth(@Param("month") int month);
}
