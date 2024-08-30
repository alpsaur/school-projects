package sg.edu.nus.laps.model.Leave;

import java.time.LocalDate;

public class LeaveRecordForReport {
    public static final String[] CSV_HEADER = {
            "Staff ID",
            "First Name",
            "Last Name",
            "Leave Type",
            "Start Date",
            "End Date",
            "Status",
            "Reason",
            "Work Dissenmination",
            "Comment"};
    public static final String[] CSV_NAME_MAPPING = {
            "staffId",
            "firstName",
            "lastName",
            "leaveType",
            "startDate",
            "endDate",
            "status",
            "reason",
            "workDissenmination",
            "comment"};

    private String firstName;
    private String lastName;
    private int staffId;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String reason;
    private String comment;
    private String workDissenmination;


    public LeaveRecordForReport(String comment, LocalDate endDate, String firstName, String lastName, String leaveType, String reason, int staffId, LocalDate startDate, String status, String workDissenmination) {
        this.comment = comment;
        this.endDate = endDate;
        this.firstName = firstName;
        this.lastName = lastName;
        this.leaveType = leaveType;
        this.reason = reason;
        this.staffId = staffId;
        this.startDate = startDate;
        this.status = status;
        this.workDissenmination = workDissenmination;
    }

    public String getEndDate() {
        return endDate.toString();
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public int getStaffId() {
        return staffId;
    }

    public String getStartDate() {
        return startDate.toString();
    }

    public String getStatus() {
        return status;
    }

    public String getComment() {
        return comment;
    }

    public String getReason() {
        return reason;
    }

    public String getWorkDissenmination() {
        return workDissenmination;
    }

    public static final class Builder {
        private String comment;
        private String firstName;
        private String lastName;
        private int staffId;
        private String leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private String reason;
        private String workDissenmination;

        private Builder() {
        }

        public static Builder aLeaveRecordForReport() {
            return new Builder();
        }

        public Builder withComment(String comment) {
            this.comment = comment;
            return this;
        }

        public Builder withFirstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder withLastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder withStaffId(int staffId) {
            this.staffId = staffId;
            return this;
        }

        public Builder withLeaveType(String leaveType) {
            this.leaveType = leaveType;
            return this;
        }

        public Builder withStartDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }

        public Builder withEndDate(LocalDate endDate) {
            this.endDate = endDate;
            return this;
        }

        public Builder withStatus(String status) {
            this.status = status;
            return this;
        }

        public Builder withReason(String reason) {
            this.reason = reason;
            return this;
        }

        public Builder withWorkDissenmination(String workDissenmination) {
            this.workDissenmination = workDissenmination;
            return this;
        }

        public LeaveRecordForReport build() {
            return new LeaveRecordForReport(comment, endDate, firstName, lastName, leaveType, reason, staffId, startDate, status, workDissenmination);
        }
    }
}
