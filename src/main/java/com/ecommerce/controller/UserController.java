package com.ecommerce.controller;

import com.ecommerce.model.BankDetails;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/wishlist")
    public ResponseEntity<List<Product>> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(userService.getWishlistProducts(authentication.getName()));
    }

    @PostMapping("/wishlist/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable String productId, Authentication authentication) {
        userService.addToWishlist(authentication.getName(), productId);
        return ResponseEntity.ok("Added to wishlist");
    }

    @DeleteMapping("/wishlist/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable String productId, Authentication authentication) {
        userService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.ok("Removed from wishlist");
    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        return ResponseEntity.ok(userService.getCart(authentication.getName()));
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody CartItem cartItem, Authentication authentication) {
        userService.addToCart(authentication.getName(), cartItem.getProductId(), cartItem.getQuantity());
        return ResponseEntity.ok("Added to cart");
    }

    @DeleteMapping("/cart/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable String productId, Authentication authentication) {
        userService.removeFromCart(authentication.getName(), productId);
        return ResponseEntity.ok("Removed from cart");
    }

    @GetMapping("/bank-details")
    public ResponseEntity<BankDetails> getBankDetails(Authentication authentication) {
        return ResponseEntity.ok(userService.getBankDetails(authentication.getName()));
    }

    @PutMapping("/bank-details")
    public ResponseEntity<BankDetails> updateBankDetails(@RequestBody BankDetails bankDetails, Authentication authentication) {
        return ResponseEntity.ok(userService.updateBankDetails(authentication.getName(), bankDetails));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody com.ecommerce.dto.ChangePasswordRequest request, Authentication authentication) {
        try {
            userService.changePassword(authentication.getName(), request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/2fa")
    public ResponseEntity<Boolean> getTwoFactor(Authentication authentication) {
        return ResponseEntity.ok(userService.getTwoFactorEnabled(authentication.getName()));
    }

    @PutMapping("/2fa")
    public ResponseEntity<Boolean> updateTwoFactor(@RequestParam boolean enabled, Authentication authentication) {
        userService.setTwoFactorEnabled(authentication.getName(), enabled);
        return ResponseEntity.ok(enabled);
    }
}
