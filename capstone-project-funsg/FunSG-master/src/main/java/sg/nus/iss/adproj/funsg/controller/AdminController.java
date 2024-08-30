package sg.nus.iss.adproj.funsg.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;
import sg.nus.iss.adproj.funsg.interfacemethods.EventInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.GroupInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.UserInterface;
import sg.nus.iss.adproj.funsg.model.dto.AdminGroupResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminMonthlyReportMetrics;
import sg.nus.iss.adproj.funsg.model.dto.AdminMonthlyReportResponse;
import sg.nus.iss.adproj.funsg.model.entity.MonthlyReport;
import sg.nus.iss.adproj.funsg.model.dto.AdminOverviewStatsResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminPaginatedEventResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminPaginatedGroupResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminPaginatedUserResponse;
import sg.nus.iss.adproj.funsg.model.dto.AdminStatItem;
import sg.nus.iss.adproj.funsg.model.dto.AdminStatusUpdateRequest;
import sg.nus.iss.adproj.funsg.model.dto.AdminUserResponse;
import sg.nus.iss.adproj.funsg.model.dto.EventInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.UserProfileResponse;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.MonthlyReportRecord;
import sg.nus.iss.adproj.funsg.model.entity.MonthlyReportSummaryRecord;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.model.utils.DtoConverter;
import sg.nus.iss.adproj.funsg.service.EventImplementation;
import sg.nus.iss.adproj.funsg.service.GroupImplementation;
import sg.nus.iss.adproj.funsg.service.ReportService;
import sg.nus.iss.adproj.funsg.service.UserImplementation;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RequestMapping("admin")
@RestController
public class AdminController {
    private final UserInterface userService;
    private final ReportService reportService;
    private final EventInterface eventService;
    private final GroupInterface groupService;

    public AdminController(UserImplementation userService, ReportService reportService, EventImplementation eventService, GroupImplementation groupService) {
        this.userService = userService;
        this.reportService = reportService;
        this.eventService = eventService;
        this.groupService = groupService;

    }

