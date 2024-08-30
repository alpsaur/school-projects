package sg.nus.iss.adproj.funsg.interfacemethods;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sg.nus.iss.adproj.funsg.model.dto.AdminStatusUpdateRequest;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;

import java.util.List;

public interface GroupInterface {

    List<Group> getGroupsByMBTI(User currentUser);

    List<Group> getAllGroupsSortedByPopularity();

    Group getGroupById(Long groupId);

    boolean joinGroup(Long groupId, User currentUser);

    List<Group> getGroupsByCategoryId(Long categoryId);

    List<Group> searchGroups(String query);

    Group saveGroup(Group group);

    boolean exitGroup(Long groupId, User currentUser);

    List<Group> getJoinedGroupsByUserId(Long id);

    List<Group> getGroupsWithPending();

    Group updateGroupStatus(Long groupId, AdminStatusUpdateRequest request);

    Page<Group> getAllNonPendingGroups(Pageable pageable);

    Group createGroup(Group group, User currentUser);

    Page<Group> getAllNonPendingGroupsByCategoryId(Long categoryId, Pageable pageable);

    List<Group> getAllActiveGroups();
}
