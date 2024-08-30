package sg.nus.iss.adproj.funsg.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import sg.nus.iss.adproj.funsg.interfacemethods.CategoryInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.GroupInterface;
import sg.nus.iss.adproj.funsg.model.dto.CreateGroupRequest;
import sg.nus.iss.adproj.funsg.model.dto.EditGroupRequest;
import sg.nus.iss.adproj.funsg.model.dto.GroupInfoResponse;
import sg.nus.iss.adproj.funsg.model.entity.Category;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.model.utils.DtoConverter;
import sg.nus.iss.adproj.funsg.service.GroupImplementation;
import sg.nus.iss.adproj.funsg.service.S3UploadService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RequestMapping("/groups")
@RestController
public class GroupController {
    private final GroupInterface groupService;
    private final CategoryInterface categoryService;
    private final S3UploadService s3UploadService;


    public GroupController(GroupImplementation groupService, CategoryInterface categoryService, S3UploadService s3UploadService) {
        this.groupService = groupService;
        this.categoryService = categoryService;
        this.s3UploadService = s3UploadService;
    }

    @GetMapping
    public ResponseEntity<List<GroupInfoResponse>> getGroups() {
        // Return list of groups sorted by popularity
        List<Group> groups = groupService.getAllGroupsSortedByPopularity();
        if (groups == null || groups.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<GroupInfoResponse> groupInfoResponses = groups.stream()
                .map(DtoConverter::convertToGroupInfoResponse).toList();

        return ResponseEntity.ok(groupInfoResponses);
    }



    @GetMapping("/recommendations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<GroupInfoResponse>> getGroupRecommendationsByMBTI() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Get recommendations based on the user's MBTI tendencies
        List<Group> groups = groupService.getGroupsByMBTI(currentUser);
        if (groups == null || groups.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<GroupInfoResponse> recommendedGroups = groups.stream()
                .map(DtoConverter::convertToGroupInfoResponse).toList();

        return ResponseEntity.ok(recommendedGroups);
    }

    // return the Entire Group object for all information to be displayed on Group Page
    @GetMapping("/{groupId}")
    public ResponseEntity<GroupInfoResponse> getGroupDetails(@PathVariable Long groupId) {
        // Return group details
        Group group = groupService.getGroupById(groupId);
        if (group != null) {
            GroupInfoResponse groupInfoResponse = DtoConverter.convertToGroupInfoResponse(group);
            return ResponseEntity.ok(groupInfoResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // create group: upload the group image photo
    @PostMapping("/groupImage")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadGroupPhoto(@RequestParam("file") MultipartFile file) {

        // Store the event profile image into aws s3 cloud storage
        String fileUrl;
        String directory = "GroupMedia/" + "/Groups/ProfileImage";
        try {
            fileUrl = s3UploadService.uploadFile(file, directory);
        } catch (IOException e) {
            fileUrl = null;
        }

        // return Frontend the group image url. Frontend Need to put the fileUrl as the hidden filed of the Create Group Form
        return ResponseEntity.status(HttpStatus.CREATED).body(fileUrl);
    }

    // create Group: fill in the group info
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Group> createGroup(@RequestBody CreateGroupRequest groupRequest) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Category category = categoryService.getCategoryById(groupRequest.getCategoryId());

        Group group = Group.builder()
                .name(groupRequest.getName())
                .description(groupRequest.getDescription())
                .category(category)
                .createdAt(LocalDateTime.now())
                .host(currentUser)
                .profileImagePath(groupRequest.getGroupImageUrl())
                .status("pending")
                .build();

        Group savedGroup = groupService.createGroup(group,currentUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup);
    }


    @PutMapping("/{groupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateGroup(@PathVariable Long groupId, @RequestBody EditGroupRequest groupRequest) {
        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (!group.getHost().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this group");
        }

        group.setName(groupRequest.getName());
        group.setDescription(groupRequest.getDescription());
        Group updatedGroup = groupService.saveGroup(group);

        return ResponseEntity.ok(updatedGroup);
    }

    @PostMapping("/{groupId}/join")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> joinGroup(@PathVariable Long groupId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Handle joining group
        boolean success = groupService.joinGroup(groupId, currentUser);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/{groupId}/exit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> exitGroup(@PathVariable Long groupId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Handle exit group
        boolean success = groupService.exitGroup(groupId, currentUser);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }


}
