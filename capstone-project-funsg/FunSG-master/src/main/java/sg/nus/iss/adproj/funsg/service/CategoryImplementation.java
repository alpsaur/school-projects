package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.nus.iss.adproj.funsg.interfacemethods.CategoryInterface;
import sg.nus.iss.adproj.funsg.model.entity.Category;
import sg.nus.iss.adproj.funsg.repository.CategoryRepository;

import java.util.List;

@Service
@Transactional
public class CategoryImplementation implements CategoryInterface {
    @Autowired
    CategoryRepository categoryRepo;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepo.findById(categoryId).get();
    }
}
