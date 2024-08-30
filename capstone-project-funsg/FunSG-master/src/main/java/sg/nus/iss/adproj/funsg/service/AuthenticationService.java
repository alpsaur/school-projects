package sg.nus.iss.adproj.funsg.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sg.nus.iss.adproj.funsg.interfacemethods.UserInterface;
import sg.nus.iss.adproj.funsg.model.dto.LoginUserRequest;
import sg.nus.iss.adproj.funsg.model.dto.RegisterUserRequest;
import sg.nus.iss.adproj.funsg.model.entity.User;

@Service
public class AuthenticationService {

    private final UserInterface userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserInterface userService,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public User signUp(RegisterUserRequest input) {
        User user = new User();
        try {
            user.setEmail(input.getEmail());
            user.setPassword(passwordEncoder.encode(input.getPassword()));
            user.setName(input.getUsername());
            user.setStatus("active");
        } catch (NullPointerException e) {
            return null;
        }

        return userService.saveUser(user);
    }


    public User authenticate(LoginUserRequest input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userService.findUserByEmail(input.getEmail())
                .orElse(null);
    }
}
