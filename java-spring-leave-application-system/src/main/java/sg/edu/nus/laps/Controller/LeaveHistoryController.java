package sg.edu.nus.laps.Controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import sg.edu.nus.laps.interfacemethods.LeaveRecordsInterface;
import sg.edu.nus.laps.interfacemethods.UserInterface;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Leave.LeaveRecords;
import sg.edu.nus.laps.service.LeaveRecordsImplementation;
import sg.edu.nus.laps.service.UserImplementation;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RequestMapping("leave")
@Controller
public class LeaveHistoryController {


    private final LeaveRecordsInterface leaveRecordsService;
    private final UserInterface userService;

    @Autowired
    public LeaveHistoryController(
            final UserImplementation userService,
            final LeaveRecordsImplementation leaveRecordsService
    ) {
        this.userService = userService;
        this.leaveRecordsService = leaveRecordsService;
    }

    @RequestMapping("/history/subordinates")
    public String subordinatesLeaveHistory(Model model, HttpSession session,@RequestParam(value = "page",defaultValue = "0") int page,
                                           @RequestParam(value = "size", defaultValue = "10") int size) {
        User user = (User) session.getAttribute("user");
        if (!userService.isManager(user.getId())) {
            model.addAttribute("error-msg", "Invalid Access. This page is only for manager.");
            return "error-msg";
        }
        Pageable pageable = PageRequest.of(page,size);
        Page<LeaveRecords> leaveHistory = leaveRecordsService.getLeaveHistoryByManagerId(user.getId(),pageable);
        model.addAttribute("leaveHistory", leaveHistory);
        model.addAttribute("currentPage", page);
        model.addAttribute("size", size);
        model.addAttribute("totalPages", leaveHistory.getTotalPages());

        //gain all pages
        int totalPages = leaveHistory.getTotalPages();
        //create pages list
        if(totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1,totalPages).boxed().toList();
            model.addAttribute("pageNumbers", pageNumbers);
        }

        List<Long> leaveHistoryDurations = leaveHistory.getContent().stream()//这个我加了个getContent()
                .map(leaveRecords -> ChronoUnit.DAYS.between(leaveRecords.getStartDate(), leaveRecords.getEndDate()))
                .collect(Collectors.toList());
        model.addAttribute("leaveHistoryDurations", leaveHistoryDurations);
        return "subordinates-leaveHistory";
    }

    @GetMapping("/history/personal")
    public String personalLeaveHistory(Model model, HttpSession session,@RequestParam(value = "page",defaultValue = "0") int page,
                                       @RequestParam(value = "size", defaultValue = "10") int size) {
        User user = (User) session.getAttribute("user");
        Pageable pageable = PageRequest.of(page,size);
        Page<LeaveRecords> leaveHistory=leaveRecordsService.getLeaveHistoryByStaffId(user.getId(),pageable);
        model.addAttribute("leaveHistory", leaveHistory);
        model.addAttribute("currentPage", page);
        model.addAttribute("size", size);
        model.addAttribute("totalPages", leaveHistory.getTotalPages());

        int totalPages = leaveHistory.getTotalPages();
        if(totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1,totalPages).boxed().toList();
            model.addAttribute("pageNumbers", pageNumbers);
        }
        return "personal-leave-history";
    }
    /*
    @GetMapping("/update")
    public String showUpdateForm(@RequestParam("id") int id, Model model) {
        Optional<LeaveRecords> leaveRecordOptional=leaveRecordsService.getLeaveRecordById(id);
        leaveRecordOptional.ifPresent(leaveRecords -> model.addAttribute("leaveRecord", leaveRecords));

        return "updateLeave";
    }
    */


    @PostMapping("/delete")
    public String deleteAppliedLeave(@RequestParam("leaveId") int leaveRecordId, @RequestParam("staffId") int staffId) {
        leaveRecordsService.updateLeaveRecordStatus(leaveRecordId, ApplicationStatus.deleted);
        return "redirect:/leave/history/personal?staffId=" + staffId;
    }

    @PostMapping("/cancel")
    public String cancelApprovedLeave(@RequestParam("leaveId") int leaveRecordId, @RequestParam("staffId") int staffId) {
        leaveRecordsService.updateLeaveRecordStatus(leaveRecordId, ApplicationStatus.cancel);
        return "redirect:/leave/history/personal?staffId=" + staffId;
    }



    @RequestMapping("/movementRegister")
    public String viewMovement(@RequestParam(value = "monthSelection",required = false) String monthSelection, Model model){
        if (monthSelection == null) {
            monthSelection = "thisMonth";
        }
        List<LeaveRecords> leaveRecords = leaveRecordsService.getLeaveRecordsByMonth(monthSelection);
        model.addAttribute("leaveRecords", leaveRecords);
        model.addAttribute("monthSelection", monthSelection);
        return "movementRegister";
    }
    @GetMapping("/report")
    public String generateReports(Model model,HttpSession session){
        User user = (User) session.getAttribute("user");
        if (!userService.isManager(user.getId())) {
            model.addAttribute("error-msg", "Invalid Access. This page is only for manager.");
            return "error-msg";
        }
        model.addAttribute("staffs",userService.findSubodinatesByManagerId(user.getId()));
        return "reports";
    }
}
