package sg.edu.nus.laps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.CompensationRecord;

import java.util.List;
import java.util.Optional;

public interface CompensationRecordRepository extends JpaRepository<CompensationRecord, Integer> {

    @Query("SELECT c FROM CompensationRecord c WHERE c.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.applied AND c.staff.managedBy.id = :managerId ORDER BY c.overtimeDate desc ")
    List<CompensationRecord> findAllAppliedCompensationRecordsByManagerId(@Param("managerId") int managerId);

    @Query("SELECT c FROM CompensationRecord c WHERE (c.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.approved OR c.status = sg.edu.nus.laps.model.Enums.ApplicationStatus.rejected) AND c.staff.managedBy.id = :managerId ORDER BY c.overtimeDate desc ")
    List<CompensationRecord> findAllProcessedCompensationRecordsByManagerId(@Param("managerId") int managerId);

    @Query("SELECT c FROM CompensationRecord c WHERE c.staff.managedBy.id = :id ORDER BY c.staff.id")
    List<CompensationRecord> findAllCompensationRecordsByManagerId(@Param("id") int id);

    @Query("SELECT c FROM CompensationRecord c WHERE c.staff.id=:id ORDER BY c.overtimeDate")
    List<CompensationRecord> findCompensationRecordByStaffId(@Param("id") int id);

    @Query("SELECT c FROM CompensationRecord c WHERE c.staff.id = :staffId")
    List<CompensationRecord> findAllCompensationRecordsByStaffId(@Param("staffId") int staffId);

    @Modifying
    @Transactional
    @Query("UPDATE CompensationRecord c SET c.status = :status, c.comment = :comment WHERE c.id = :id")
    int updateCompensationRecordStatus(@Param("id") int id, @Param("status") ApplicationStatus status, @Param("comment") String comment);

}
