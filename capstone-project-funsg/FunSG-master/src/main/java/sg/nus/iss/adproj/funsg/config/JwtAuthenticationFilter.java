package sg.nus.iss.adproj.funsg.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import sg.nus.iss.adproj.funsg.exception.JwtException;
import sg.nus.iss.adproj.funsg.exception.JwtExpiredException;
import sg.nus.iss.adproj.funsg.exception.JwtInvalidSignatureException;
import sg.nus.iss.adproj.funsg.exception.JwtMalformedException;
import sg.nus.iss.adproj.funsg.exception.JwtMissingException;
import sg.nus.iss.adproj.funsg.service.JwtService;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

// JwtAuthenticationFilter is a middleware (or interceptor) that:
// 1. Intercepts every incoming HTTP request.
// 2. Checks for a JWT token in the cookies. If a token is found and no authentication is set in the SecurityContextHolder, it validates the token and sets the authentication.
// 3. Checks for a JWT token in the Authorization header if no token is found in the cookies. If a token is found and no authentication is set in the SecurityContextHolder, it validates the token and sets the authentication.
// 4. Sets the authentication in the Spring Security context if the token is valid.
// 5. Passes the request to the next filter in the chain, regardless of whether a token is present or valid. If no token is found or the token is invalid, it continues without setting authentication.
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService,
            HandlerExceptionResolver handlerExceptionResolver
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final List<String> PERMIT_ALL_PATHS = Arrays.asList(
            "/auth/", "/search/", "/events", "/groups", "/categories", "/comments/group/"
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String path = request.getServletPath();
        String method = request.getMethod();

        // Skip filter for preFlight requests that don't require authentication
        if (method.equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Skip filter for paths that don't require authentication
        if (shouldSkipFilter(path, method)) {
            filterChain.doFilter(request, response);
            return;
        }


       try{
           String jwt = extractJwtFromRequest(request);
           if (jwt != null) {
               processJwt(jwt,request);
           }else{
               logger.debug("No JWT found in request");
           }
       }catch (JwtException e) {
           logger.error("JWT processing error", e);
           handlerExceptionResolver.resolveException(request, response, null, e);
       } catch (Exception e) {
           logger.error("Unexpected error during request processing", e);
           handlerExceptionResolver.resolveException(request, response, null, e);
       } finally {
           filterChain.doFilter(request, response);
       }
    }




    private String extractJwtFromRequest(HttpServletRequest request) {

        // Check cookies first (For request from web)
        Cookie[]  cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) {
                    logger.debug("Found JWT in request cookie");
                    return cookie.getValue();
                }
            }
        }

        // If not in cookie, check Authorization header (For request from mobile)
        String authHeader = request.getHeader("Authorization");
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            logger.debug("Found JWT in request Authorization header");
            return authHeader.substring(7);
        }

        throw new JwtMissingException("JWT token is missing from the request");
    }

    private void processJwt(String jwt, HttpServletRequest request) {
        try{
            String userEmail = jwtService.extractUsername(jwt);
            if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if(jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("User authenticated successfully: {}",userDetails.getUsername());
                }else{
                    logger.warn("Invalid JWT token: {}",userDetails.getUsername());
                    throw new JwtInvalidSignatureException("Invalid JWT signature");
                }
            }
        }catch(ExpiredJwtException e){
            logger.warn("JWT token is expired", e);
            throw new JwtExpiredException("JWT token has expired");
        }catch(MalformedJwtException e){
            logger.warn("Malformed JWT token", e);
            throw new JwtMalformedException("Malformed JWT token");
        }catch (JwtException e) {
            logger.error("JWT processing error", e);
            throw e;
        }
    }

    private boolean shouldSkipFilter(String path, String method) {
        // Additional checks for specific paths (\\d+ means "one or more digits")
        if (path.matches("/events/\\d+") && method.equals("GET")) return true;
        if (path.matches("/groups/\\d+") && method.equals("GET")) return true;
        if (path.matches("/categories/\\d+/events") && method.equals("GET")) return true;
        if (path.matches("/categories/\\d+/groups") && method.equals("GET")) return true;
        // Check if the path starts with any of the permitted paths
        for (String permitPath : PERMIT_ALL_PATHS) {
            if (path.startsWith(permitPath)) {
                // For /events and /groups, only skip for GET requests
                if ((permitPath.equals("/events") || permitPath.equals("/groups"))||permitPath.equals("/comments/group/") && !method.equals("GET")) {
                    return false;
                }
                return true;
            }
        }



        return false;
    }

}
