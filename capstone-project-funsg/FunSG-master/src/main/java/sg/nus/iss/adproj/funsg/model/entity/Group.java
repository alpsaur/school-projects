package sg.nus.iss.adproj.funsg.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "interest_group") // Change the table name to "groups" to avoid using reserved keyword 'GROUP'
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private User host;

    @OneToMany(mappedBy = "group")
    @JsonManagedReference
    private List<Comment> comments;

    @OneToMany(mappedBy = "group", fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Member> members;

    @OneToMany(mappedBy = "group")
    @JsonManagedReference
    private List<Event> events;

    @ManyToOne
    @JsonBackReference
    private Category category;

    private String name;

    @Column(length = 1000)
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private String status;
    private String profileImagePath;

}
