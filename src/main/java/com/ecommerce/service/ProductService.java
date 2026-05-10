package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.model.Product;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Product> getAllProducts(String category, Double maxPrice) {
        if (category != null && !category.isEmpty() && maxPrice != null) {
            return productRepository.findByCategoryAndPriceLessThanEqual(category, maxPrice);
        } else if (category != null && !category.isEmpty()) {
            return productRepository.findByCategory(category);
        } else if (maxPrice != null) {
            return productRepository.findByPriceLessThanEqual(maxPrice);
        }
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsBySeller(String email) {
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return productRepository.findBySellerId(seller.getId());
    }

    public Product createProduct(ProductRequest request, String email) {
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        // Role check: user must be SELLER or ADMIN
        boolean isSeller = seller.getRoles() != null &&
            (seller.getRoles().contains(Role.SELLER) || seller.getRoles().contains(Role.ADMIN));
        if (!isSeller) {
            throw new RuntimeException("Access denied: Only sellers can create products");
        }

        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setTags(request.getTags());
        product.setImageUrl(request.getImageUrl());
        product.setSellerId(seller.getId());

        return productRepository.save(product);
    }

    public Product updateProduct(String id, ProductRequest request, String email) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (!existingProduct.getSellerId().equals(seller.getId())) {
            throw new RuntimeException("Unauthorized: You can only edit your own products");
        }

        existingProduct.setTitle(request.getTitle());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setCategory(request.getCategory());
        existingProduct.setTags(request.getTags());
        existingProduct.setImageUrl(request.getImageUrl());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(String id, String email) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        boolean isAdmin = seller.getRoles().stream().anyMatch(role -> role.name().equals("ADMIN"));
        if (!isAdmin && !existingProduct.getSellerId().equals(seller.getId())) {
            throw new RuntimeException("Unauthorized: You can only delete your own products");
        }

        productRepository.deleteById(id);
    }
}
