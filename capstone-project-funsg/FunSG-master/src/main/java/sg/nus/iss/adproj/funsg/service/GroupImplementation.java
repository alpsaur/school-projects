package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.nus.iss.adproj.funsg.interfacemethods.GroupInterface;
import sg.nus.iss.adproj.funsg.model.dto.AdminStatusUpdateRequest;
import sg.nus.iss.adproj.funsg.model.entity.Category;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.Member;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.repository.CategoryRepository;
import sg.nus.iss.adproj.funsg.repository.EventRepository;
import sg.nus.iss.adproj.funsg.repository.GroupRepository;
import sg.nus.iss.adproj.funsg.repository.MemberRepository;
import sg.nus.iss.adproj.funsg.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import static sg.nus.iss.adproj.funsg.model.utils.UtilMethods.calCosSimilarity;


@Service
@Transactional
public class GroupImplementation implements GroupInterface {
    @Autowired
    EventRepository eventRepo;

    @Autowired
    GroupRepository groupRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    CategoryRepository categoryRepo;

    @Autowired
    MemberRepository memberRepo;

    @Autowired
    EmailService emailService;


    @Override
    public List<Group> getGroupsByMBTI(User currentUser) {
        List<Group> groups = groupRepo.findAllActiveGroups();
        List<Group> sortedGroups = groups.stream()
                .filter(group -> !checkUserInGroup(currentUser, group))
                .sorted(Comparator.comparing(group -> calScoresOfGroup(currentUser, (Group) group)).reversed())
                .toList();
        return sortedGroups;
    }

    @Override
    public List<Group> getAllGroupsSortedByPopularity() {
        return groupRepo.findActiveGroupsOrderByMembersCount();
    }

    @Override
    public Group getGroupById(Long groupId) {
        return groupRepo.findById(groupId).orElse(null);
    }

    @Override
    public boolean joinGroup(Long groupId, User currentUser) {

        Group group = getGroupById(groupId);
        if (group == null) {
            return false;
        } else if (checkUserInGroup(currentUser, group)) {
            //if the user has been in the group
            return true;
        }

        //create a new Member object
        Member newMember = new Member();
        newMember.setUser(currentUser);
        newMember.setGroup(group);
        newMember.setJoinedAt(LocalDateTime.now());
        memberRepo.save(newMember);

        //store new info in user,group entity
        if (currentUser.getMembers() == null) {
            currentUser.setMembers(new ArrayList<>());
        }
        currentUser.getMembers().add(newMember);
        group.getMembers().add(newMember);//a group must have a host as a member, so no need to check whether members == null
        userRepo.save(currentUser);
        groupRepo.save(group);

        return true;
    }

    @Override
    public boolean exitGroup(Long groupId, User currentUser) {
        Group group = getGroupById(groupId);
        //Find the member object corresponding to the group and user
        Member member = null;
        List<Member> members = currentUser.getMembers();
        for (Member m : members) {
            if (m.getGroup().getId().equals(group.getId())) {
                member = m;
            }
        }
        if (member == null) {
            //The user doesn't exist in the group
            return false;
        } else if (member.getGroup().getHost().getId().equals(currentUser.getId())) {
            //The user is the host of this group, and he's not allowed to exit
            return false;
        }

        //execute remove and save in every entity
        members.remove(member);
        group.getMembers().remove(member);
        userRepo.save(currentUser);
        groupRepo.save(group);
        memberRepo.delete(member);

        return true;
    }

    @Override
    public List<Group> getJoinedGroupsByUserId(Long id) {
        User currentUser = userRepo.findById(id).orElse(null);
        if (currentUser == null) {
            return null;
        }

        List<Member> members = currentUser.getMembers();
        if (members == null || members.isEmpty()) {
            return null;
        }

        List<Group> groups = new ArrayList<>();
        members.forEach(member
                -> groups.add(member.getGroup()));
        return groups;
    }

    @Override
    public List<Group> getGroupsByCategoryId(Long categoryId) {
        Category category = categoryRepo.findById(categoryId).orElse(null);
        if (category == null) {
            return null;
        }
        return groupRepo.findByCategory(category);
    }

    @Override
    public List<Group> searchGroups(String query) {
        String[] keywords = query.split("\\s+");

        Set<Group> groupSet = new HashSet<>();
        for (String keyword : keywords) {
            groupSet.addAll(groupRepo.findBySearchTerm(keyword));
        }
        List<Group> groupsResult = groupSet.stream()
                .sorted(Comparator.comparing(Group::getName))
                .toList();

        return groupsResult;
    }

    @Override
    public Group saveGroup(Group group) {
        return groupRepo.save(group);
    }

    //helper method: to check whether a user is in a group
    private boolean checkUserInGroup(User currentUser, Group group) {
        List<Member> members = group.getMembers();
        boolean condition = members
                .stream()
                .anyMatch(member ->
                        member.getUser().getId().equals(currentUser.getId()));
        return condition;
    }

