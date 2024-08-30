package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sg.nus.iss.adproj.funsg.model.entity.Comment;
import sg.nus.iss.adproj.funsg.model.entity.Group;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("select c from Comment c where c.group = :group order by c.postedAt")
    List<Comment> findByGroup(@Param("group") Group group);
}
