package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sg.nus.iss.adproj.funsg.model.entity.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("select e from Event e where e.status = 'open' order by e.start ")
    public List<Event> findUpcomingEventsOrderByStartDate();


    @Query("select e from Event e where e.status = 'open'")
    public List<Event> findUpcomingEvents();


    @Query("select e from Event e where e.status='open' and e.group.category=:category ")
    public List<Event> findByCategory(@Param("category") Category category);

    //completed是临时的，等待最终确定的status名称
    @Query("select e from Event e where (e.status='open' or e.status='closed') and (" +
            "lower(e.name) like lower(concat('%', :term, '%')) or " +
            "lower(e.description) like lower(concat('%', :term, '%')) )")
    public List<Event> findBySearchTerm(@Param("term")String term);

    @Query("select e from Event e where e.status='open' and e.group=:group ")
    public List<Event> findByGroup(@Param("group") Group group);

    @Query("select e from Event e left join fetch e.eventsParticipants where e.id =:id")
    public Event findByIdWithParticipants(@Param("id") Long id);

    @Query("select e from Event e where e.status='open' and e.name=:name ")
    public Event findByName(@Param("name") String name);

    @Query("select e from Event e where e.createdBy=:createdBy and e.status='open'")
    public List<Event> findByCreatedBy(@Param("createdBy") User createdBy);

    @Query("select e from Event e where e.status <> 'canceled'")
    public List<Event> findAllOrganisedEvents();

//    @Query("select e from Event e")
//    public Page<Event> findAllEvents(Pageable pageable);

    Page<Event> findAll(Pageable pageable);

    @Query("select e from Event e where e.group.category.id = :categoryId")
    Page<Event> findAllEventsByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("select e from Event e where e.createdAt between :from and :to")
    List<Event> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);


}
