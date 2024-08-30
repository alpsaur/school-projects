package sg.edu.nus.laps.interfacemethods;


import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;

import java.util.List;

public interface GetStaffInterface {

    public List<Staff> findAllStaff();

    //A staff can be found if any of his firstName,lastName,phoneNumber,email include the searchStr
    public List<Staff> findByStr(String searchStr);

    public Staff findStaffById(int id);

    public List<Staff> findStaffsWithoutManager();

    public User findUserById(int id);
}
