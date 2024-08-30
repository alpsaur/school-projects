package sg.edu.nus.laps.model.Leave;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;

import java.time.LocalDate;

@Entity
@Table
public class LeaveRecords {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne

    private Staff staff;

    @ManyToOne

    private LeaveType leaveType;

    @NotNull(message = "Please provide a startDate")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotBlank(message = "Please provide a reason")
    private String reason;

    private String workDissenmination;

    private String comment;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getWorkDissenmination() {
        return workDissenmination;
    }

    public void setWorkDissenmination(String workDissenmination) {
        this.workDissenmination = workDissenmination;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
