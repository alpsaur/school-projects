package sg.edu.nus.laps.interfacemethods;

import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveType;

import java.util.List;

public interface LeaveBalanceInterface {
    public void addNewLeaveTypeBalance(LeaveBalance leaveBalance);

    public void deleteLeaveTypeBalance(int balanceId);

    public List<LeaveBalance> searchLeaveBalanceByLeaveType(LeaveType leaveType);

    public int updateForwardLeaveBalanceByStaffIdByLeaveCode(Integer id, Integer leaveCode, Double newBalance);

    public int updateCurrentLeaveBalanceByStaffIdByLeaveCode(Integer id, Integer leaveCode, Double deduction);

    public LeaveBalance getLeaveBalanceByStaffIdByLeaveCode(Integer id, Integer leaveCode);

    List<LeaveBalance> getLeaveBalanceByStaffId(Integer id, Integer currYear);

    List<LeaveBalance> getSubordinatesLeaveBalanceInfo(int id);

    public void addAllNewLeaveTypeBalance(List<Staff> stafflist, LeaveType leaveType);

    public void modifyLeaveBalance(LeaveType leaveTypeForUpdate,double changeAdmin,double changePro);
}
