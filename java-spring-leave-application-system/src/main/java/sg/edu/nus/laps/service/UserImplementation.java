package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sg.edu.nus.laps.interfacemethods.UserInterface;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserImplementation implements UserInterface {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Boolean isManager(int id) {
        String role = userRepository.findRoleById(id);
        return "manager".equalsIgnoreCase(role);
    }

    @Override
    public List<Staff> findSubodinatesByManagerId(int id){
        return userRepository.findSubordinatesByManagerId(id);
    }

    @Override
    public List<User>getSubordinatesInfo(int id){
        List<Staff> staffs = findSubodinatesByManagerId(id);
        final ArrayList<User> myStaffs = new ArrayList();
        for(User staff : staffs){
            ((Staff) staff).setManagedBy(null);
            ((Staff) staff).setLeaveRecords(null);
            ((Staff) staff).setCompensationRecord(null);
            ((Staff) staff).setLeaveBalance(null);
            ((Staff) staff).setAdminAccess(null);
            ((Staff) staff).setDesignation(null);
            myStaffs.add(staff);
        }

       return myStaffs;
    }

}
