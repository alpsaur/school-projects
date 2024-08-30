package sg.edu.nus.laps.Controller;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import sg.edu.nus.laps.interfacemethods.LeaveProcessInterface;
import sg.edu.nus.laps.interfacemethods.LeaveRecordsInterface;
import sg.edu.nus.laps.interfacemethods.LeaveTypeInterface;
import sg.edu.nus.laps.interfacemethods.UserInterface;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.LeaveRecords;
import sg.edu.nus.laps.model.Leave.LeaveType;
import sg.edu.nus.laps.service.*;
import sg.edu.nus.laps.validator.LeaveRecordsValidator;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RequestMapping("leave")
@Controller
public class LeaveProcessController {

    private final LeaveProcessInterface leaveProcessService;
    private final LeaveRecordsInterface leaveRecordsService;
    private final UserInterface userService;
    private final LeaveTypeInterface leaveTypeService;

    @Autowired
    private  LeaveRecordsValidator leaveRecordsValidator;

    @Autowired
    private EmailService emailService;

    @Autowired
    public LeaveProcessController(
            final LeaveRecordsImplementation leaveRecordsService,
            final UserImplementation userService,
            final LeaveProcessImplementation leaveProcessService,
            final LeaveTypeImplementation leaveTypeService
    ) {
        this.leaveRecordsService = leaveRecordsService;
        this.userService = userService;
        this.leaveProcessService = leaveProcessService;
        this.leaveTypeService = leaveTypeService;
    }

    @InitBinder
    private void initLeaveRecordsBinder(WebDataBinder binder) {
        binder.setValidator(leaveRecordsValidator);
    }

    @GetMapping("/process")
    public String viewAllAppliedLeaves(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (!userService.isManager(user.getId())) {
            model.addAttribute("error_msg", "Invalid Access. This page is only for manager.");
            return "error-msg";
        }

        final List<LeaveRecords> appliedLeaveRecords = leaveRecordsService.getAppliedLeaveRecordsByManagerId(user.getId());
        model.addAttribute("appliedLeaveRecords", appliedLeaveRecords);

        return "all-applied-leaves";
    }

    @GetMapping("/process/{id}")
    public String viewAppliedLeaveDetails(Model model, HttpSession session, @PathVariable("id") int id) {
        User user = (User) session.getAttribute("user");
        if (!userService.isManager(user.getId())) {
            model.addAttribute("error-msg", "Invalid Access. This page is only for manager.");
            return "error-msg";
        }

        Optional<LeaveRecords> leaveOptional = leaveRecordsService.getLeaveRecordById(id);
        if (leaveOptional.isEmpty()) {
            model.addAttribute("error-msg", "Leave record not found");
            return "error-msg";
        }

        final LeaveRecords leave = leaveOptional.get();
        model.addAttribute("leave", leave);
        long duration = ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
        model.addAttribute("duration", duration);
        List<LeaveRecords> overlappedLeaveRecords = leaveRecordsService.getLeaveHistoryByDatesByManagerId(leave.getStartDate(), leave.getEndDate(), user.getId());
        model.addAttribute("overlappedLeaveRecords", overlappedLeaveRecords);

        return "applied-leave";
    }

    @PostMapping("/approve")
    public String approveAppliedLeave(@RequestParam("id") Integer leaveId, @RequestParam("comment") String comment, Model model) {
        try {
            final boolean approvalResult = leaveProcessService.approveAppliedLeave(leaveId, comment);
            LeaveRecords leaveRecord = leaveRecordsService.searchLeaveRecordById(leaveId);
            String employeeEmail = leaveRecord.getStaff().getEmail();

            if (approvalResult) {
                String subject = "Leave Application Approved";
                String text = "Your leave application has been approved.<br>"
                        + "Comment: " + comment+"<br><br>"
                        + "<a href='http://localhost:8080/login'>Login to view details</a>";
                emailService.sendEmail(employeeEmail,subject,text);
                return "redirect:/leave/process";
            }
            model.addAttribute("error_msg", "Leave Application is Rejected. No Enough Leave Balance.");
            return "error-msg";
        } catch (Exception e) {
            model.addAttribute("error_msg", e.getMessage());
            return "error-msg";
        }
    }

