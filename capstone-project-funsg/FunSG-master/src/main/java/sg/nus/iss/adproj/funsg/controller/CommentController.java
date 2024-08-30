package sg.nus.iss.adproj.funsg.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sg.nus.iss.adproj.funsg.interfacemethods.CommentInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.GroupInterface;

import sg.nus.iss.adproj.funsg.model.dto.CommentInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.CommentRequest;
import sg.nus.iss.adproj.funsg.model.entity.Comment;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.model.utils.DtoConverter;
import sg.nus.iss.adproj.funsg.service.CommentImplementation;
import sg.nus.iss.adproj.funsg.service.GroupImplementation;


import java.time.LocalDateTime;
import java.util.List;

@RequestMapping("/comments")
@RestController
public class CommentController {
    private final GroupInterface groupService;
    private final CommentInterface commentService;


    public CommentController(final GroupImplementation groupService, final CommentImplementation commentService) {
        this.groupService = groupService;
        this.commentService = commentService;

    }

    // Get comments for a specific group
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<CommentInfoResponse>> getCommentsByGroup(@PathVariable Long groupId) {
        List<Comment> comments = commentService.findByGroupId(groupId);

        if (comments.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            List<CommentInfoResponse> commentInfoResponses = comments.stream()
                    .map(DtoConverter::convertToCommentInfoResponse).toList();
            return ResponseEntity.ok(commentInfoResponses);
        }
    }

    // Post a new comment under a specific group
    @PostMapping("/group/{groupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentInfoResponse> postComment(@PathVariable Long groupId, @RequestBody CommentRequest commentRequest) {

        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Comment comment = new Comment();
        comment.setGroup(group);
        comment.setUser(currentUser);
        comment.setContent(commentRequest.getContent());
        comment.setPostedAt(LocalDateTime.now());

        Comment savedComment = commentService.saveComment(comment);

        return ResponseEntity.status(HttpStatus.CREATED).body(DtoConverter.convertToCommentInfoResponse(savedComment));
    }
}






