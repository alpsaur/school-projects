package sg.edu.nus.laps.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import sg.edu.nus.laps.model.Employee.User;

@Component
public class AuthorizationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        if (session != null) {
            User user = (User) session.getAttribute("user");
            if (user != null) {
                // Example rule: Block staff and managers from accessing any /admin/* pages
                String requestURI = request.getRequestURI();
                if (requestURI.matches("^/admin/.*")) {
                    String userType = user.getUserType();
                    if ("staff".equals(userType) || "manager".equals(userType)) {
                        // User does not have permission, redirect to access denied page or some other page
                        response.sendRedirect("/leave/balance");
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
