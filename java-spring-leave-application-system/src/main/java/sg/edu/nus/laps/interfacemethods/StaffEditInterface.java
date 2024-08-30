package sg.edu.nus.laps.interfacemethods;

import sg.edu.nus.laps.model.Employee.Manager;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.StaffState;
import sg.edu.nus.laps.model.Employee.User;

public interface StaffEditInterface {

    public Staff saveNewStaff(Staff staff);

    public Staff editStaffBasics(Staff staff);

    public Staff saveAdmin(StaffState staffState);

    public Staff saveRole(StaffState staffState);

    public Staff saveLeaveBalance(Staff staff);

    public void dissolveManagedBy(Staff staff);

    public void buildManagedBy(Manager manager, Staff staff);

    public void deleteStaff(Staff staff);

    public User savePassword(User user);
}
