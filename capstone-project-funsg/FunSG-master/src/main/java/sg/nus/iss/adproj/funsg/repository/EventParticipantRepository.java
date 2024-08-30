package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sg.nus.iss.adproj.funsg.model.entity.EventParticipant;
import sg.nus.iss.adproj.funsg.model.entity.User;

import java.util.List;

public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {

    @Query("select ep from EventParticipant ep where ep.user =:user and ep.event.status<>'canceled' ")
    List<EventParticipant> findByUser(@Param("user") User user);

}
