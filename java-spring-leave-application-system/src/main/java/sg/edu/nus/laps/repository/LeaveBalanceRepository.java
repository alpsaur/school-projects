package sg.edu.nus.laps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveType;

import java.util.List;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Integer> {
    @Query("select lb from LeaveBalance lb where lb.leaveType=:leavetype")
    public List<LeaveBalance> findByLeaveType(LeaveType leavetype);

    @Query("SELECT b FROM LeaveBalance b WHERE b.staff.id= :id")
    List<LeaveBalance> findLeaveBalanceByStaffId(@Param("id") Integer id);

    @Query("SELECT b FROM LeaveBalance b WHERE b.staff.id=:id AND b.leaveType.leaveCode = :leaveCode")
    LeaveBalance findLeaveBalanceByStaffIdByLeaveCode(@Param("id") Integer id, @Param("leaveCode") Integer leaveCode);

    @Modifying
    @Transactional
    @Query("UPDATE LeaveBalance b SET b.forwardBalance = :newBalance WHERE b.staff.id=:id AND b.leaveType.leaveCode =:leaveCode")
    int updateForwardLeaveBalanceByStaffId(@Param("id") Integer id, @Param("leaveCode") Integer leaveCode, @Param("newBalance") Double newBalance);

    @Modifying
    @Transactional
    @Query("UPDATE LeaveBalance b SET b.currentBalance = :newBalance WHERE b.staff.id=:id AND b.leaveType.leaveCode =:leaveCode")
    int updateCurrentLeaveBalanceByStaffId(@Param("id") Integer id, @Param("leaveCode") Integer leaveCode, @Param("newBalance") Double newBalance);


}
