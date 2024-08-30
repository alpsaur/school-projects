package sg.edu.nus.laps.model.Leave;

import jakarta.persistence.*;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Enums.StaffDesignation;

import java.util.Map;

@Entity
@Table(name = "leave_balance")
public class LeaveBalance {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private Staff staff;

    @ManyToOne
    private LeaveType leaveType;

    private double forwardBalance;

    private double currentBalance;

    public LeaveBalance() {}
    public LeaveBalance(LeaveType leaveType,Staff staff) {
        this.leaveType = leaveType;
        this.staff = staff;
        forwardBalance = 0;
        if(staff.getDesignation() == StaffDesignation.Professional) {
            currentBalance = leaveType.getProfessionalInitBalance();
        } else {
            currentBalance = leaveType.getAdministrativeInitBalance();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public double getForwardBalance() {
        return forwardBalance;
    }

    public void setForwardBalance(double forwardBalance) {
        this.forwardBalance = forwardBalance;
    }

    public double getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(double currentBalance) {
        this.currentBalance = currentBalance;
    }

}
