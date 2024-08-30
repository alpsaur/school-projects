package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.EventArtifact;
import sg.nus.iss.adproj.funsg.model.entity.Group;

import java.util.List;

public interface EventArtifactRepository extends JpaRepository<EventArtifact, Long> {

    @Query("select e.filePath from EventArtifact e where e.event.group=:group ")
    List<String> findFilePathByGroup(@Param("group") Group group);

    @Query("select e.filePath from EventArtifact e where e.event=:event")
    List<String> findFilePathByEvent(@Param("event") Event event);
}
