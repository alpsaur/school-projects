package sg.nus.iss.adproj.funsg.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import sg.nus.iss.adproj.funsg.repository.UserRepository;

//A configuration class in a Spring Boot application that
// sets up several Spring Security-related beans.
// This configuration is crucial for handling user authentication, password encoding, and managing authentication providers

@Configuration
public class ApplicationConfiguration {
    private final UserRepository userRepository;

    public ApplicationConfiguration(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //The UserDetailsService is a core interface in Spring Security used to retrieve user-related data.
    // loadUserByUsername loads the user details by username (in this case, by email).
    // This implementation fetches a user from the UserRepository using the email as the username.
    // If the user is not found, it throws a UsernameNotFoundException.
    @Bean
    UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // The BCryptPasswordEncoder is used to encode passwords securely.
    //This encoder will be used to encode user passwords and
    // to compare raw passwords with encoded passwords during authentication.
    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // The AuthenticationManager is responsible for processing authentication requests.
    // It delegates the authentication process to a chain of AuthenticationProviders.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    //The DaoAuthenticationProvider is an implementation of AuthenticationProvider that
    // retrieves user details from a UserDetailsService and
    // uses a PasswordEncoder to validate passwords.

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        //Configures authProvider to use the UserDetailsService and PasswordEncoder to authenticate users.
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }
}
