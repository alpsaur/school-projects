package sg.nus.iss.adproj.funsg.interfacemethods;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserInterface {

    User saveUser(User currentUser);

    List<Group> getUserJoinedGroups(User currentUser);

    List<Event> getUserPastEvents(User currentUser);

    Optional<User> findUserByEmail(String email);

    User setUserMBTITendencies(User user, String mbtiPrediction);

    List<User> getAllUsers();

    User updateUserStatus(Long userId, String status);

    Page<User> getAll(Pageable pageable);
}
