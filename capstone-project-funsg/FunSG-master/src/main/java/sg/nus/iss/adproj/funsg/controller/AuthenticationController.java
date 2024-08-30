package sg.nus.iss.adproj.funsg.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sg.nus.iss.adproj.funsg.model.dto.LoginUserRequest;
import sg.nus.iss.adproj.funsg.model.dto.MobileLoginResponse;
import sg.nus.iss.adproj.funsg.model.dto.RegisterUserRequest;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.service.AuthenticationService;
import sg.nus.iss.adproj.funsg.service.JwtService;


@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(final JwtService jwtService, final AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterUserRequest registerUserDto, HttpServletRequest request, HttpServletResponse response){

        User registerdUser = authenticationService.signUp(registerUserDto);

        // If new user registered successfully, authenticate the user
        if (registerdUser != null) {
            LoginUserRequest loginUserDto = new LoginUserRequest();
            loginUserDto.setEmail(registerdUser.getEmail());
            loginUserDto.setPassword(registerUserDto.getPassword()); // Use the original password from registration DTO
            return authenticate(loginUserDto, request, response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Registration failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserRequest loginUserDto, HttpServletRequest request, HttpServletResponse response) {
       // Authenticate Successfully
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        // Login Fail
        if (authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        if (authenticatedUser.getStatus().equals("banned")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("This user is banned!");
        }

        // Login Successfully, return token to mobile client, set cookies for web client
        String jwtToken = jwtService.generateToken(authenticatedUser);

        // Check if the request is from a mobile client
        boolean isMobileClient = isMobileClient(request);

        if (isMobileClient){
            // For mobile clients, return the token in the response body
            MobileLoginResponse mobileLoginResponse = new MobileLoginResponse();
            mobileLoginResponse.setToken(jwtToken);
            mobileLoginResponse.setExpiresIn(jwtService.getExpirationTime());
            mobileLoginResponse.setUserName(authenticatedUser.getName());

            return ResponseEntity.ok(mobileLoginResponse);
        }else{
            // For web clients, set the token as an HTTP-only cookie
            Cookie cookie = new Cookie("jwt", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // Use only if your site is HTTPS
            cookie.setMaxAge((int) jwtService.getExpirationTime());
            cookie.setPath("/"); // Global cookie accessible everywhere
            response.addCookie(cookie);
            return ResponseEntity.ok("Login successful");
        }

    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear the cookie
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    private boolean isMobileClient(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        return userAgent != null && (userAgent.contains("Android") || userAgent.contains("iOS"));
    }
}
