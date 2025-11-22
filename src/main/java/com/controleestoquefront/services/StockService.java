package com.controleestoquefront.services;
import com.controleestoquefront.models.Category;
import com.controleestoquefront.models.Product;
import com.controleestoquefront.models.Movement;

import java.util.List;

public interface StockService {

    
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category createCategory(Category category);
    Category updateCategory(Long id, Category category);
    boolean deleteCategory(Long id);

   
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product product);
    boolean deleteProduct(Long id);

    
    List<Movement> getAllMovements();
    Movement createMovement(Movement movement);

    
    String generateReport();
}
