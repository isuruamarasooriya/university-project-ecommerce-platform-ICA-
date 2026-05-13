package vau.ac.lk.campusProject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vau.ac.lk.campusProject.model.Order;
import vau.ac.lk.campusProject.repository.OrderRepository;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByEmail(email);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(String id, String status) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}
