package sg.edu.nus.laps.model.Employee;

//Helper method to pass Staff object and its admin access/manager (as two indicator) to model
public class StaffState {

    private Staff staff;
    private boolean isAdmin;
    private boolean isManager;

    public StaffState() {

    }
    public StaffState(Staff staff) {
        this.staff = staff;
        this.isManager = staff.getUserType().equals("manager");
        this.isAdmin = staff.getAdminAccess() != null;
    }
    public Staff getStaff() { return staff; }

    public void setStaff(Staff staff) { this.staff = staff; }

    public boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(boolean admin) {
        isAdmin = admin;
    }

    public boolean getIsManager() {
        return isManager;
    }

    public void setIsManager(boolean manager) {
        isManager = manager;
    }
}
