package sg.nus.iss.adproj.funsg.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sg.nus.iss.adproj.funsg.interfacemethods.EventInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.GroupInterface;
import sg.nus.iss.adproj.funsg.model.dto.EventInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.GroupInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.WebSearchResultsResponse;
import sg.nus.iss.adproj.funsg.model.utils.DtoConverter;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.service.EventImplementation;
import sg.nus.iss.adproj.funsg.service.GroupImplementation;

import java.util.List;

@RequestMapping("/search")
@RestController
public class SearchController {
    private final EventInterface eventService;
    private final GroupInterface groupService;

    public SearchController(EventImplementation eventService, GroupImplementation groupService) {
        this.eventService = eventService;
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<?> search(@RequestParam String query, @RequestParam(required = false) String client) {

        List<Event> events = eventService.searchEvents(query);
        List<Group> groups = groupService.searchGroups(query);

        if ("android".equalsIgnoreCase(client)) {
            // Return only events for Android clients
            if(events == null || events.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            List<EventInfoResponse> eventList = events.stream().map(DtoConverter::convertToEventInfoResponse).toList();
            return ResponseEntity.ok(eventList);

        } else {
            if((groups == null || groups.isEmpty()) && (events == null || events.isEmpty())) {
                return ResponseEntity.noContent().build();
            }

            List<EventInfoResponse> eventList = events.stream().map(DtoConverter::convertToEventInfoResponse).toList();
            List<GroupInfoResponse> groupList = groups.stream().map(DtoConverter::convertToGroupInfoResponse).toList();
            
            // Combine the search results into a single DTO
            WebSearchResultsResponse webSearchResults = new WebSearchResultsResponse(eventList, groupList);
            return ResponseEntity.ok(webSearchResults);
        }
    }
}
