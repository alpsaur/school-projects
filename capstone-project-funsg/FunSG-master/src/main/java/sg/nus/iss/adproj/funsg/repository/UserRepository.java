package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sg.nus.iss.adproj.funsg.model.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    // for UserDetailsService Bean in ApplicationConfiguration
    Optional<User> findByEmail(String email);

    @Query("select u from User u left join fetch u.eventParticipants where u.id = :id")
    public User findByIdWithParticipants(Long id);

    @Override
    @Query("select u from User u where u.status != 'admin' ")
    public List<User> findAll();

    @Query("select u from User u where u.status != 'admin' ")
    Page<User> findAll(Pageable pageable);

    @Query("select u from User u where u.createdAt between :from and :to and u.status !='admin'")
    List<User> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}

