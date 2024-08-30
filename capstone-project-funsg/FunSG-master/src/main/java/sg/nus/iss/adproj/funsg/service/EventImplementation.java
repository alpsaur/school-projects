package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.nus.iss.adproj.funsg.interfacemethods.EventInterface;
import sg.nus.iss.adproj.funsg.model.entity.*;
import sg.nus.iss.adproj.funsg.repository.*;

import java.time.LocalDateTime;
import java.util.*;

import static sg.nus.iss.adproj.funsg.model.utils.UtilMethods.calCosSimilarity;

@Service
@Transactional
public class EventImplementation implements EventInterface {
    @Autowired
    EventRepository eventRepo;

    @Autowired
    EventParticipantRepository eventParticipantRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    CategoryRepository categoryRepo;

    @Autowired
    EmailService emailService;

    @Override
    public List<Event> getAllEventsSortedByStartDate() {
        return eventRepo.findUpcomingEventsOrderByStartDate();
    }

    @Override
    public Event getEventById(Long eventId) {
        return eventRepo.findByIdWithParticipants(eventId);
    }

    @Override
    public String registerForEvent(Long eventId, User User) {
        User currentUser = userRepo.findByIdWithParticipants(User.getId());
        if (currentUser == null) {
            return "The user doesn't exist";
        }
        Event currentEvent = getEventById(eventId);
        if (currentEvent == null) {
            return "The event doesn't exist";
        }

        if (currentEvent.getEventsParticipants() == null) {
            currentEvent.setEventsParticipants(new ArrayList<>());
        }
        List<EventParticipant> eventParticipants = currentEvent.getEventsParticipants();

        //If the user already exist in current EventParticipant:
        for (EventParticipant eventParticipant : eventParticipants) {
            if (eventParticipant.getUser().equals(currentUser)) {
                return "Current user already registered this event!";
            }
        }

        //If there are no more spaces of this event
        if (eventParticipants.size() >= currentEvent.getMaxParticipants()) {
            return "The event is fully booked!";
        }

        //create a new EventParticipant object and store it in the Entity
        EventParticipant currentParticipant = new EventParticipant();
        currentParticipant.setUser(currentUser);
        currentParticipant.setEvent(currentEvent);
        currentParticipant.setRegisteredAt(LocalDateTime.now());
        eventParticipantRepo.save(currentParticipant);

        //store new participant info in User and Event Entity
        List<EventParticipant> participantsOfUser = currentUser.getEventParticipants();
        if (participantsOfUser == null) {
            currentUser.setEventParticipants(new ArrayList<>());
        } else {
            participantsOfUser.add(currentParticipant);
        }

        eventParticipants.add(currentParticipant);
        userRepo.save(currentUser);
        eventRepo.save(currentEvent);

        //User will receive an email
        String subject = "You have registered a new event!";
        String text = "Congratulations! You have registered a new event!<br><br>"
                + "Event: " + currentEvent.getName() + "<br><br>"
                + "Start Time: " + currentEvent.getStart() + "<br><br>"
                + "End Time: " + currentEvent.getEnd() + "<br><br>"
                + "View <a href='https://funsg.dev/event/" + currentEvent.getId() + "'>"
                + "details</a> of the event";

        new Thread( () -> {
            try {
                emailService.sendEmail(currentUser.getEmail(), subject, text);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        ).start();
        return "success";
    }

    @Override
    public void sendEmailsOfEventToEventParticipant(Event event, String condition) {
        String subject;
        String text;
        if (condition.equals("updated")) {
            subject = "The details of One of your Event has been updated!";
            text = "Please note the changes of the upcoming event.<br><br>"
                    + "Event: " + event.getName() + "<br><br>"
                    + "Start Time: " + event.getStart() + "<br><br>"
                    + "End Time: " + event.getEnd() + "<br><br>"
                    + "View <a href='https://funsg.dev/event/" + event.getId() + "'>"
                    + "details</a> of the event";
        } else if (condition.equals("canceled")) {
            subject = "One of your Event has been canceled!";
            text = "Please note the event below is canceled:<br><br>"
                    + "Event: " + event.getName() + "<br><br>"
                    + "Start Time: " + event.getStart() + "<br><br>"
                    + "End Time: " + event.getEnd() ;
        } else {
            return;
        }

        Event curEvent = eventRepo.findByIdWithParticipants(event.getId());
        List<EventParticipant> eventParticipants = curEvent.getEventsParticipants();
        for (EventParticipant eventParticipant : eventParticipants) {
            try {
                emailService.sendEmail(eventParticipant.getUser().getEmail(), subject, text);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    @Override
    public void sendEmailOfEventToGroupMembers(Event event, Group group) {

        String subject = "A new event of " + group.getName() + " is coming!";
        String text = "Upcoming event: <br><br>"
                + "  Event: " + event.getName() + "<br><br>"
                + "  Start Time: " + event.getStart() + "<br><br>"
                + "  End Time: " + event.getEnd() + "<br><br>"
                + "  View <a href='https://funsg.dev/event/" + event.getId() + "'>"
                + "details</a> of the event";

        List<Member> members = group.getMembers();
        members.forEach(member -> {
            try {
                emailService.sendEmail(member.getUser().getEmail(), subject, text);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        });
    }

    @Override
    public void updateEventStatusByDate(List<Event> events) {
        events.forEach(event -> {
            if (event.getEnd().isBefore(LocalDateTime.now())) {
                event.setStatus("close");
            }
        });
    }



    @Override
    public List<Event> getEventsByMBTI(User currentUser) {
        List<Event> events = eventRepo.findUpcomingEvents();
        List<Event> sortedEvents = events.stream()
                .filter(event -> !checkUserInEvent(currentUser, event))
                .sorted(Comparator.comparing(event -> calScoreOfEvent(currentUser, (Event) event)).reversed())
                .toList();
        return sortedEvents;
    }

    //helper method: to check whether a user is in a event
    private boolean checkUserInEvent(User currentUser, Event event) {
        List<EventParticipant> eventParticipants = eventParticipantRepo.findByUser(currentUser);

        boolean condition = eventParticipants
                .stream()
                .anyMatch(eventParticipant ->
                        eventParticipant.getEvent().getId().equals(event.getId()));
        return condition;
    }

    @Override
    public List<Event> getEventsByCategoryId(Long categoryId) {
        Category category = categoryRepo.findById(categoryId).orElse(null);
        if (category == null) {
            return null;
        }
        return eventRepo.findByCategory(category);
    }

    @Override
    public List<Event> searchEvents(String query) {
        String[] keywords = query.split("\\s+");

        Set<Event> eventSet  = new HashSet<>();
        for (String keyword : keywords) {
            eventSet.addAll(eventRepo.findBySearchTerm(keyword));
        }
        List<Event> eventsResult = eventSet.stream()
                .sorted(Comparator.comparing(Event::getName))
                .toList();
        return eventsResult;
    }

    @Override
    public Event saveEvent(Event event) {
        return eventRepo.save(event);
    }

    @Override
    public List<User> getEventParticipants(Long eventId) {
        List<EventParticipant> eventsParticipants = eventRepo.findByIdWithParticipants(eventId).getEventsParticipants();
        List<User> participants = new ArrayList<>();

        eventsParticipants.forEach(eventParticipant ->
                participants.add(eventParticipant.getUser()));

        return participants;
    }

    @Override
    public List<Event> getParticipatedEventsByUserId(Long id) {
        User user = userRepo.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        List<EventParticipant> eventParticipants = eventParticipantRepo.findByUser(user);
        List<Event> events = eventParticipants.stream()
                .map(EventParticipant::getEvent)
                .toList();
        return events;
    }

    @Override
    public List<Event> getEventsByGroup(Group group) {
        return eventRepo.findByGroup(group);
    }

    @Override
    public Event getEventByName(String eventName) {
        return eventRepo.findByName(eventName);
    }

    @Override
    public Event updateEventStatus(Long eventId, String status) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus(status);
        return eventRepo.save(event);
    }

    @Override
    public List<Event> getAllOrganisedEvents() {
        return eventRepo.findAllOrganisedEvents();
    }

    @Override
    public Page<Event> getAllEvents(Pageable pageable) {
        return eventRepo.findAll(pageable);
    }

    @Override
    public Page<Event> getAllEventsByCategoryId(Long categoryId, Pageable pageable) {
       return eventRepo.findAllEventsByCategoryId(categoryId,pageable);
    }


    @Override
    public List<Event> getEventsOfHost(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return eventRepo.findByCreatedBy(user);
    }

    @Override
    public Event exitEvent(Event event, User currentUser) {
        List<EventParticipant> eventParticipants = eventParticipantRepo.findByUser(currentUser);

        EventParticipant eventParticipant = eventParticipants.stream()
                .filter(eP -> eP.getEvent().getId().equals(event.getId()))
                .findAny()
                .orElse(null);

        if (eventParticipant == null) {
            return null;
        }

        eventParticipants.remove(eventParticipant);
        userRepo.save(currentUser);

        Event newEvent = eventParticipant.getEvent();
        newEvent.getEventsParticipants().remove(eventParticipant);
        eventRepo.save(newEvent);

        eventParticipantRepo.delete(eventParticipant);

        return newEvent;
    }

    //helper method: Calculate a score to indicate the degree of fit between a user and a event on the four dimensions of MBTI
    private double calScoreOfEvent(User user, Event event) {
        double score;
        double[] user_mbti_vec = {user.getIE_Tendancy(), user.getNS_Tendancy(),
                user.getTF_Tendancy(), user.getJP_Tendancy()};

        Category category = event.getGroup().getCategory();
        double[] event_mbti_vec = {category.getIE_Tendancy(), category.getNS_Tendancy(),
                category.getTF_Tendancy(), category.getJP_Tendancy()};

        double[] user_events_mbti_vec = getMBTIVecOfUserEvents(user);

        User publisher = event.getCreatedBy();
        double[] event_publisher_mbti_vec = {publisher.getIE_Tendancy(), publisher.getNS_Tendancy(),
                publisher.getTF_Tendancy(), publisher.getJP_Tendancy()};

        Random rnd = new Random();

        score = 0.4 * calCosSimilarity(user_mbti_vec, event_mbti_vec) +
                0.2 * calCosSimilarity(user_events_mbti_vec, event_mbti_vec) +
                0.2 * calCosSimilarity(user_mbti_vec, event_publisher_mbti_vec) +
                0.2 * rnd.nextDouble();
        return score;
    }

    //helper method: get MBTI vector based on all the events that a user has taken part in
    private double[] getMBTIVecOfUserEvents(User user) {
        double[] user_events_mbti_vec = new double[4];
        List<EventParticipant> eventParticipants = eventParticipantRepo.findByUser(user);
        eventParticipants.forEach( eventParticipant -> {
            Category category = eventParticipant.getEvent().getGroup().getCategory();
            user_events_mbti_vec[0] += category.getIE_Tendancy();
            user_events_mbti_vec[1] += category.getNS_Tendancy();
            user_events_mbti_vec[2] += category.getTF_Tendancy();
            user_events_mbti_vec[3] += category.getJP_Tendancy();
        });
        return user_events_mbti_vec;
    }

}
