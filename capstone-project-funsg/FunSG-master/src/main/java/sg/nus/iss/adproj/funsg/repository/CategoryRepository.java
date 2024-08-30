package sg.nus.iss.adproj.funsg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sg.nus.iss.adproj.funsg.model.entity.Category;

public interface CategoryRepository extends JpaRepository<Category,Long> {

}
