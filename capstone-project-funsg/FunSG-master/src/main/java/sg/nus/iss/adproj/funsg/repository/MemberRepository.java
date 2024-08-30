package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sg.nus.iss.adproj.funsg.model.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
