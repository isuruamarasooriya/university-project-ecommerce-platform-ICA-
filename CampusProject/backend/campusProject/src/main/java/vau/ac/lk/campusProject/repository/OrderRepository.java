package vau.ac.lk.campusProject.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import vau.ac.lk.campusProject.model.Order;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByEmail(String email);
    List<Order> findByStatus(String status);
}
