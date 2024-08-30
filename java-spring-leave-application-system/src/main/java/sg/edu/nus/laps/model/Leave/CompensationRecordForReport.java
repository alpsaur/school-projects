package sg.edu.nus.laps.model.Leave;

import java.time.LocalDate;

public class CompensationRecordForReport {
    public static final String[] CSV_HEADER = {
            "Staff ID",
            "First Name",
            "Last Name",
            "Overtime Date",
            "Overtime Hours",
            "Granted Leave",
            "Status",
            "Reason",
            "Comment"};
    public static final String[] CSV_NAME_MAPPING = {
            "staffId",
            "firstName",
            "lastName",
            "overtimeDate",
            "overtimeHours",
            "grantedLeave",
            "status",
            "reason",
            "comment"};


    private String firstName;
    private String lastName;
    private int staffId;
    private LocalDate overtimeDate;
    private int overtimeHours;
    private String status;
    private String reason;
    private String comment;

    public CompensationRecordForReport(String comment, String firstName, String lastName, LocalDate overtimeDate, int overtimeHours, String reason, int staffId, String status) {
        this.comment = comment;
        this.firstName = firstName;
        this.lastName = lastName;
        this.overtimeDate = overtimeDate;
        this.overtimeHours = overtimeHours;
        this.reason = reason;
        this.staffId = staffId;
        this.status = status;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public int getStaffId() {
        return staffId;
    }

    public String getOvertimeDate() {
        return overtimeDate.toString();
    }

    public String getGrantedLeave() {
        return String.format("%.1f days", overtimeHours / 4 * 0.5);
    }

    public int getOvertimeHours() {
        return overtimeHours;
    }

    public String getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public String getComment() {
        return comment;
    }

    public static final class Builder {
        private String comment;
        private String firstName;
        private String lastName;
        private int staffId;
        private LocalDate overtimeDate;
        private int overtimeHours;
        private String status;
        private String reason;

        private Builder() {
        }

        public static Builder aCompensationRecordForReport() {
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

        public Builder withOvertimeDate(LocalDate overtimeDate) {
            this.overtimeDate = overtimeDate;
            return this;
        }

        public Builder withOvertimeHours(int overtimeHours) {
            this.overtimeHours = overtimeHours;
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


        public CompensationRecordForReport build() {
            CompensationRecordForReport compensationRecordForReport = new CompensationRecordForReport(comment, firstName, lastName, overtimeDate, overtimeHours, reason, staffId, status);
            return compensationRecordForReport;
        }
    }
}
