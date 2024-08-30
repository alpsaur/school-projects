package sg.nus.iss.adproj.funsg.interfacemethods;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;

import java.util.List;

public interface EventInterface {
    List<Event> getAllEventsSortedByStartDate();

    Event getEventById(Long eventId);

    String registerForEvent(Long eventId, User currentUser);

    List<Event> getEventsByMBTI(User currentUser);

    List<Event> getEventsByCategoryId(Long categoryId);

    List<Event> searchEvents(String query);

    Event saveEvent(Event event);

    List<User> getEventParticipants(Long eventId);

    List<Event> getParticipatedEventsByUserId(Long id);

    List<Event> getEventsByGroup(Group group);

    Event getEventByName(String eventName);

    Event updateEventStatus(Long eventId, String status);

    List<Event> getAllOrganisedEvents();

    List<Event> getEventsOfHost(Long userId);

    Event exitEvent(Event event, User currentUser);

    void sendEmailsOfEventToEventParticipant(Event event, String condition);

    void updateEventStatusByDate(List<Event> events);

    Page<Event> getAllEvents(Pageable pageable);


    Page<Event> getAllEventsByCategoryId(Long categoryId, Pageable pageable);

    void sendEmailOfEventToGroupMembers(Event event, Group group);
}
