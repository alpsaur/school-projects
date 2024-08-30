package sg.edu.nus.laps.interfacemethods;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;

import java.util.List;

public interface UserInterface {

    Boolean isManager(int id);

    List<Staff> findSubodinatesByManagerId(int id);

    List<User>getSubordinatesInfo(int id);
}
