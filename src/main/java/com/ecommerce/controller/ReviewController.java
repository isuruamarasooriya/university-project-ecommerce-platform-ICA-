package com.ecommerce.controller;

import com.ecommerce.model.Review;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Review review, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userService.getUserByEmail(authentication.getName());
        review.setCustomerId(user.getId());
        review.setCustomerEmail(user.getEmail());

        Review savedReview = reviewRepository.save(review);

        // Recalculate average rating & review count for the product dynamically!
        Product product = productRepository.findById(review.getProductId()).orElse(null);
        if (product != null) {
            List<Review> productReviews = reviewRepository.findByProductId(review.getProductId());
            double totalRating = productReviews.stream().mapToDouble(Review::getRating).sum();
            double avgRating = totalRating / productReviews.size();
            
            product.setRating(avgRating);
            product.setReviewCount(productReviews.size());
            productRepository.save(product);
        }

        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(reviewRepository.findByProductId(productId));
    }
}
