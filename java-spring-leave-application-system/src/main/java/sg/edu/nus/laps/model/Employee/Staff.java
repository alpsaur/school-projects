package sg.edu.nus.laps.model.Employee;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.format.annotation.NumberFormat;
import sg.edu.nus.laps.model.Enums.StaffDesignation;
import sg.edu.nus.laps.model.Leave.CompensationRecord;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveRecords;

import java.util.List;

@Entity
@DiscriminatorValue("staff")
public class Staff extends User{

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d+(-\\d+)*", message = "Phone number must contain only digits and hyphens")
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email should be valid")
    private String email;

    @NotNull(message = "Designation is required")
    @Enumerated(EnumType.STRING)
    private StaffDesignation designation;

    @ManyToOne
    private Manager managedBy;

    @OneToOne(mappedBy = "staff")
    private Admin adminAccess;

    @OneToMany(mappedBy = "staff")
    private List<CompensationRecord> compensationRecord;

    @OneToMany(mappedBy = "staff")
    private List<LeaveBalance> leaveBalance;

    @OneToMany(mappedBy = "staff")
    private List<LeaveRecords> leaveRecords;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Manager getManagedBy() {
        return managedBy;
    }

    public void setManagedBy(Manager managedBy) {
        this.managedBy = managedBy;
    }

    public StaffDesignation getDesignation() {
        return designation;
    }

    public void setDesignation(StaffDesignation designation) {
        this.designation = designation;
    }

    public Admin getAdminAccess() {
        return adminAccess;
    }

    public void setAdminAccess(Admin adminAccess) {
        this.adminAccess = adminAccess;
    }

    public List<LeaveBalance> getLeaveBalance() {
        return leaveBalance;
    }

    public void setLeaveBalance(List<LeaveBalance> leaveBalance) {
        this.leaveBalance = leaveBalance;
    }

    public List<CompensationRecord> getCompensationRecord() {
        return compensationRecord;
    }

    public void setCompensationRecord(List<CompensationRecord> compensationRecord) {
        this.compensationRecord = compensationRecord;
    }

    public List<LeaveRecords> getLeaveRecords() {
        return leaveRecords;
    }

    public void setLeaveRecords(List<LeaveRecords> leaveRecords) {
        this.leaveRecords = leaveRecords;
    }

    @Override
    public String getUserType() {
        return "staff";
    }
}
