package sg.edu.nus.laps.model.Employee;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import sg.edu.nus.laps.repository.UserRepository;


@Entity
@Inheritance (strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="ROLE")
@Table(name = "users")
// Implements and Serializable required for Login
public abstract class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
            message = "The password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long")
    private String password="Ab123456";


    private boolean enabled = true;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public abstract String getUserType();
    //    public boolean getEnabled() {
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

}
