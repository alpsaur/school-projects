package sg.edu.nus.laps.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.service.UserService;

@Controller
public class LoginController {

    @Autowired
    private UserService userService;


@GetMapping("/login")
public String login(Model model, HttpSession session) {
    User user = (User) session.getAttribute("user");
    if (user != null) {
        String userType = user.getUserType();
        if ("staff".equals(userType)|| "manager".equals(userType)) {
            return "redirect:/leave/balance";
        } else if ("admin".equals(userType)){
            return "redirect:/admin/displayStaff";
        }
    }
    model.addAttribute("username", "");
    model.addAttribute("password", "");
    return "login";
}


    @PostMapping("/login")
    public String loginSubmit(HttpServletRequest request, Model model,
                              @ModelAttribute("username")String username,
                              @ModelAttribute("password")String password) {
        User authenticatedUser = userService.authenticate(username, password);
        if (authenticatedUser != null) {
            HttpSession session = request.getSession();
            session.setAttribute("user", authenticatedUser);

            String userType = authenticatedUser.getUserType();
            session.setAttribute("usertype", userType);
            if ("staff".equals(userType)|| "manager".equals(userType)) {
                return "redirect:/leave/balance";
            } else if ("admin".equals(userType)){
                return "redirect:/admin/displayStaff";
            }
        } else {
            model.addAttribute("loginError", true);
            return "login";
        }
        return "redirect:/login";
    }
    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.invalidate();
        return "redirect:/login";
    }
}