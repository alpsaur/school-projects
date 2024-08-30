package sg.nus.iss.adproj.funsg;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import sg.nus.iss.adproj.funsg.interfacemethods.CategoryInterface;
import sg.nus.iss.adproj.funsg.interfacemethods.GroupInterface;
import sg.nus.iss.adproj.funsg.model.entity.Category;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.Member;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class GroupServiceTest {

    @Autowired
    UserRepository userRepo;

    @Autowired
    CategoryInterface categoryService;
    @Autowired
    GroupInterface groupService;


    @Test
    public void fetchObjectsTest() {
        User user = userRepo.findById(1L).get();
        List<Member> members = user.getMembers();
        members.forEach(member -> System.out.println(member.getId()));

    }

    @Test
    public void viewGroupsTest() {
        User user = userRepo.findById(1L).get();

        //normally categories don't have groups references (lazyInitializationException)
        List<Category> categories = categoryService.getAllCategories();

        //AllGroups
        List<Group> groups1 = groupService.getAllGroupsSortedByPopularity();
        assertEquals(groups1.size(), 30);

        //getGroupsByMBTI
        List<Group> groups2 = groupService.getGroupsByMBTI(user);
        assertEquals(groups2.size(), 30);

        //getGroupsByCategoryId
        List<Group> groups3 = groupService.getGroupsByCategoryId(1L);
        assertEquals(groups3.size(), 5);

        //searchGroups
        List<Group> groups4 = groupService.searchGroups("tech");
        assertEquals(groups4.size(), 4);
    }

    @Test
    public void joinAndExitGroupTest() {
        User user = userRepo.findById(1L).get();
        List<Group> groups1 = groupService.getJoinedGroupsByUserId(1L);
        assertEquals(groups1.size(), 7);

        groupService.joinGroup(3L,user);
        List<Group> groups2 = groupService.getJoinedGroupsByUserId(1L);
        assertEquals(groups2.size(), 8);

        groupService.exitGroup(3L,user);
        List<Group> groups3 = groupService.getJoinedGroupsByUserId(1L);
        assertEquals(groups3.size(), 7);

    }

    @Test
    public void createGroupTest() {
        Group group = new Group();
        group.setName("tech");
        group.setDescription("something about tech");
        group.setCreatedAt(LocalDateTime.now());
        group.setStatus("active");
        group.setCategory(categoryService.getCategoryById(2L));
        group.setHost(userRepo.findById(6L).get());

        groupService.saveGroup(group);
        List<Group> groups = groupService.searchGroups("tech");
    }


}
