package sg.edu.nus.laps.Controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import sg.edu.nus.laps.interfacemethods.CompensationRecordInterface;
import sg.edu.nus.laps.interfacemethods.UserInterface;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.CompensationRecord;
import sg.edu.nus.laps.model.Leave.LeaveRecords;
import sg.edu.nus.laps.model.Leave.LeaveType;
import sg.edu.nus.laps.service.CompensationRecordImplementation;
import sg.edu.nus.laps.service.UserImplementation;
import sg.edu.nus.laps.validator.CompensationRecordValidator;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("compensation")
@Controller
public class CompensationRecordController {

    private final UserInterface userService;
    private final CompensationRecordInterface compensationRecordService;

    @Autowired
    public CompensationRecordController(
            final UserImplementation userService,
            final CompensationRecordImplementation compensationRecordService
    ) {
        this.userService = userService;
        this.compensationRecordService = compensationRecordService;
    }

    @Autowired
    private CompensationRecordValidator compensationRecordValidator;

    @InitBinder
    private void initCompensationRecordBinder(final WebDataBinder binder) {
        binder.setValidator(compensationRecordValidator);
    }

    @GetMapping("/personal")
    public String personal(Model model, HttpSession session) {
      // implement the methods
        User user = (User) session.getAttribute("user");
        List<CompensationRecord> compensationHistory = compensationRecordService.GetCompensationRecordsByStaffId(user.getId());
        List<Double> numberOfGrantedLeaves = compensationHistory.stream()
                .map(compensationRecord -> compensationRecord.getOvertimeHours() / 4)
                .map(x -> x * 0.5).toList();
        model.addAttribute("compensationHistory",compensationHistory);
        model.addAttribute("numberOfGrantedLeaves", numberOfGrantedLeaves);
        return "personal-compensation-records";
    }

    @GetMapping("/subordinates")
    public String subordinates(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (!userService.isManager(user.getId())) {
            model.addAttribute("error-msg", "Invalid Access. This page is only for manager.");
            return "error-msg";
        }
        List<CompensationRecord> compensationRecords = compensationRecordService.getProcessedCompensationRecordsByManagerId(user.getId());
        List<Double> numberOfGrantedLeaves = compensationRecords.stream()
                .map(compensationRecord -> compensationRecord.getOvertimeHours() / 4)
                .map(x -> x * 0.5).toList();

        model.addAttribute("compensationRecords", compensationRecords);
        model.addAttribute("numberOfGrantedLeaves", numberOfGrantedLeaves);

        return "subordinates-compensation-records";
    }

    @GetMapping("/process")
    public String viewAllCompensationRequests(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (!userService.isManager(user.getId())) {
            model.addAttribute("error-msg", "Invalid Access. This page is only for manager.");
            return "error-msg";
        }

        List<CompensationRecord> appliedCompensationRecords = compensationRecordService.getAppliedCompensationRecordsByManagerId(user.getId());
        List<Double> numberOfGrantedLeaves = appliedCompensationRecords.stream()
                .map(compensationRecord -> compensationRecord.getOvertimeHours() / 4)
                .map(x -> x * 0.5).toList();

        model.addAttribute("compensationRecords", appliedCompensationRecords);
        model.addAttribute("numberOfGrantedLeaves", numberOfGrantedLeaves);
        return "all-compensation-requests";
    }

    @PostMapping("/approve")
    public String approveCompensationRequest(@RequestParam("compensationId") int compensationId, @RequestParam("staffId") int staffId, @RequestParam("numOfGrantedLeave") Double numOfLeave, Model model) {
        try {
            final boolean approvalResult = compensationRecordService.approveCompensationRequest(compensationId, staffId, numOfLeave);
            if (approvalResult) {
                return "redirect:/compensation/process";
            }
            model.addAttribute("error_msg", "Compensation Claim Application is Rejected. Overtime Hour is less than 4 hours.");
            return "error-msg";
        } catch (Exception e) {
            model.addAttribute("error_msg", e.getMessage());
            return "error-msg";
        }
    }

    @PostMapping("/reject")
    public String rejectCompensationRequest(@RequestParam("compensationId") int compensationId, @RequestParam("comment") String comment) {
        compensationRecordService.updateCompensationRecordStatus(compensationId, ApplicationStatus.rejected, comment);
        return "redirect:/compensation/process";
    }

    @GetMapping("/apply")
    public String ApplyCompensation(Model model, HttpSession session) {
        Staff mystaff = (Staff) session.getAttribute("user");
        CompensationRecord compensationRecord = new CompensationRecord();
        compensationRecord.setStaff(mystaff);
        model.addAttribute("compensationRecord", compensationRecord);
        return "ApplyCompensation";
    }
    @PostMapping("apply")
    public String SaveCompensation(@Valid @ModelAttribute("compensationRecord") CompensationRecord compensationRecord , BindingResult bindingResult, HttpSession session, Model model) {
        if(bindingResult.hasErrors()){
            return "ApplyCompensation";
        }
        compensationRecord.setStatus(ApplicationStatus.applied);
        if(compensationRecordService.saveCompensationRecord(compensationRecord))
            return "ApplyCompensationSuccessful";
        else
            return "ApplyCompensation";
    }

    @GetMapping("/update")
    public String UpdateCompensation(@RequestParam("id") int compensationId, Model model,HttpSession session) {
        CompensationRecord compensationRecord = compensationRecordService.searchCompensationRecordById(compensationId);
        compensationRecordService.deleteCompensationRecordById(compensationId);
        model.addAttribute("compensationRecord_willUpdate", compensationRecord);


        return "updateCompensation";
    }

    @PostMapping("update")
    public String UpdateLeaveForm(@Valid @ModelAttribute("compensationRecord_willUpdate") CompensationRecord compensationRecord_willUpdate , BindingResult bindingResult, HttpSession session, Model model) {

        if(bindingResult.hasErrors()){
            return "updateCompensation";
        }

        compensationRecord_willUpdate.setStatus(ApplicationStatus.updated);
        if(compensationRecordService.saveCompensationRecord(compensationRecord_willUpdate))
            return "ApplyCompensationSuccessful";
        else
            return "updateCompensation";
    }

    @PostMapping("/cancel")
    public String cancelApprovedLeave(@RequestParam("compensationId") int compensationId, @RequestParam("staffId") int staffId) {
        compensationRecordService.updateCompensationRecordStatus(compensationId, ApplicationStatus.cancel,"");
        return "redirect:/compensation/personal";
    }

    @PostMapping("/delete")
    public String deleteAppliedLeave(@RequestParam("compensationId") int compensationId, @RequestParam("staffId") int staffId) {
        compensationRecordService.updateCompensationRecordStatus(compensationId, ApplicationStatus.deleted,"");
        return "redirect:/compensation/personal";
    }




}
