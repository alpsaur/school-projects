package sg.edu.nus.laps.interfacemethods;

public interface LeaveProcessInterface {

    void rejectAppliedLeave(Integer leaveId, String comment);

    Boolean approveAppliedLeave(Integer leaveId, String comment) throws Exception;
}

