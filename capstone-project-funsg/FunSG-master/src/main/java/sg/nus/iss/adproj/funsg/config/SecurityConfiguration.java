package sg.nus.iss.adproj.funsg.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration // tells Spring that this class contains configuration settings.
@EnableWebSecurity //enables Spring Security’s web security support,allowing customization of web-based security.
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthenticationFilter, AuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disables CSRF protection. This is often done in stateless applications using JWTs.
                .authorizeHttpRequests(authorize -> authorize
                        // Allows all requests to URLs matching /auth/** to be accessed without authentication.
                        .requestMatchers("/auth/**").permitAll()
                        // Allows all search requests without authentication
                        .requestMatchers("/search/**").permitAll()
                        // Allows viewing events without authentication
                        .requestMatchers(HttpMethod.GET, "/events").permitAll()
                        .requestMatchers(HttpMethod.GET, "/events/{eventId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/events/{groupId}/events").permitAll()
                        // Requires authentication for Recommendations, registering for events, creating event for particular group,view participants,post eventArtifacts
                        .requestMatchers(HttpMethod.GET, "/events/recommendations").authenticated()
                        .requestMatchers(HttpMethod.POST, "/events/{eventId}/register").authenticated()
                        .requestMatchers(HttpMethod.POST, "events/{groupId}/events").authenticated()
                        .requestMatchers(HttpMethod.GET, "/events/{eventId}/participants").authenticated()
                        .requestMatchers(HttpMethod.POST, "/events/{eventId}/media").authenticated()
                        // Allows viewing groups without authentication
                        .requestMatchers(HttpMethod.GET, "/groups").permitAll()
                        .requestMatchers(HttpMethod.GET, "/groups/{groupId}").permitAll()
                        // Requires authentication for Recommendations, Join Group, Exit Group and Create Group, Edit Group Info
                        .requestMatchers(HttpMethod.GET, "/groups/recommendations").authenticated()
                        .requestMatchers(HttpMethod.POST, "/groups/{groupId}/join").authenticated()
                        .requestMatchers(HttpMethod.POST, "/groups/{groupId}/exit").authenticated()
                        .requestMatchers(HttpMethod.POST, "/groups").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/groups/{groupId}").authenticated()
                        // Allows viewing categories without authentication
                        .requestMatchers(HttpMethod.GET, "/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/{categoryId}/events").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/{categoryId}/groups").permitAll()
                        // Requires authentication for all user endpoints
                        .requestMatchers("/users/**").authenticated()
                        // Allows viewing comments for a group without authentication
                        .requestMatchers(HttpMethod.GET, "/comments/group/{groupId}").permitAll()
                        // Requires authentication for posting comments
                        .requestMatchers(HttpMethod.POST, "/comments/group/{groupId}").authenticated()
                        // Requires authentication for all other requests
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //Configures the session management to be stateless, meaning the server will not store any session information.
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(withDefaults());  // tell Spring Security to enable CORS support for application, using the global CORS configuration in CorsConfigurationSource bean.


        return http.build();
    }

    //Configures Cross-Origin Resource Sharing (CORS) settings.
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allows requests from the specified origins
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Specifies the HTTP methods allowed when accessing the resources
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Specifies the headers that can be used in the request
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Allows the client (e.g., a browser) to send credentials like cookies with cross-origin requests.
        // Configures the server to accept requests that include credentials from specified origins.
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Registers the configuration for all endpoints (/**)
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
