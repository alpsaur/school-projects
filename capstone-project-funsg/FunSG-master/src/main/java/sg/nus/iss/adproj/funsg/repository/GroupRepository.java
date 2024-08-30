package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sg.nus.iss.adproj.funsg.model.entity.Category;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("select g from Group g LEFT JOIN g.members m " +
            "where g.status='active' " +
            "GROUP BY g ORDER BY COUNT(m) DESC ")
    public List<Group> findActiveGroupsOrderByMembersCount();

    @Query("select g from Group g where g.status='active'")
    public List<Group> findAllActiveGroups();

    @Query("select g from Group g where g.status='active' and g.category=:category")
    public List<Group> findByCategory(@Param("category")Category category);

    @Query("select g from Group g where g.status='active' and (" +
            "lower(g.name) like lower(concat('%', :term, '%')) or " +
            "lower(g.description) like lower(concat('%', :term, '%')) )")
    public List<Group> findBySearchTerm(@Param("term")String term);

    @Query("select g from Group g where g.status ='pending'")
    public List<Group>findAllPendingGroups();

    @Query("select g from Group g where g.status <>'pending'")
    public Page<Group> findAllNonPendingGroups(Pageable pageable);

    @Query("SELECT g FROM Group g WHERE g.category.id = :categoryId AND g.status <> 'pending'")
    Page<Group> findAllNonPendingGroupsByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("select g from Group g where g.createdAt between :from and :to")
    List<Group> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);


}
