package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findBySellerId(String sellerId);
    List<Product> findByCategoryAndPriceLessThanEqual(String category, Double maxPrice);
    List<Product> findByPriceLessThanEqual(Double maxPrice);
    List<Product> findByCategory(String category);
}
