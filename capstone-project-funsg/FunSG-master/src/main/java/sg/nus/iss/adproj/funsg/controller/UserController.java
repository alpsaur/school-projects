package sg.nus.iss.adproj.funsg.controller;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.multipart.MultipartFile;
import sg.nus.iss.adproj.funsg.interfacemethods.UserInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.UserMbtiInterface;
import sg.nus.iss.adproj.funsg.model.dto.AdminUserResponse;
import sg.nus.iss.adproj.funsg.model.dto.EventInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.GroupInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.MbtiPredictionRequest;
import sg.nus.iss.adproj.funsg.model.dto.UserProfileResponse;
import sg.nus.iss.adproj.funsg.model.utils.DtoConverter;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.model.utils.MBTIWordList;
import sg.nus.iss.adproj.funsg.service.MbtiPredictionService;
import sg.nus.iss.adproj.funsg.service.S3UploadService;
import sg.nus.iss.adproj.funsg.service.UserImplementation;
import sg.nus.iss.adproj.funsg.service.UserMbtiImplementation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RequestMapping("/users")
@RestController
public class UserController {

    private final UserInterface userService;
    private final S3UploadService s3UploadService;
    private final MbtiPredictionService mbtiPredictionService;
    private final UserMbtiInterface userMbtiService;


    public UserController(UserImplementation userService, S3UploadService s3UploadService, MbtiPredictionService mbtiPredictionService, UserMbtiImplementation userMbtiservice) {
        this.userService = userService;
        this.s3UploadService = s3UploadService;
        this.mbtiPredictionService = mbtiPredictionService;
        this.userMbtiService = userMbtiservice;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AdminUserResponse>> getUsers() {

        List<User> users = userService.getAllUsers();
        if (users== null || users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<AdminUserResponse> adminUserResponses = users.stream()
                .map(DtoConverter::convertToAdminUserResponse)
                .toList();

        return ResponseEntity.ok(adminUserResponses) ;
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> viewProfile() {
        //SecurityContextHolder is a utility class that holds the security context, which includes details about the current user and their authentication status.
        //getContext().getAuthentication() retrieves the Authentication object for the current user.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //getPrincipal() return the User object
        User currentUser = (User) authentication.getPrincipal();
        UserProfileResponse userProfileResponse = DtoConverter.convertToUserProfileResponse(currentUser);

        return ResponseEntity.ok(userProfileResponse);
    }

    @PostMapping("/prediction")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> predictMBTI(@RequestBody MbtiPredictionRequest mbtiPredDto) {
        if (mbtiPredDto.getUserInputs().isEmpty()) {
            return ResponseEntity.ok().body("No inputs this time");
        }

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();

//            List<String> curMBTIWords = UtilMethods.convertSentencesToWords(mbtiPredDto.getUserInputs());
            List<String> curMBTIWords = mbtiPredDto.getUserInputs();
            List<String> allMBTIWords = userMbtiService.getMBTIWordsRecord(currentUser);
            if (allMBTIWords == null) {
                allMBTIWords = new ArrayList<>();
            }
            allMBTIWords.addAll(curMBTIWords);

            String mbtiPrediction = mbtiPredictionService.callMLApi(allMBTIWords);
            if (mbtiPrediction.length() !=4) {
                mbtiPrediction = mbtiPrediction.substring(1, 5);
            }

            // Update User MBTI tendencies
            userService.setUserMBTITendencies(currentUser, mbtiPrediction);

            // SAVE MBTI into user_mbti table
            String mbtiUserInputs = String.join(",", curMBTIWords);
            userMbtiService.savePrediction(currentUser, mbtiPrediction, mbtiUserInputs);

            return ResponseEntity.ok().body("The prediction this time is "+ mbtiPrediction);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body("Failed to call ML API: " + e.getMessage());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found: " + e.getMessage());
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/profileImage")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = s3UploadService.uploadFile(file, "UserProfileImage");

            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            currentUser.setProfileImagePath(fileUrl);
            User updatedUser = userService.saveUser(currentUser);
            UserProfileResponse userProfileResponse = DtoConverter.convertToUserProfileResponse(updatedUser);

            return ResponseEntity.ok(userProfileResponse);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/groups")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<GroupInfoResponse>> viewJoinedGroups() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        List<Group> groupList = userService.getUserJoinedGroups(currentUser);

        if (groupList == null || groupList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        List<GroupInfoResponse> groups = groupList.stream()
                .map(DtoConverter::convertToGroupInfoResponse)
                .toList();

        return ResponseEntity.ok(groups);
    }

    @GetMapping("/events")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EventInfoResponse>> viewPastEvent() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        List<Event> eventList = userService.getUserPastEvents(currentUser);

        if (eventList == null || eventList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        List<EventInfoResponse> events = eventList.stream()
                .map(DtoConverter::convertToEventInfoResponse).toList();

        return ResponseEntity.ok(events);
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkLoginStatus() {
        return ResponseEntity.status(HttpStatus.OK).body("User has logged in");
    }

    @GetMapping("/MBTITest")
    public ResponseEntity<Map<String,String>> getMBTIWords() {
        Map<String,String> MBTITestWords = MBTIWordList.getMBTIWords();
        return ResponseEntity.status(HttpStatus.OK).body(MBTITestWords);
    }
}
