package sg.edu.nus.laps.model.Leave;

import jakarta.persistence.*;
import sg.edu.nus.laps.model.Enums.LeaveGranularity;

@Entity
@Table
public class LeaveType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int leaveCode;

    private String leaveType;
    @Enumerated(EnumType.STRING)
    private LeaveGranularity granularity;


    private double professionalInitBalance;

    private double administrativeInitBalance;

    public int getLeaveCode() {
        return leaveCode;
    }

    public void setLeaveCode(int leaveCode) {
        this.leaveCode = leaveCode;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public LeaveGranularity getGranularity() {
        return granularity;
    }

    public void setGranularity(LeaveGranularity granularity) {
        this.granularity = granularity;
    }

    public double getProfessionalInitBalance() {
        return professionalInitBalance;
    }

    public void setProfessionalInitBalance(double professionalInitBalance) {
        this.professionalInitBalance = professionalInitBalance;
    }

    public double getAdministrativeInitBalance() {
        return administrativeInitBalance;
    }

    public void setAdministrativeInitBalance(double administrativeInitBalance) {
        this.administrativeInitBalance = administrativeInitBalance;
    }
}
