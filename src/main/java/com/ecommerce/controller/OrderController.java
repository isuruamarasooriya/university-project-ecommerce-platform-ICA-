package com.ecommerce.controller;

import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.SellerOrderDTO;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request, Authentication authentication) {
        try {
            Order order = orderService.checkout(request, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/myorders")
    public ResponseEntity<List<com.ecommerce.dto.CustomerOrderDTO>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getCustomerOrders(authentication.getName()));
    }

    @GetMapping("/seller-orders")
    public ResponseEntity<List<SellerOrderDTO>> getSellerOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getSellerOrders(authentication.getName()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String id, Authentication authentication) {
        try {
            Order order = orderService.cancelOrder(id, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestParam String status, Authentication authentication) {
        try {
            Order order = orderService.updateOrderStatus(id, status, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
