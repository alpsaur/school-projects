package sg.edu.nus.laps.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sg.edu.nus.laps.model.Leave.LeaveType;

public interface LeaveTypeRepository extends JpaRepository<LeaveType, Integer> {
    @Query("select max(lt.leaveCode) from LeaveType lt")
    public int getMaxLeaveCode();
}
