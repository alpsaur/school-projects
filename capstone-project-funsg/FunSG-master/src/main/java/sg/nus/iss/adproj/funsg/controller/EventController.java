package sg.nus.iss.adproj.funsg.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sg.nus.iss.adproj.funsg.interfacemethods.EventArtifactInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.EventInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.GroupInterface;
import sg.nus.iss.adproj.funsg.model.dto.*;
import sg.nus.iss.adproj.funsg.model.utils.DtoConverter;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.EventArtifact;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.service.EventArtifactImplementation;
import sg.nus.iss.adproj.funsg.service.EventImplementation;
import sg.nus.iss.adproj.funsg.service.S3UploadService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RequestMapping("/events")
@RestController
public class EventController {
    private final EventInterface eventService;
    private final GroupInterface groupService;
    private final S3UploadService s3UploadService;
    private final EventArtifactInterface eventArtifactService;


    public EventController(EventImplementation eventService, GroupInterface groupService, S3UploadService s3UploadService, EventArtifactImplementation eventArtifactService) {
        this.eventService = eventService;
        this.groupService = groupService;
        this.s3UploadService = s3UploadService;
        this.eventArtifactService = eventArtifactService;
    }

    @GetMapping
    public ResponseEntity<List<EventInfoResponse>> getEvents() {

        // Return list of events sorted by StartDate (The earliest one which is still "open" would the first)
        List<Event> events = eventService.getAllEventsSortedByStartDate();
        if (events == null || events.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        List<EventInfoResponse> eventList = events.stream()
                .map(DtoConverter::convertToEventInfoResponse).toList();

        return ResponseEntity.ok(eventList);
    }

    @GetMapping("/recommendations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EventInfoResponse>> getEventRecommendationsByMBTI() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Get recommendations based on the user's MBTI tendencies
        List<Event> events = eventService.getEventsByMBTI(currentUser);
        if (events == null || events.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        List<EventInfoResponse> eventList = events.stream()
                .map(DtoConverter::convertToEventInfoResponse)
                .toList();

        return ResponseEntity.ok(eventList);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventInfoResponse> getEventDetails(@PathVariable Long eventId) {

        Event event = eventService.getEventById(eventId);

        if (event != null) {
            EventInfoResponse eventInfoResponse = DtoConverter.convertToEventInfoResponse(event);
            return ResponseEntity.ok(eventInfoResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint for create an event under a particular group
    // create group: upload the group image photo
    @PostMapping("/{groupId}/eventImage")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadEventPhoto(@PathVariable Long groupId, @RequestParam("file") MultipartFile file) {
        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        // Store the event profile image into aws s3 cloud storage
        String fileUrl;
        String directory = "GroupMedia/" + group.getId() + "/Events/ProfileImage";
        try {
            fileUrl = s3UploadService.uploadFile(file, directory);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload!");
        }

        // return Frontend the group image url. Frontend Need to put the fileUrl as the hidden filed of the Create Event Form
        return ResponseEntity.status(HttpStatus.CREATED).body(fileUrl);
    }

    @PostMapping("/{groupId}/events")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createEvent(@PathVariable Long groupId, @RequestBody CreateEventRequest eventRequest) {
        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        if (eventService.getEventByName(eventRequest.getName()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An event with this name already exists!");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (!group.getHost().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to create event for this group");
        }

        Event event = Event.builder()
                .name(eventRequest.getName())
                .start(eventRequest.getStart())
                .end(eventRequest.getEnd())
                .description(eventRequest.getDescription())
                .location(eventRequest.getLocation())
                .profileImagePath(eventRequest.getEventImageUrl())
                .maxParticipants(eventRequest.getMaxParticipants())
                .createdBy(currentUser)
                .status("open")
                .group(group)
                .build();

        Event savedEvent = eventService.saveEvent(event);
        new Thread( () ->
            eventService.sendEmailOfEventToGroupMembers(savedEvent, group)
        ).start();

        return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable Long eventId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Handle event registration
        String condition = eventService.registerForEvent(eventId, currentUser);
        if (condition.equals("success")) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(condition);
        }
    }


    // Host view the signup rate
    @GetMapping("/{eventId}/participants")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getEventParticipants(@PathVariable Long eventId) {
        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (!event.getGroup().getHost().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to view sign up rate");
        }

        List<User> participants = eventService.getEventParticipants(eventId);

        if (participants == null || participants.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<UserProfileResponse> participantsResponses = participants.stream().map(DtoConverter::convertToUserProfileResponse).toList();

        return ResponseEntity.status(200).body(participantsResponses);
    }

    // Host delete event
    @DeleteMapping("/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        // Fetch the event
        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
        }

        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Check if the current user is authorized to delete (cancel) the event
        if (!event.getGroup().getHost().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this event");
        }

        // Update the event status to "cancelled" instead of deleting it (Cannot delete an event due to Foreign Key constraint)
        event.setStatus("canceled");
        eventService.saveEvent(event);

        new Thread( () ->
            eventService.sendEmailsOfEventToEventParticipant(event,"canceled")
        ).start();

        // Return a success response with the updated event or a confirmation message
        return ResponseEntity.ok("Event has been successfully cancelled.");
    }

    //user exit event
    @DeleteMapping("/{eventId}/exit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> exitEvent(@PathVariable Long eventId) {
        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Event updatedEvent = eventService.exitEvent(event,currentUser);
        if (updatedEvent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user has not registered the event");
        }

        EventInfoResponse eventInfoResponse = DtoConverter.convertToEventInfoResponse(updatedEvent);
        return ResponseEntity.status(HttpStatus.OK).body(eventInfoResponse);
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @RequestBody CreateEventRequest eventRequest) {
        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (!event.getCreatedBy().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this event");
        }

        event.setName(eventRequest.getName());
        event.setDescription(eventRequest.getDescription());
        event.setLocation(eventRequest.getLocation());
        event.setStart(eventRequest.getStart());
        event.setEnd(eventRequest.getEnd());
        event.setMaxParticipants(eventRequest.getMaxParticipants());
        event.setProfileImagePath(eventRequest.getEventImageUrl());
        Event updatedEvent = eventService.saveEvent(event);

        new Thread( () ->
            eventService.sendEmailsOfEventToEventParticipant(event,"updated")
        ).start();

        return ResponseEntity.ok(updatedEvent);
    }


    // Host upload multiple event photos after the event
    @PostMapping("/{eventId}/media")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addMediaToEvent(@PathVariable Long eventId, @RequestParam("file") MultipartFile file) {
        //Todo: Debug
        Event event = eventService.getEventById(eventId);

        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (!event.getGroup().getHost().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to add media to this event");
        }

        Group group = event.getGroup();
        String directory = "GroupMedia/" + group.getId() + "/Events/" + eventId;

        try {
            String fileUrl = s3UploadService.uploadFile(file, directory);
            String fileType = file.getContentType(); //returns the MIME type of the uploaded file as a String, Common MIME types include image/jpeg, image/png, video/mp4, application/pdf

            EventArtifact artifact = EventArtifact.builder()
                    .event(event)
                    .type(fileType)
                    .filePath(fileUrl)
                    .uploadedBy(currentUser)
                    .uploadedAt(LocalDateTime.now())
                    .build();
            EventArtifact savedArtifact = eventArtifactService.saveEventArtifact(artifact);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedArtifact);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/{groupId}/events/Image")
    public ResponseEntity<?> getEventImageByGroup(@PathVariable Long groupId) {
        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found");
        }

        List<String> eventsArtifactFilePath = eventArtifactService.getEventsFilePathByGroup(group);
        return ResponseEntity.status(HttpStatus.OK).body(eventsArtifactFilePath);
    }

    @GetMapping("/{groupId}/events")
    public ResponseEntity<List<EventInfoResponse>> getEventsByGroup(@PathVariable Long groupId) {

        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        List<Event> events = eventService.getEventsByGroup(group);
        List<EventInfoResponse> eventList = events.stream()
                .map(DtoConverter::convertToEventInfoResponse)
                .toList();

        return ResponseEntity.ok(eventList);
    }

    @GetMapping("/{userId}/hostEvents")
    public ResponseEntity<List<EventInfoResponse>> getAllEventsOfAHost(@PathVariable Long userId) {

        List<Event> events = eventService.getEventsOfHost(userId);
        if (events == null || events.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        List<EventInfoResponse> eventList = events.stream()
                .map(DtoConverter::convertToEventInfoResponse)
                .toList();
        return ResponseEntity.ok(eventList);
    }


}