    @PostMapping("/reject")
    public String rejectAppliedLeave(@RequestParam("id") Integer leaveId, @RequestParam("comment") String comment, Model model) {
        leaveProcessService.rejectAppliedLeave(leaveId, comment);
        LeaveRecords leaveRecord = leaveRecordsService.searchLeaveRecordById(leaveId);
        String employeeEmail = leaveRecord.getStaff().getEmail();
        String subject = "Leave Application Rejected";
        String text = "Your leave application has been rejected.<br>"
                + "Comment: " + comment+"<br><br>"
                + "<a href='http://localhost:8080/login'>Login to view details</a>";
        try {
            emailService.sendEmail(employeeEmail,subject,text);
        }catch (Exception e){
            model.addAttribute("error_msg", e.getMessage());
            return "error-msg";
        }
        return "redirect:/leave/process";
    }

    @GetMapping("/apply")
    public String ApplyLeave(Model model,HttpSession session) {
        List<LeaveType> categories = leaveTypeService.SearchAllLeaveType();

        Staff mystaff = (Staff) session.getAttribute("user");
        LeaveRecords leaveRecord =  new LeaveRecords();
        leaveRecord.setStaff(mystaff);
        model.addAttribute("leaveRecord", leaveRecord);
        model.addAttribute("categories", categories);

        return "ApplyLeaveRecord";
    }

    @PostMapping("/apply")
    public String SaveLeaveForm(@Valid @ModelAttribute("leaveRecord") LeaveRecords leaveRecord , BindingResult bindingResult, HttpSession session, Model model) {

        if(bindingResult.hasErrors()){
            List<LeaveType> categories = leaveTypeService.SearchAllLeaveType();
            model.addAttribute("categories", categories);
            return "ApplyLeaveRecord";
        }

        leaveRecord.setStatus(ApplicationStatus.applied);
        if(leaveRecordsService.saveLeaveRecord(leaveRecord)){
            Staff staff = leaveRecord.getStaff();
            String managerEmail =staff.getManagedBy().getEmail();
            if(managerEmail!=null){
                String subject = "Leave Application Notification";
                String text = "Dear Manager,<br><br>"
                        + "The employee "+staff.getFirstName()+" "+staff.getLastName()+"has applied for leave.<br>"
                        + "Please review the application.<br><br>"
                        + "<a href='http://localhost:8080/login'>Login to view details</a>";
                try {
                    emailService.sendEmail(managerEmail, subject, text);
                }catch (Exception e){
                    model.addAttribute("error_msg", e.getMessage());
                    return "error-msg";
                }
            }
            return "ApplySuccessful";
        }
        else
            return "ApplyLeaveRecord";
    }
    @GetMapping("/update")
    public String UpdateLeave(@RequestParam("id") int leaveRecordId, Model model,HttpSession session) {
        List<LeaveType> categories = leaveTypeService.SearchAllLeaveType();
        LeaveRecords leaveRecord = leaveRecordsService.searchLeaveRecordById(leaveRecordId);
        leaveRecordsService.deleteLeaveRecordById(leaveRecordId);
        model.addAttribute("leaveRecord_willUpdate", leaveRecord);
        model.addAttribute("categories", categories);

        return "updateLeave";
    }
    @PostMapping("/update")
    public String UpdateLeaveForm(@Valid @ModelAttribute("leaveRecord") LeaveRecords leaveRecord , BindingResult bindingResult, HttpSession session, Model model) {

        if(bindingResult.hasErrors()){
            List<LeaveType> categories = leaveTypeService.SearchAllLeaveType();
            model.addAttribute("categories", categories);
            return "updateLeave";
        }

        leaveRecord.setStatus(ApplicationStatus.updated);
        if(leaveRecordsService.saveLeaveRecord(leaveRecord))
            return "ApplySuccessful";
        else
            return "updateLeave";
    }
}
