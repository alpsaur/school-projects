package sg.edu.nus.laps.model.Employee;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
@DiscriminatorValue("admin")
public class Admin extends User {

    @OneToOne
    private Staff staff;

    @Override
    public String getUserType() {
        return "admin";
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    // For login navbar bug, delegates the firstName getter to the associated Staff object
    public String getFirstName() {
        if (staff != null) {
            return staff.getFirstName();
        } else {
            return null;
        }
    }

}
