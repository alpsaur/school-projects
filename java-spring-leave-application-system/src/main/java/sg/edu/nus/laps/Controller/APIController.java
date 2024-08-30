package sg.edu.nus.laps.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;
import sg.edu.nus.laps.interfacemethods.*;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.model.Leave.*;
import sg.edu.nus.laps.service.*;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class APIController {


    private final UserInterface userService;
    private final LeaveBalanceInterface leaveBalanceService;
    private final WPHCalendarInterface wphCalendarService;
    private final LeaveRecordsInterface leaveRecordsService;
    private final CompensationRecordInterface compensationRecordService;

    @Autowired
    public APIController(UserImplementation userService,
                         LeaveBalanceImplementation leaveBalanceService,
                         WPHCalendarImplementation wphCalendarService,
                         LeaveRecordsImplementation leaveRecordsService,
                         CompensationRecordImplementation compensationRecordService
    ) {
        this.userService = userService;
        this.leaveBalanceService = leaveBalanceService;
        this.wphCalendarService = wphCalendarService;
        this.leaveRecordsService = leaveRecordsService;
        this.compensationRecordService = compensationRecordService;
    }


    @GetMapping("/subordinates")
    public List<User> getSubordinates(HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        if (user == null || !userService.isManager(user.getId())) {
            return null;
        }
        return userService.getSubordinatesInfo(user.getId());
    }


    @GetMapping("/subordinates/{id}")
    public List<LeaveBalance> getSubordinatesBalance(@PathVariable int id) {
        List<LeaveBalance> leaveBalances = leaveBalanceService.getSubordinatesLeaveBalanceInfo(id);
        return leaveBalances;
    }

    @PostMapping("/setHoliday")
    public ResponseEntity<WPHCalendar> setHoliday(@RequestParam(value = "date", required = false) String date,
                                                  @RequestParam(value = "set") boolean set) {
        if (date.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        if (set) {
            String month = date.substring(0, 2);
            String day = date.substring(3, 5);
            String year = date.substring(6, 10);
            date = year + "-" + month + "-" + day;
        }
        LocalDate localDate = LocalDate.parse(date);
        wphCalendarService.modifyWPHCalendar(set, localDate);
        WPHCalendar updatedHoliday = wphCalendarService.GetWPHCalendar(localDate);
        return new ResponseEntity<>(updatedHoliday, HttpStatus.CREATED);
    }

    @PostMapping("/leave/export")
    public void exportLeave(HttpServletResponse response, @RequestParam("leaveType") String leaveType,
                            @RequestParam("startDate") LocalDate startDate, @RequestParam("endDate") LocalDate endDate,
                            HttpSession session) throws IOException {

        response.setContentType("text/csv");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormatter.format(new Date());
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=reports_" + currentDateTime + ".csv";
        response.setHeader(headerKey, headerValue);

        User user = (User) session.getAttribute("user");
        List<LeaveRecords> leaveHistory;
        if (leaveType.equalsIgnoreCase("all")) {
            leaveHistory = leaveRecordsService.getLeaveRecordsByManagerIdForReport(startDate, endDate, user.getId());
        } else {
            leaveHistory = leaveRecordsService.getLeaveHistoryByManagerIdByLeaveTypeForReport(startDate, endDate, user.getId(), leaveType);
        }

        List<LeaveRecordForReport> recordsForReport = leaveHistory.stream().map(history -> LeaveRecordForReport.Builder.aLeaveRecordForReport()
                .withEndDate(history.getEndDate())
                .withStartDate(history.getStartDate())
                .withFirstName(history.getStaff().getFirstName())
                .withLastName(history.getStaff().getLastName())
                .withLeaveType(history.getLeaveType().getLeaveType())
                .withStaffId(history.getStaff().getId())
                .withStatus(history.getStatus().name())
                .withComment(history.getComment())
                .withReason(history.getReason())
                .withWorkDissenmination(history.getWorkDissenmination())
                .build()
        ).toList();

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        csvWriter.writeHeader(LeaveRecordForReport.CSV_HEADER);

        for (LeaveRecordForReport recordForReport : recordsForReport) {
            csvWriter.write(recordForReport, LeaveRecordForReport.CSV_NAME_MAPPING);
        }

        csvWriter.close();

    }

    @PostMapping("/compensation/export")
    public void exportCompensation(HttpServletResponse response, @RequestParam("searchOption") int searchOption, HttpSession session) throws IOException {
        response.setContentType("text/csv");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormatter.format(new Date());
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=reports_" + currentDateTime + ".csv";
        response.setHeader(headerKey, headerValue);

        User user = (User) session.getAttribute("user");
        List<CompensationRecord> compensationRecords;
        if (searchOption == 0) {
            compensationRecords = compensationRecordService.getAllCompensationRecordsByManagerId(user.getId());
        } else {
            compensationRecords = compensationRecordService.getCompensationRecordByStaffId(searchOption);
        }

        List<CompensationRecordForReport>recordsForReport = compensationRecords.stream().map(record -> CompensationRecordForReport.Builder.aCompensationRecordForReport()
                .withOvertimeDate(record.getOvertimeDate())
                .withOvertimeHours(record.getOvertimeHours())
                .withFirstName(record.getStaff().getFirstName())
                .withLastName(record.getStaff().getFirstName())
                .withStaffId((record.getStaff().getId()))
                .withStatus(record.getStatus().name())
                .withReason(record.getReason())
                .withComment(record.getComment())
                .build()
        ).toList();

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        csvWriter.writeHeader(CompensationRecordForReport.CSV_HEADER);

        for (CompensationRecordForReport recordForReport : recordsForReport) {
            csvWriter.write(recordForReport, CompensationRecordForReport.CSV_NAME_MAPPING);
        }

        csvWriter.close();

    }
}
