package sg.edu.nus.laps.model.Leave;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table
public class CompensationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private Staff staff;

    @Column
    @NotNull(message = "Please provide a overtimeDate")
    private LocalDate overtimeDate;
    @Column
    private int overtimeHours;
    @NotBlank(message = "Please provide a reason")
    private String reason;
    @Column
    private LocalDate claimDate;
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
    @Column
    private String comment;

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

    public LocalDate getOvertimeDate() {
        return overtimeDate;
    }

    public void setOvertimeDate(LocalDate overtimeDate) {
        this.overtimeDate = overtimeDate;
    }

    public int getOvertimeHours() {
        return overtimeHours;
    }

    public void setOvertimeHours(int overtimeHours) {
        this.overtimeHours = overtimeHours;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDate getClaimDate() {
        return claimDate;
    }

    public void setClaimDate(LocalDate claimDate) {
        this.claimDate = claimDate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
