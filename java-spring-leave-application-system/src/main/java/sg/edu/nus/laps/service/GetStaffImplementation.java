package sg.edu.nus.laps.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sg.edu.nus.laps.interfacemethods.GetStaffInterface;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.repository.UserRepository;

import java.util.List;

@Service
@Transactional
public class GetStaffImplementation implements GetStaffInterface {
    @Autowired
    private UserRepository userRepo;

    @Override
    public List<Staff> findAllStaff() {
        return userRepo.findAllStaff();
    }

    @Override
    public List<Staff> findByStr(String searchStr) {
        return userRepo.findByStr(searchStr);
    }

    @Override
    public Staff findStaffById(int id) {
        return userRepo.findStaffById(id);
    }

    @Override
    public List<Staff> findStaffsWithoutManager() {
        return userRepo.findStaffsWithoutManager();
    }

    @Override
    public User findUserById(int id) {
        return userRepo.findUserById(id);
    }


}
