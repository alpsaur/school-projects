package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.model.entity.UserMBTI;

import java.util.List;

public interface UserMBTIRepository extends JpaRepository<UserMBTI, Long> {

    @Query("select ub from UserMBTI ub where ub.user = :user ")
    public List<UserMBTI> findByUser(@Param("user") User user);

    @Query("select ub.mbtiWords from UserMBTI ub where ub.user = :user ")
    public List<String> findMBTIWordsByUser(@Param("user") User user);
}