    //helper method: Calculate a score to indicate the degree of fit between a user and a group on the four dimensions of MBTI
    private double calScoresOfGroup(User user, Group group) {
        double score;

        //use double array to calculate cosineSimilarity
        double[] user_mbti_vec = {user.getIE_Tendancy(), user.getNS_Tendancy(),
                user.getTF_Tendancy(), user.getJP_Tendancy()};

        Category category = group.getCategory();
        double[] group_mbti_vec = {category.getIE_Tendancy(), category.getNS_Tendancy(),
                category.getTF_Tendancy(), category.getJP_Tendancy()};

        double[] user_groups_mbti_vec = getMBTIVecOfUserCurrentGroups(user);

        User host = group.getHost();
        double[] group_host_mbti_vec = {host.getIE_Tendancy(), host.getNS_Tendancy(),
                host.getTF_Tendancy(), host.getJP_Tendancy()};

        Random rnd = new Random();

        score = 0.4 * calCosSimilarity(user_mbti_vec, group_mbti_vec) +
                0.2 * calCosSimilarity(user_groups_mbti_vec, group_mbti_vec) +
                0.2 * calCosSimilarity(user_mbti_vec, group_host_mbti_vec) +
                0.2 * rnd.nextDouble();

        return score;
    }

    //helper method: get MBTI vector based on all the groups that a user is taking part in
    private double[] getMBTIVecOfUserCurrentGroups(User user) {
        double[] user_groups_mbti_vec = new double[4];
        List<Member> members = user.getMembers();
        members.forEach(member -> {
            user_groups_mbti_vec[0] += member.getGroup().getCategory().getIE_Tendancy();
            user_groups_mbti_vec[1] += member.getGroup().getCategory().getNS_Tendancy();
            user_groups_mbti_vec[2] += member.getGroup().getCategory().getTF_Tendancy();
            user_groups_mbti_vec[3] += member.getGroup().getCategory().getJP_Tendancy();
        });
        return user_groups_mbti_vec;
    }


    @Override
    public List<Group> getGroupsWithPending() {

        return groupRepo.findAllPendingGroups();
    }

    @Override
    public Group updateGroupStatus(Long groupId, AdminStatusUpdateRequest statusUpdateRequest) {
        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        String subject;
        String text;
        if (statusUpdateRequest.getStatus().equals("active")) {
            subject = "Your group is now active!";
            text = "Congratulations! Your group is now active on our platform.<br><br>"
                    + "<strong>Group Name:</strong> " + group.getName() + "<br><br>"
                    + "You can view the details of your group by clicking the link below:<br>"
                    + "<a href='https://funsg.dev/group/" + group.getId() + "'>"
                    + "View Group Details</a><br><br>"
                    + "Thank you for using our platform. We wish you continued success with your group!";

        } else if(statusUpdateRequest.getStatus().equals("rejected")) {
            String msg = statusUpdateRequest.getMessage();
            subject = "Your group application has been rejected.";
            text = "We regret to inform you that your application to create a group has been rejected.<br><br>"
                    + "<strong>Group Name:</strong> " + group.getName() + "<br><br>"
                    + "<strong>Reason for Rejection:</strong> " + msg + "<br><br>"
                    + "If you have any questions or would like more information, please don't hesitate to contact us."
                    + "<br><br>Thank you for your understanding.";

        }else{
            // For deactivate group case
            String msg = statusUpdateRequest.getMessage();
            subject = "Your group has been deactivated.";
            text = "We regret to inform you that your group has been deactivated.<br><br>"
                    + "<strong>Group Name:</strong> " + group.getName() + "<br><br>"
                    + "<strong>Reason for Deactivation:</strong> " + msg + "<br><br>"
                    + "If you have any questions or need further assistance, please contact our support team."
                    + "<br><br>We appreciate your contributions to the platform and hope to see you again in the future.";

        }


        new Thread(() -> {
            try {
                emailService.sendEmail(group.getHost().getEmail(), subject, text);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }).start();


        group.setStatus(statusUpdateRequest.getStatus());
        return groupRepo.save(group);
    }

    @Override
    public Page<Group> getAllNonPendingGroups(Pageable pageable) {
        return groupRepo.findAllNonPendingGroups(pageable);
    }


    @Override
    public Group createGroup(Group group, User currentUser) {

        group.setComments(new ArrayList<>());
        group.setEvents(new ArrayList<>());

        Member newMember = Member.builder()
                .user(currentUser)
                .group(group)
                .joinedAt(LocalDateTime.now())
                .build();
        group.setMembers(new ArrayList<>());
        group.getMembers().add(newMember);
        memberRepo.save(newMember);

        if (currentUser.getOwnGroups() == null) {
            currentUser.setOwnGroups(new ArrayList<>());
        }
        currentUser.getOwnGroups().add(group);
        if (currentUser.getMembers() == null) {
            currentUser.setMembers(new ArrayList<>());
        }
        currentUser.getMembers().add(newMember);
        userRepo.save(currentUser);

        return groupRepo.save(group);
    }

    @Override
    public Page<Group> getAllNonPendingGroupsByCategoryId(Long categoryId, Pageable pageable) {
        return groupRepo.findAllNonPendingGroupsByCategoryId(categoryId, pageable);
    }

    @Override
    public List<Group> getAllActiveGroups() {
        return groupRepo.findAllActiveGroups();
    }
}
