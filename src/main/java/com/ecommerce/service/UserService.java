package com.ecommerce.service;

import com.ecommerce.model.BankDetails;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void addToWishlist(String email, String productId) {
        User user = getUserByEmail(email);
        if (user.getWishlist() == null) user.setWishlist(new HashSet<>());
        user.getWishlist().add(productId);
        userRepository.save(user);
    }

    public void removeFromWishlist(String email, String productId) {
        User user = getUserByEmail(email);
        if (user.getWishlist() != null) {
            user.getWishlist().remove(productId);
            userRepository.save(user);
        }
    }

    public List<Product> getWishlistProducts(String email) {
        User user = getUserByEmail(email);
        if (user.getWishlist() == null || user.getWishlist().isEmpty()) return new ArrayList<>();
        return productRepository.findAllById(user.getWishlist());
    }

    public void addToCart(String email, String productId, int quantity) {
        User user = getUserByEmail(email);
        if (user.getCart() == null) user.setCart(new ArrayList<>());
        
        // Check if product already exists in cart
        for (CartItem item : user.getCart()) {
            if (item.getProductId().equals(productId)) {
                item.setQuantity(item.getQuantity() + quantity);
                userRepository.save(user);
                return;
            }
        }
        
        user.getCart().add(new CartItem(productId, quantity));
        userRepository.save(user);
    }

    public void removeFromCart(String email, String productId) {
        User user = getUserByEmail(email);
        if (user.getCart() != null) {
            user.getCart().removeIf(item -> item.getProductId().equals(productId));
            userRepository.save(user);
        }
    }

    public List<CartItem> getCart(String email) {
        User user = getUserByEmail(email);
        return user.getCart() == null ? new ArrayList<>() : user.getCart();
    }
    
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        user.setCart(new ArrayList<>());
        userRepository.save(user);
    }

    public BankDetails getBankDetails(String email) {
        User user = getUserByEmail(email);
        return user.getBankDetails();
    }

    public BankDetails updateBankDetails(String email, BankDetails bankDetails) {
        User user = getUserByEmail(email);
        user.setBankDetails(bankDetails);
        userRepository.save(user);
        return bankDetails;
    }
}
