package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User authenticate(String username, String password) {
        System.out.println("########## Authenticating user: " + username);

        User user = userRepository.findByUsername(username);

        if (user != null) {
            System.out.println("########## User found in database. User type: " + user.getClass().getSimpleName());
            if (user.getPassword().equals(password)) {
                System.out.println("########## Password matched. Authentication successful.");
                return user;
            } else {
                System.out.println("########## Password did not match.");
            }
        } else {
            System.out.println("########## User not found in database.");
        }

        return null;
    }
}