package com.ecommerce.service;

import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.SellerOrderDTO;
import com.ecommerce.model.*;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Order checkout(CheckoutRequest request, String email) {
        User user = userService.getUserByEmail(email);
        List<CartItem> cart = user.getCart();

        if (cart == null || cart.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (CartItem cartItem : cart) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setSellerId(product.getSellerId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            
            orderItems.add(orderItem);
            totalAmount += product.getPrice() * cartItem.getQuantity();
        }

        Order order = new Order();
        order.setCustomerId(user.getId());
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("PENDING");
        order.setCreatedAt(new Date());

        Order savedOrder = orderRepository.save(order);
        
        userService.clearCart(email);

        return savedOrder;
    }

    public List<com.ecommerce.dto.CustomerOrderDTO> getCustomerOrders(String email) {
        User user = userService.getUserByEmail(email);
        List<Order> orders = orderRepository.findByCustomerId(user.getId());

        return orders.stream().map(order -> {
            List<com.ecommerce.dto.CustomerOrderDTO.CustomerOrderItemDTO> items = order.getItems().stream().map(item -> {
                Product product = productRepository.findById(item.getProductId()).orElse(null);
                String title = (product != null) ? product.getTitle() : "Unknown Product";
                String image = (product != null) ? product.getImageUrl() : "";
                
                return new com.ecommerce.dto.CustomerOrderDTO.CustomerOrderItemDTO(
                    item.getProductId(),
                    title,
                    image,
                    item.getQuantity(),
                    item.getPriceAtPurchase(),
                    item.getQuantity() * item.getPriceAtPurchase()
                );
            }).collect(Collectors.toList());

            return new com.ecommerce.dto.CustomerOrderDTO(
                order.getId(),
                items,
                order.getTotalAmount(),
                order.getShippingAddress(),
                order.getStatus(),
                order.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    public List<SellerOrderDTO> getSellerOrders(String sellerEmail) {
        User seller = userService.getUserByEmail(sellerEmail);
        String sellerId = seller.getId();

        List<Order> orders = orderRepository.findByItemsSellerId(sellerId);

        return orders.stream().map(order -> {
            // Only include items belonging to this seller
            List<SellerOrderDTO.SellerOrderItemDTO> sellerItems = order.getItems().stream()
                .filter(item -> sellerId.equals(item.getSellerId()))
                .map(item -> {
                    String productTitle = productRepository.findById(item.getProductId())
                        .map(Product::getTitle).orElse("Unknown Product");
                    SellerOrderDTO.SellerOrderItemDTO dto = new SellerOrderDTO.SellerOrderItemDTO();
                    dto.setProductId(item.getProductId());
                    dto.setProductTitle(productTitle);
                    dto.setQuantity(item.getQuantity());
                    dto.setPriceAtPurchase(item.getPriceAtPurchase());
                    dto.setSubtotal(item.getPriceAtPurchase() * item.getQuantity());
                    return dto;
                })
                .collect(Collectors.toList());

            // Resolve customer email
            String customerEmail = userRepository.findById(order.getCustomerId())
                .map(User::getEmail).orElse("Unknown");

            double sellerTotal = sellerItems.stream().mapToDouble(SellerOrderDTO.SellerOrderItemDTO::getSubtotal).sum();

            SellerOrderDTO dto = new SellerOrderDTO();
            dto.setOrderId(order.getId());
            dto.setCustomerEmail(customerEmail);
            dto.setShippingAddress(order.getShippingAddress());
            dto.setStatus(order.getStatus());
            dto.setCreatedAt(order.getCreatedAt());
            dto.setOrderTotal(sellerTotal);
            dto.setSellerItems(sellerItems);
            return dto;
        }).collect(Collectors.toList());
    }

    public Order cancelOrder(String orderId, String customerEmail) {
        User user = userService.getUserByEmail(customerEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomerId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this order");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Cannot cancel an order that is already: " + order.getStatus());
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(String orderId, String status, String sellerEmail) {
        User seller = userService.getUserByEmail(sellerEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify that the seller owns at least one item in the order
        boolean ownsItem = order.getItems().stream()
                .anyMatch(item -> seller.getId().equals(item.getSellerId()));

        if (!ownsItem) {
            throw new RuntimeException("Unauthorized: You do not own any items in this order");
        }

        order.setStatus(status);
        return orderRepository.save(order);
    }
}
