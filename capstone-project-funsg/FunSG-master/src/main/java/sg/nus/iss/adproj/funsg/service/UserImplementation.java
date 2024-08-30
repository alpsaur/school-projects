package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.nus.iss.adproj.funsg.interfacemethods.UserInterface;
import sg.nus.iss.adproj.funsg.model.entity.*;
import sg.nus.iss.adproj.funsg.repository.EventParticipantRepository;
import sg.nus.iss.adproj.funsg.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserImplementation implements UserInterface {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final EventParticipantRepository eventParticipantRepository;

    public UserImplementation(UserRepository userRepository, EventParticipantRepository eventParticipantRepository) {
        this.userRepository = userRepository;
        this.eventParticipantRepository = eventParticipantRepository;
    }

    @Override
    public User saveUser(User currentUser) {
        return userRepository.save(currentUser);
    }

    @Override
    public List<Group> getUserJoinedGroups(User currentUser) {
        List<Member> members = currentUser.getMembers();
        List<Group> groups = members
                .stream()
                .map(Member::getGroup)
                .filter(group -> group.getStatus().equals("active")).toList();
        return groups;
    }

    @Override
    public List<Event> getUserPastEvents(User currentUser) {
        List<EventParticipant> participants = eventParticipantRepository.findByUser(currentUser);
        List<Event> events = participants.stream().map(EventParticipant::getEvent).toList();
        return events;
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User setUserMBTITendencies(User user, String mbtiPrediction) {
        if (mbtiPrediction.length() != 4) {
            return null;
        }
        mbtiPrediction = mbtiPrediction.toUpperCase();
        if (mbtiPrediction.charAt(0) == 'I') {
            user.setIE_Tendancy(user.getIE_Tendancy() + 1);
        } else if (mbtiPrediction.charAt(0) == 'E') {
            user.setIE_Tendancy(user.getIE_Tendancy() - 1);
        }
        if (mbtiPrediction.charAt(1) == 'N') {
            user.setNS_Tendancy(user.getNS_Tendancy() + 1);
        } else if (mbtiPrediction.charAt(1) == 'S') {
            user.setNS_Tendancy(user.getNS_Tendancy() - 1);
        }
        if (mbtiPrediction.charAt(2) == 'T') {
            user.setTF_Tendancy(user.getTF_Tendancy() + 1);
        } else if (mbtiPrediction.charAt(2) == 'F') {
            user.setTF_Tendancy(user.getTF_Tendancy() - 1);
        }
        if (mbtiPrediction.charAt(3) == 'J') {
            user.setJP_Tendancy(user.getJP_Tendancy() + 1);
        } else if (mbtiPrediction.charAt(3) == 'P') {
            user.setJP_Tendancy(user.getJP_Tendancy() - 1);
        }

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        user.setStatus(status);
        return userRepository.save(user);
    }

    @Override
    public Page<User> getAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

}
