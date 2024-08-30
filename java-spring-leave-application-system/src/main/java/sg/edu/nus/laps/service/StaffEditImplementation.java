package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.interfacemethods.StaffEditInterface;
import sg.edu.nus.laps.model.Employee.*;
import sg.edu.nus.laps.model.Leave.CompensationRecord;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveRecords;
import sg.edu.nus.laps.model.Leave.LeaveType;
import sg.edu.nus.laps.repository.LeaveBalanceRepository;
import sg.edu.nus.laps.repository.LeaveTypeRepository;
import sg.edu.nus.laps.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class StaffEditImplementation implements StaffEditInterface {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepo;

    @Autowired
    private LeaveTypeRepository leaveTypeRepo;

    @Autowired
    private EmailService emailService;


    @Override
    public Staff saveNewStaff(Staff staff) {
        staff.setUsername(generateUsername());
        updateLeaveBalanceForNewStaff(staff);

        //send email to new staff to let him change his password
        String subject = "New Account has been created";
        String text = "Your have a new staff/manager account in LAPS.<br><br>"
                + "Username: " + staff.getUsername()+"<br><br>"
                + "Initial password: " + staff.getPassword()+"<br><br>"
                + "<a href='http://localhost:8080/'>Login to view details and change password</a>";
        try {
            emailService.sendEmail(staff.getEmail(),subject,text);
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return userRepo.save(staff);
    }

    @Override
    public Staff editStaffBasics(Staff staff) {
        Staff curStaff = userRepo.findStaffById(staff.getId());
        curStaff.setFirstName(staff.getFirstName());
        curStaff.setLastName(staff.getLastName());
        curStaff.setEmail(staff.getEmail());
        curStaff.setPhoneNumber(staff.getPhoneNumber());
        curStaff.setDesignation(staff.getDesignation());
        userRepo.save(curStaff);

        return curStaff;
    }

    @Override
    public User savePassword(User user) {
        User curUser = userRepo.findUserById(user.getId());
        curUser.setPassword(user.getPassword());
        return userRepo.save(curUser);
    }


    @Override
    public Staff saveAdmin(StaffState staffState) {
        Staff curStaff = staffState.getStaff();
        boolean originalAccess = curStaff.getAdminAccess() != null;
        if (staffState.getIsAdmin() == originalAccess) {
            //if new access = original access,nothing happens
            return curStaff;
        } else if (staffState.getIsAdmin()) { //if a new admin is being set
            Admin newAdmin = new Admin();
            newAdmin.setUsername(generateUsername());
            newAdmin.setPassword(curStaff.getPassword());
            newAdmin.setStaff(curStaff);

            //send email to the staff to let him change his password
            String subject = "New Account has been created";
            String text = "Your have a new Admin account in LAPS.<br><br>"
                    + "Username: " + newAdmin.getUsername()+"<br><br>"
                    + "Initial password: " + curStaff.getPassword()+"<br><br>"
                    + "<a href='http://localhost:8080/'>Login to view details and change password</a>";
            try {
                emailService.sendEmail(curStaff.getEmail(),subject,text);
            }catch (Exception e){
                System.out.println(e.getMessage());
            }

            userRepo.save(newAdmin);
            return curStaff;
        } else { //if an old admin access is being deleted
            Admin curAdmin = curStaff.getAdminAccess();
            curAdmin.setEnabled(false);
            curAdmin.setStaff(null);
            curStaff.setAdminAccess(null);
            return  userRepo.save(curStaff);
        }
    }

    @Override
    public Staff saveRole(StaffState staffState) {
        Staff curStaff = staffState.getStaff();
        boolean isCurManager = curStaff.getUserType().equals("manager");
        if (staffState.getIsManager() == isCurManager) {
            //if new role = original role,nothing happens
            return curStaff;
        } else if (staffState.getIsManager()) {
            //if a new manager is being set
            return transfer(curStaff,new Manager());
        } else {
            //if a manager is being downgraded to a staff
            Staff newStaff = transfer(curStaff,new Staff());

            //disable original current Manager
            // and clear relationship between him and his subordinates
            Manager curManager = (Manager) curStaff;
            List<Staff> staffList = curManager.getSubordinates();
            curManager.setSubordinates(null);
            userRepo.save(curManager);
            staffList.forEach(staff -> {
                staff.setManagedBy(null);
                userRepo.save(staff);
            });

            return  userRepo.save(newStaff);
        }
    }

    @Override
    public Staff saveLeaveBalance(Staff staff) {
        return userRepo.save(staff);
    }

    @Override
    public void dissolveManagedBy(Staff staff) {
        Manager curManager = staff.getManagedBy();
        List<Staff> staffList = curManager.getSubordinates();
        staffList.remove(staff);
        userRepo.save(curManager);

        staff.setManagedBy(null);
        userRepo.save(staff);
    }

    @Override
    public void buildManagedBy(Manager manager, Staff staff) {
        List<Staff> staffList;
        if (manager.getSubordinates() != null) {
            staffList = manager.getSubordinates();
        } else {
            staffList = new ArrayList<Staff>();
        }
        staffList.add(staff);
        staff.setManagedBy(manager);
        userRepo.save(manager);
        userRepo.save(staff);
    }

    @Override
    public void deleteStaff(Staff staff) {
        if (staff.getAdminAccess() != null) {
            staff.getAdminAccess().setStaff(null);
            staff.setAdminAccess(null);
        }
        if (staff.getManagedBy() != null) {
            List<Staff> staffList = staff.getManagedBy().getSubordinates();
            staffList.remove(staff);
        }
        if (staff.getUserType().equals("manager")) {
            Manager manager = (Manager)staff;
            List<Staff> staffList = manager.getSubordinates();
            staffList.forEach(subordinate -> subordinate.setManagedBy(null));
        }
        staff.setManagedBy(null);
        staff.setEnabled(false);

    }




    //helper method: to generate a unique username
    private String generateUsername() {
        String username = "";
        Random rand = new Random();
        do {
            username = "nusiss"+ rand.nextInt(1000,9999);
        } while (userRepo.existsByUsername(username));
        return username;
    }

    //helper method: transfer basic information from sender to receiver
    //normally one is a staff and another is a manager
    //the sender will be disabled
    private Staff transfer(Staff sender, Staff receiver) {
        receiver.setFirstName(sender.getFirstName());
        receiver.setLastName(sender.getLastName());
        receiver.setEmail(sender.getEmail());
        receiver.setPhoneNumber(sender.getPhoneNumber());
        receiver.setDesignation(sender.getDesignation());

        //transfer Entity reference:LeaveBalance
        List<LeaveBalance> leaveBalanceList = sender.getLeaveBalance();
        leaveBalanceList.forEach(leaveBalance -> leaveBalance.setStaff(receiver));
        receiver.setLeaveBalance(leaveBalanceList);
        sender.setLeaveBalance(null);

        //transfer Entity reference:LeaveRecords
        List<LeaveRecords> leaveRecordsList = sender.getLeaveRecords();
        leaveRecordsList.forEach(leaveRecords -> leaveRecords.setStaff(receiver));
        receiver.setLeaveRecords(leaveRecordsList);
        sender.setLeaveRecords(null);

        //transfer Entity reference:CompensationRecord
        List<CompensationRecord> compensationRecordList = sender.getCompensationRecord();
        compensationRecordList.forEach(compensationRecord -> compensationRecord.setStaff(receiver));
        receiver.setCompensationRecord(compensationRecordList);
        sender.setCompensationRecord(null);

        String userName = sender.getUsername();
        receiver.setUsername(userName);

        //To keep unique username in the database,set a random prefix
        // before username in original account
        sender.setUsername(disableUserName(userName));
        sender.setEnabled(false);
        userRepo.save(sender);

        return userRepo.save(receiver);
    }

    //helper method: update leaveBalance for a new createdStaff
    private void updateLeaveBalanceForNewStaff(Staff staff) {
        //add leaveBalance for each current leaveType
        List<LeaveType> leaveTypeList = leaveTypeRepo.findAll();
        for (LeaveType leaveType : leaveTypeList) {
            LeaveBalance leaveBalance = new LeaveBalance(leaveType,staff);
            leaveBalanceRepo.save(leaveBalance);
        }
    }

    //helper method: set a random prefix before username in original account
    private String disableUserName(String username) {
        Random rnd = new Random();
        int randInt1 = rnd.nextInt(26);
        int randInt2 = rnd.nextInt(26);
        char randomLetter1 = (char)('a' + randInt1);
        char randomLetter2 = (char)('a' + randInt2);
        String newUsername = "disabled_" + randomLetter1 + randomLetter2 + username;
        return newUsername;
    }
}
