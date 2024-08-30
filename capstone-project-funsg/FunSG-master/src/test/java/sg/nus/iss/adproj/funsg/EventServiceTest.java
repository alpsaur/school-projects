package sg.nus.iss.adproj.funsg;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.repository.UserRepository;
import sg.nus.iss.adproj.funsg.service.EventImplementation;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class EventServiceTest {
    @Autowired
    EventImplementation eventService;

    @Autowired
    UserRepository userRepo;

    //Todo:还未测试
    @Test
    public void viewParticipantSTest() {

        List<Event> events = eventService.getParticipatedEventsByUserId(1L);
    }

    @Test
    public void viewEventsTest() {
        User user = userRepo.findById(1L).get();

        Event event = eventService.getEventById(2L);
        assertEquals(event.getDescription(),"Photography Walk");

        List<Event> events1 = eventService.getAllEventsSortedByStartDate();
        assertEquals(events1.size(), 30);

        List<Event> events2 = eventService.getEventsByMBTI(user);
        assertEquals(events2.size(), 30);

        List<Event> events3 = eventService.getEventsByCategoryId(1L);
        assertEquals(events3.size(), 5);

        List<Event> events4 = eventService.searchEvents("tech");
        assertEquals(events4.size(), 2);

    }

    @Test
    public void registerEventTest() {

    }

    @Test
    public void createEventTest() {

    }
}
