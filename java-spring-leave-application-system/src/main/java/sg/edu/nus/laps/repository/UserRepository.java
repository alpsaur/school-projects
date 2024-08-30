package sg.edu.nus.laps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(value = "select role from users WHERE id = :id", nativeQuery = true)
    String findRoleById(@Param("id") Integer id);

    @Query("select s from Staff s where s.enabled=true ")
    public List<Staff> findAllStaff();

    @Query("select s from Staff s where s.enabled=true and (" +
            "lower(s.firstName) like lower(concat('%', :searchStr, '%')) or " +
            "lower(s.lastName) like lower(concat('%', :searchStr, '%')) or " +
            "lower(s.email) like lower(concat('%', :searchStr, '%')) or " +
            "s.phoneNumber like lower(concat('%', :searchStr, '%')))")
    public List<Staff> findByStr(@Param("searchStr") String searchStr);

    @Query("select s from Staff s where s.id = :id and s.enabled=true")
    public Staff findStaffById(@Param("id") Integer id);

    boolean existsByUsername(String username);

    @Query("select s from Staff s where s.managedBy is null and s.enabled=true")
    public List<Staff> findStaffsWithoutManager();

    @Query("SELECT s FROM Staff s WHERE s.managedBy.id = :id")
    List<Staff> findSubordinatesByManagerId(@Param("id") Integer id);

    User findUserById(int id);

    User findByUsername(String username);
}
