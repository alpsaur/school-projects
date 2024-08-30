package sg.edu.nus.laps.Controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import sg.edu.nus.laps.model.Employee.Admin;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.service.StaffEditImplementation;

@Controller
public class HomeController {

    @Autowired
    StaffEditImplementation staffEditService;

    @GetMapping("/changePassword")
    public String changePassword(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        model.addAttribute("user",user);
        return "changePassword";
    }

    //change password for staff/manager
    @PostMapping("/changeStaffPassword")
    public String changePassword(@Valid @ModelAttribute("user") Staff user, BindingResult bindingResult, Model model) {
        if (bindingResult.hasFieldErrors("password")) {
            // If there are validation errors, return to the form page and display error info
            model.addAttribute("user", user);
            return "changePassword";
        } else {
            //no validation errors, save staff info
            model.addAttribute("user", staffEditService.savePassword(user));
        }
        return "redirect:/leave/balance";
    }

    //changePassword for admin
    @PostMapping("/changeAdminPassword")
    public String changePassword(@Valid @ModelAttribute("user") Admin user, BindingResult bindingResult, Model model) {
        if (bindingResult.hasFieldErrors("password")) {
            // If there are validation errors, return to the form page and display error info
            model.addAttribute("user", user);
            return "changePassword";
        } else {
            //no validation errors, save staff info
            model.addAttribute("user", staffEditService.savePassword(user));
        }
        return "redirect:/admin/displayStaff";
    }
}
