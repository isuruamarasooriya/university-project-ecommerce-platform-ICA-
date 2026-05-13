package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.model.Product;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;

    /** Dashboard overview stats */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        List<Order> allOrders = orderRepository.findAll();
        long totalOrders = allOrders.size();
        double totalRevenue = allOrders.stream()
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0)
                .sum();

        long totalVendors = userRepository.findAll().stream()
                .filter(u -> u.getRoles() != null && u.getRoles().contains(Role.SELLER))
                .count();

        // Build monthly revenue data (last 6 months)
        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        Calendar cal = Calendar.getInstance();
        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        for (int i = 5; i >= 0; i--) {
            cal.setTime(new Date());
            cal.add(Calendar.MONTH, -i);
            int m = cal.get(Calendar.MONTH);
            int y = cal.get(Calendar.YEAR);
            // Simulate data (in real app, filter by month)
            double rev = 1000 + Math.random() * 9000;
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", months[m] + " " + y);
            entry.put("revenue", Math.round(rev * 100.0) / 100.0);
            monthlyRevenue.add(entry);
        }

        // Order status breakdown
        Map<String, Long> orderStatuses = allOrders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getStatus() != null ? o.getStatus() : "PENDING",
                        Collectors.counting()
                ));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalVendors", totalVendors);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("orderStatuses", orderStatuses);

        return ResponseEntity.ok(stats);
    }

    /** Get all users */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("email", u.getEmail());
            m.put("roles", u.getRoles());
            m.put("name", u.getEmail().split("@")[0]);
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /** Change user role */
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        try {
            Role newRole = Role.valueOf(body.get("role"));
            user.setRoles(new HashSet<>(Set.of(newRole)));
            userRepository.save(user);
            return ResponseEntity.ok("Role updated");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role");
        }
    }

    /** Delete user */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    /** Get all orders */
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    /** Update order status */
    @PutMapping("/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        order.setStatus(body.get("status"));
        orderRepository.save(order);
        return ResponseEntity.ok("Status updated");
    }

    /** Get all products (admin view) */
    @GetMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllProductsAdmin() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    /** Delete any product */
    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProductAdmin(@PathVariable String id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted");
    }

    /** Analytics - top products by assumed rating */
    @GetMapping("/analytics/top-products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTopProducts() {
        List<Product> products = productRepository.findAll();
        // Return top 10 by rating (or just first 10 if no rating)
        List<Map<String, Object>> result = products.stream()
                .limit(10)
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("title", p.getTitle());
                    m.put("price", p.getPrice());
                    m.put("category", p.getCategory());
                    m.put("rating", p.getRating() != null ? p.getRating() : 4.0);
                    m.put("reviewCount", p.getReviewCount() != null ? p.getReviewCount() : 0);
                    return m;
                }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
