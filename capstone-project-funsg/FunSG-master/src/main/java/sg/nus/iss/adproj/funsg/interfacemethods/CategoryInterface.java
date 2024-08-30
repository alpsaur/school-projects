package sg.nus.iss.adproj.funsg.interfacemethods;

import sg.nus.iss.adproj.funsg.model.entity.Category;

import java.util.List;

public interface CategoryInterface {
    List<Category> getAllCategories();

    Category getCategoryById(Long categoryId);
}
