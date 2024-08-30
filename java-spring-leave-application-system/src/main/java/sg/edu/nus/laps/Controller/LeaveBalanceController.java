package sg.edu.nus.laps.Controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import sg.edu.nus.laps.interfacemethods.LeaveBalanceInterface;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.service.LeaveBalanceImplementation;

import java.time.LocalDate;
import java.util.List;


@Controller
public class LeaveBalanceController {

    @Autowired
    private LeaveBalanceInterface leaveBalanceService;

    @Autowired
    public void setLeaveBalanceService(LeaveBalanceImplementation leaveBalanceService) {
        this.leaveBalanceService = leaveBalanceService;
    }

    @GetMapping("/leave/balance")
    public String showLeaveBalance(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        Integer staffId = user.getId();
        Integer currYear = LocalDate.now().getYear();

        List<LeaveBalance> leaveBalances = leaveBalanceService.getLeaveBalanceByStaffId(staffId, currYear);

        LeaveBalance annualLeave = leaveBalances.stream()
                .filter(leaveBalance -> leaveBalance.getLeaveType().getLeaveCode() == 1)
                .findFirst().get();

        LeaveBalance medicalLeave = leaveBalances.stream()
                .filter(leaveBalance -> leaveBalance.getLeaveType().getLeaveCode()==2)
                .findFirst().get();

        LeaveBalance compensationLeave = leaveBalances.stream()
                . filter(leaveBalance -> leaveBalance.getLeaveType().getLeaveCode()==3)
                .findFirst().get();

        model.addAttribute("annualLeave", annualLeave);
        model.addAttribute("annualLeaveTotal",annualLeave.getCurrentBalance()+annualLeave.getForwardBalance());
        model.addAttribute("medicalLeave", medicalLeave);
        model.addAttribute("compensationLeave", compensationLeave);
        model.addAttribute("pageTitle", "Dashboard");
        return "dashboard";
    }
}