    @GetMapping("/stats")
    public ResponseEntity<AdminOverviewStatsResponse> getOverviewStats() {
        List<User> users = userService.getAllUsers();
        List<Group> groups = groupService.getAllActiveGroups();
        List<Event> events = eventService.getAllOrganisedEvents();

        AdminStatItem userStatItem = AdminStatItem.builder()
                .id(1)
                .name("Total Users")
                .stat(users.size())
                .build();

        AdminStatItem groupStatItem = AdminStatItem.builder()
                .id(2)
                .name("Total Groups")
                .stat(groups.size())
                .build();

        AdminStatItem eventStatItem = AdminStatItem.builder()
                .id(3)
                .name("Total Events")
                .stat(events.size())
                .build();

        AdminOverviewStatsResponse response = AdminOverviewStatsResponse.builder()
                .statItems(List.of(userStatItem, groupStatItem, eventStatItem))
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthlyReport/data")
    public ResponseEntity<AdminMonthlyReportResponse> getMonthlyReportData(@RequestParam int year, @RequestParam int month) {
        MonthlyReport report = reportService.generateMonthlyReport(year, month);
        AdminMonthlyReportResponse reportResponse = new AdminMonthlyReportResponse();
        AdminMonthlyReportMetrics userMetrics = DtoConverter.convertToAdminMonthlyReportMetrics(report, "user");
        AdminMonthlyReportMetrics groupMetrics = DtoConverter.convertToAdminMonthlyReportMetrics(report, "group");
        AdminMonthlyReportMetrics eventMetrics = DtoConverter.convertToAdminMonthlyReportMetrics(report, "event");
        reportResponse.setMetrics(List.of(userMetrics, groupMetrics, eventMetrics));
        reportResponse.setNewUsers(report.getNewUsers());
        reportResponse.setNewGroups(report.getNewGroups());
        reportResponse.setNewEvents(report.getNewEvents());
        return ResponseEntity.ok(reportResponse);
    }

    @GetMapping("/monthlyReport")
    public void getMonthlyReport(HttpServletResponse response, @RequestParam int year, @RequestParam int month) throws IOException {
        response.setContentType("text/csv");
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormat.format(new Date());
        String headerKey = "Content-Disposition";
        String headerValue = String.format("attachment; filename=monthly_report_" + currentDateTime + ".csv");
        response.setHeader(headerKey, headerValue);

        MonthlyReport report = reportService.generateMonthlyReport(year, month);

        List<MonthlyReportRecord> recordsForReport = prepareReportData(report);

        List<MonthlyReportSummaryRecord> summaryRecords = new ArrayList<>();
        summaryRecords.add(MonthlyReportSummaryRecord.of("Total New Users", String.valueOf(report.getNewUsersThisMonth())));
        summaryRecords.add(MonthlyReportSummaryRecord.of("User Growth (%)", String.format("%.2f", report.getUserGrowth())));
        summaryRecords.add(MonthlyReportSummaryRecord.of("Total New Groups", String.valueOf(report.getNewGroupsThisMonth())));
        summaryRecords.add(MonthlyReportSummaryRecord.of("Group Growth (%)", String.format("%.2f", report.getGroupGrowth())));
        summaryRecords.add(MonthlyReportSummaryRecord.of("Total New Events", String.valueOf(report.getNewEventsThisMonth())));
        summaryRecords.add(MonthlyReportSummaryRecord.of("Event Growth (%)", String.format("%.2f", report.getEventGrowth())));

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        // Write summary data to CSV
        csvWriter.writeHeader(MonthlyReportSummaryRecord.CSV_HEADER);
        for (MonthlyReportSummaryRecord summaryRecord : summaryRecords) {
            csvWriter.write(summaryRecord, MonthlyReportSummaryRecord.CSV_NAME_MAPPING);
        }

        // Write detailed data to CSV
        csvWriter.writeHeader(MonthlyReportRecord.CSV_HEADER);
        for (MonthlyReportRecord record : recordsForReport) {
            csvWriter.write(record, MonthlyReportRecord.CSV_NAME_MAPPING);
        }

        csvWriter.close();


    }

    private List<MonthlyReportRecord> prepareReportData(MonthlyReport report) {
        List<MonthlyReportRecord> records = new ArrayList<>();

        for (UserProfileResponse user : report.getNewUsers()) {
            records.add(MonthlyReportRecord.builder()
                    .type("User")
                    .id(user.getUserId())
                    .name(user.getName())
                    .description(user.getEmail())
                    .createdAt(user.getCreatedAt())
                    .build());
        }

        for (AdminGroupResponse group : report.getNewGroups()) {
            records.add(MonthlyReportRecord.builder()
                    .type("Group")
                    .id(group.getId())
                    .name(group.getName())
                    .description(group.getDescription())
                    .createdAt(group.getCreatedAt())
                    .build());
        }

        for (EventInfoResponse event : report.getNewEvents()) {
            records.add(MonthlyReportRecord.builder()
                    .type("Event")
                    .id(event.getId())
                    .name(event.getName())
                    .startDate(event.getStart().toString())
                    .endDate(event.getEnd().toString())
                    .location(event.getLocation())
                    .groupId(event.getGroupId())
                    .groupName(event.getGroupName())
                    .createdAt(event.getCreatedAt())
                    .build());
        }

        return records;
    }


    @GetMapping("/users")
    public ResponseEntity<AdminPaginatedUserResponse> getUsers(@RequestParam(name = "_start", defaultValue = "0") int start,
                                                               @RequestParam(name = "_limit", defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(start / limit, limit);
        Page<User> userPages;

        userPages = userService.getAll(pageable);

        if (userPages == null || userPages.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<AdminUserResponse> adminUserResponses = userPages.stream()
                .map(DtoConverter::convertToAdminUserResponse)
                .toList();
        AdminPaginatedUserResponse response = DtoConverter.convertToAdminPaginatedUserResponse(adminUserResponses, userPages);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/groups")
    public ResponseEntity<AdminPaginatedGroupResponse> getAdminGroups(@RequestParam(required = false) Long categoryId,
                                                                      @RequestParam(name = "_start", defaultValue = "0") int start,
                                                                      @RequestParam(name = "_limit", defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(start / limit, limit);
        Page<Group> groupPages;

        if (categoryId != null) {
            groupPages = groupService.getAllNonPendingGroupsByCategoryId(categoryId, pageable);
        } else {
            groupPages = groupService.getAllNonPendingGroups(pageable);
        }

        if (groupPages == null || groupPages.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<AdminGroupResponse> groupResponses = groupPages.stream().map(DtoConverter::convertToAdminGroupResponse).toList();

        AdminPaginatedGroupResponse response = DtoConverter.convertToAdminPaginatedGroupResponse(groupResponses, groupPages);
        return ResponseEntity.ok(response);

    }

    @GetMapping("/events")
    public ResponseEntity<AdminPaginatedEventResponse> getEvents(@RequestParam(required = false) Long categoryId,
                                                                 @RequestParam(name = "_start", defaultValue = "0") int start,
                                                                 @RequestParam(name = "_limit", defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(start / limit, limit);
        Page<Event> eventPages;

        if (categoryId != null) {
            eventPages = eventService.getAllEventsByCategoryId(categoryId, pageable);
        } else {
            eventPages = eventService.getAllEvents(pageable);
        }

        if (eventPages == null || eventPages.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        List<EventInfoResponse> eventResponse = eventPages.stream()
                .map(DtoConverter::convertToEventInfoResponse).toList();

        AdminPaginatedEventResponse response = DtoConverter.convertToAdminPaginatedEventResponse(eventResponse, eventPages);

        return ResponseEntity.ok(response);


    }

    @GetMapping("/newGroups")
    public ResponseEntity<List<AdminGroupResponse>> getNewGroups() {
        List<Group> groups = groupService.getGroupsWithPending();
        if (groups.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<AdminGroupResponse> responses = groups.stream().map(DtoConverter::convertToAdminGroupResponse).toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/groups/{groupId}/status")
    public ResponseEntity<Group> updateGroupStatus(@PathVariable Long groupId, @RequestBody AdminStatusUpdateRequest statusUpdateRequest) {
        Group updatedGroup = groupService.updateGroupStatus(groupId, statusUpdateRequest);
        return ResponseEntity.ok(updatedGroup);
    }

    @PostMapping("/events/{eventId}/status")
    public ResponseEntity<Event> updateEventStatus(@PathVariable Long eventId, @RequestBody AdminStatusUpdateRequest statusUpdateRequest) {
        Event updatedEvent = eventService.updateEventStatus(eventId, statusUpdateRequest.getStatus());
        return ResponseEntity.ok(updatedEvent);
    }

    @PostMapping("/users/{userId}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Long userId, @RequestBody AdminStatusUpdateRequest statusUpdateRequest) {
        User updatedUser = userService.updateUserStatus(userId, statusUpdateRequest.getStatus());
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/events/status")
    public ResponseEntity<?> updateAllEventsStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if (!currentUser.getStatus().equals("admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Only admin users can execute this operation");
        }
        List<Event> events = eventService.getAllEventsSortedByStartDate();
        eventService.updateEventStatusByDate(events);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
