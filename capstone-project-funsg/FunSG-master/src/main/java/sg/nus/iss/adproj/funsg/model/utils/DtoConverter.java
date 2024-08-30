package sg.nus.iss.adproj.funsg.model.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import sg.nus.iss.adproj.funsg.interfacemethods.EventArtifactInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.EventInterface;
import sg.nus.iss.adproj.funsg.model.dto.AdminGroupResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminMonthlyReportMetrics;
import sg.nus.iss.adproj.funsg.model.dto.AdminPaginatedEventResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminPaginatedGroupResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminPaginatedUserResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminUserResponse;
import sg.nus.iss.adproj.funsg.model.dto.CategoryInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.CommentInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.EventInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.GroupInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.UserProfileResponse;
import sg.nus.iss.adproj.funsg.model.entity.Category;
import sg.nus.iss.adproj.funsg.model.entity.Comment;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.MonthlyReport;
import sg.nus.iss.adproj.funsg.model.entity.User;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DtoConverter {

    private static EventInterface eventService;
    private static EventArtifactInterface eventArtifactService;

    @Autowired
    public void setEventService(EventInterface eventService) {
        DtoConverter.eventService = eventService;
    }

    @Autowired
    public void setEventArtifactService(EventArtifactInterface eventArtifactService) {
        DtoConverter.eventArtifactService = eventArtifactService;
    }

    public static UserProfileResponse convertToUserProfileResponse(User user) {
        return UserProfileResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .profileImage(user.getProfileImagePath())
                .build();
    }

    public static GroupInfoResponse convertToGroupInfoResponse(Group group) {
        List<Event> events = eventService.getEventsByGroup(group);

        return GroupInfoResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .categoryId(group.getCategory().getId())
                .categoryName(group.getCategory().getName())
                .status(group.getStatus())
                .profileImagePath(group.getProfileImagePath())
                .host(convertToUserProfileResponse(group.getHost()))
                .members(group.getMembers()
                        .stream()
                        .map(member -> convertToUserProfileResponse(member.getUser()))
                        .toList())
                .numberOfEvents(events.size())
                .build();
    }

    public static EventInfoResponse convertToEventInfoResponse(Event event) {
        List<String> eventArtifactFilePaths = eventArtifactService.getEventsFilePathByEvent(event);
        return EventInfoResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .start(event.getStart())
                .end(event.getEnd())
                .groupId(event.getGroup().getId())
                .groupName(event.getGroup().getName())
                .categoryName(event.getGroup().getCategory().getName())
                .status(event.getStatus())
                .location(event.getLocation())
                .createdAt(event.getCreatedAt())
                .createdBy(convertToUserProfileResponse(event.getCreatedBy()))
                .maxParticipants(event.getMaxParticipants())
                .profileImagePath(event.getProfileImagePath())
                .eventParticipants(event.getEventsParticipants()
                        .stream()
                        .map(eventParticipant -> convertToUserProfileResponse(eventParticipant.getUser()))
                        .toList())
                .eventArtifactFilePaths(eventArtifactFilePaths)
                .build();
    }

    public static CategoryInfoResponse convertToCategoryInfoResponse(Category category) {
        return CategoryInfoResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .groups(category.getGroups().stream().map(DtoConverter::convertToGroupInfoResponse).toList())
                .build();
    }

    public static AdminUserResponse convertToAdminUserResponse(User user) {
        return AdminUserResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImage(user.getProfileImagePath())
                .createdAt(user.getCreatedAt())
                .NS_Tendancy(user.getNS_Tendancy())
                .TF_Tendancy(user.getTF_Tendancy())
                .IE_Tendancy(user.getIE_Tendancy())
                .JP_Tendancy(user.getJP_Tendancy())
                .status(user.getStatus())
                .events(user.getEventParticipants().stream().map(eventParticipant -> eventParticipant.getEvent().getName() + " - " + eventParticipant.getEvent().getStart().toLocalDate()).collect(Collectors.toList()))
                .groups(user.getMembers().stream().filter(member -> !user.getOwnGroups().contains(member.getGroup())).map(member -> member.getGroup().getName()).toList())
                .hostedGroups(user.getOwnGroups().stream().map(group -> group.getName()).toList())
                .build();
    }

    public static AdminGroupResponse convertToAdminGroupResponse(Group group) {
        return AdminGroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .profileImagePath(group.getProfileImagePath())
                .createdAt(group.getCreatedAt())
                .host(group.getHost().getName())
                .status(group.getStatus())
                .numOfMember(group.getMembers().size())
                .numOfEvent(group.getEvents().size())
                .categoryId(group.getCategory().getId())
                .categoryName(group.getCategory().getName())
                .members(
                        group.getMembers().stream()
                                .map(member -> convertToUserProfileResponse(member.getUser()))
                                .collect(Collectors.toList())
                )
                .events(group.getEvents().stream().map(DtoConverter::convertToEventInfoResponse).toList())
                .build();
    }

    public static AdminPaginatedGroupResponse convertToAdminPaginatedGroupResponse(List<AdminGroupResponse> groupResponses, Page<Group> groupPage) {
        return AdminPaginatedGroupResponse.builder()
                .groups(groupResponses)
                .totalPages(groupPage.getTotalPages())
                .totalElements(groupPage.getTotalElements())
                .number(groupPage.getNumber())
                .size(groupPage.getSize())
                .build();

    }


    public static AdminPaginatedEventResponse convertToAdminPaginatedEventResponse(List<EventInfoResponse> eventResponse, Page<Event> eventPages) {
        return AdminPaginatedEventResponse.builder()
                .events(eventResponse)
                .totalPages(eventPages.getTotalPages())
                .totalElements(eventPages.getTotalElements())
                .number(eventPages.getNumber())
                .size(eventPages.getSize())
                .build();
    }

    public static AdminPaginatedUserResponse convertToAdminPaginatedUserResponse(List<AdminUserResponse> adminUserResponses, Page<User> userPage) {
        return AdminPaginatedUserResponse.builder()
                .users(adminUserResponses)
                .totalPages(userPage.getTotalPages())
                .totalElements(userPage.getTotalElements())
                .number(userPage.getNumber())
                .size(userPage.getSize())
                .build();
    }

    public static CommentInfoResponse convertToCommentInfoResponse(Comment comment) {
        return CommentInfoResponse.builder()
                .content(comment.getContent())
                .postedAt(comment.getPostedAt())
                .user(convertToUserProfileResponse(comment.getUser()))
                .build();
    }

    public static AdminMonthlyReportMetrics convertToAdminMonthlyReportMetrics(MonthlyReport report, String type) {
        if (type.equals("user")) {
            return AdminMonthlyReportMetrics.builder()
                    .title("Total New Users")
                    .totalNumber(report.getNewUsersThisMonth())
                    .growth(report.getUserGrowth())
                    .changeType(report.getUserGrowth() >= 0 ? "increase" : "decrease")
                    .build();
        } else if (type.equals("group")) {
            return AdminMonthlyReportMetrics.builder()
                    .title("Total New Groups")
                    .totalNumber(report.getNewGroupsThisMonth())
                    .growth(report.getGroupGrowth())
                    .changeType(report.getGroupGrowth() >= 0 ? "increase" : "decrease")
                    .build();
        } else if (type.equals("event")) {
            return AdminMonthlyReportMetrics.builder()
                    .title("Total New Events")
                    .totalNumber(report.getNewEventsThisMonth())
                    .growth(report.getEventGrowth())
                    .changeType(report.getEventGrowth() >= 0 ? "increase" : "decrease")
                    .build();
        }
        throw new IllegalArgumentException("Unsupported type: " + type);
    }

}
