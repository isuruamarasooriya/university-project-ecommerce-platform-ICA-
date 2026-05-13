package vau.ac.lk.campusProject.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import vau.ac.lk.campusProject.model.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}