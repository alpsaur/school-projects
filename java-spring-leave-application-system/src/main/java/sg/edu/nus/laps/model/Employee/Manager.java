package sg.edu.nus.laps.model.Employee;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
@DiscriminatorValue("manager")
public class Manager extends Staff {

    @OneToMany(mappedBy = "managedBy")
    private List<Staff> subordinates;

    public List<Staff> getSubordinates() {
        return subordinates;
    }

    public void setSubordinates(List<Staff> subordinates) {
        this.subordinates = subordinates;
    }
    @Override
    public String getUserType() {
        return "manager";
    }
}
