package sg.edu.nus.laps.interfacemethods;

import sg.edu.nus.laps.model.Leave.LeaveType;

import java.util.List;

public interface LeaveTypeInterface {
    public List<LeaveType> SearchAllLeaveType();
    public LeaveType addnewLeaveType(LeaveType leaveType);
    public void deleteLeaveType(int id);
    public int SearchLeaveCodeMax();
    public LeaveType SearchLeaveType(int id);
}
