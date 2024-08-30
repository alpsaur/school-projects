package sg.nus.iss.adproj.funsg.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sg.nus.iss.adproj.funsg.interfacemethods.CategoryInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.EventInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.GroupInterface;
import sg.nus.iss.adproj.funsg.model.dto.CategoryInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.EventInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.GroupInfoResponse;
import sg.nus.iss.adproj.funsg.model.entity.Category;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.utils.DtoConverter;
import sg.nus.iss.adproj.funsg.service.CategoryImplementation;
import sg.nus.iss.adproj.funsg.service.EventImplementation;
import sg.nus.iss.adproj.funsg.service.GroupImplementation;

import java.util.List;

@RequestMapping("/categories")
@RestController
public class CategoryController {
    private final CategoryInterface categoryService;
    private final EventInterface eventService;
    private final GroupInterface groupService;

    public CategoryController(CategoryImplementation categoryService, EventImplementation eventService, GroupImplementation groupService) {
        this.categoryService = categoryService;
        this.eventService = eventService;
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryInfoResponse>> getAllCategories() {
        // Get a list of all categories
        List<Category> categories = categoryService.getAllCategories();

        if (categories == null || categories.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        List<CategoryInfoResponse> categoriesResponse = categories.stream()
                .map(DtoConverter::convertToCategoryInfoResponse).toList();

        return ResponseEntity.ok(categoriesResponse);
    }


    @GetMapping("/{categoryId}/events")
    public ResponseEntity<List<EventInfoResponse>> getEventsByCategory(@PathVariable Long categoryId) {
        // Get a list of events under a specific category
        List<Event> events = eventService.getEventsByCategoryId(categoryId);

        if (events == null || events.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        List<EventInfoResponse> eventList = events.stream()
                .map(DtoConverter::convertToEventInfoResponse).toList();
        return ResponseEntity.ok(eventList);
    }

    @GetMapping("/{categoryId}/groups")
    public ResponseEntity<List<GroupInfoResponse>> getGroupsByCategory(@PathVariable Long categoryId) {
        // Get a list of groups under a specific category
        List<Group> groups = groupService.getGroupsByCategoryId(categoryId);

        if (groups == null || groups.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        List<GroupInfoResponse> groupList = groups.stream()
                .map(DtoConverter::convertToGroupInfoResponse).toList();
        return ResponseEntity.ok(groupList);
    }
}
