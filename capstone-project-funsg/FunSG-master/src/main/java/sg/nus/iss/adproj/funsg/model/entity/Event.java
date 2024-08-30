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
@Setter
@Getter
@Builder
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Group group;

    private String name;

    private LocalDateTime start;

    private LocalDateTime end;

    @Column(length = 1000)
    private String description;

    private String location;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JsonBackReference
    private User createdBy;

    private String status;

    private int maxParticipants;

    private String profileImagePath;

    @OneToMany(mappedBy = "event")
    @JsonManagedReference
    private List<EventParticipant> eventsParticipants;


    @OneToMany(mappedBy = "event")
    @JsonManagedReference
    private List<EventArtifact> artifacts;
}
