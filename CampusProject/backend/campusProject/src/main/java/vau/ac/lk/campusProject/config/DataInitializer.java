package vau.ac.lk.campusProject.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import vau.ac.lk.campusProject.model.Product;
import vau.ac.lk.campusProject.model.User;
import vau.ac.lk.campusProject.repository.ProductRepository;
import vau.ac.lk.campusProject.repository.UserRepository;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing products
        productRepository.deleteAll();

        // Clear existing users
        userRepository.deleteAll();

        // Create demo users
        User admin = new User(null, "admin@vexo.com", passwordEncoder.encode("admin123"), "ADMIN");
        User user = new User(null, "user@vexo.com", passwordEncoder.encode("user123"), "USER");
        userRepository.save(admin);
        userRepository.save(user);

        // Create sample products
        List<Product> products = Arrays.asList(
            new Product("VEXO Pro Lycra", 116.00, 
                "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop",
                "Winter", "Tops & Shirts", Arrays.asList("S", "M", "L", "XL"), "#0F1112",
                "High-performance lycra top for winter workouts", 50),
            
            new Product("VEXO Tech Top", 85.00,
                "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=1000&fit=crop",
                "Winter", "Tops & Shirts", Arrays.asList("M", "L", "XL"), "#C8D8DB",
                "Technical fabric top for optimal performance", 45),
            
            new Product("Performance Leggings", 92.00,
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop",
                "Winter", "Bottoms & Pants", Arrays.asList("S", "M", "L"), "#0F1112",
                "Comfortable leggings for all-day wear", 60),
            
            new Product("Thermal Shell", 145.00,
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop",
                "Winter", "Outerwear", Arrays.asList("M", "L", "XL", "XXL"), "#7B8A8D",
                "Insulated thermal shell for cold weather training", 30),
            
            new Product("Aero Joggers", 105.00,
                "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=1000&fit=crop",
                "Winter", "Bottoms & Pants", Arrays.asList("S", "M", "L", "XL"), "#0F1112",
                "Lightweight joggers with aerodynamic design", 55),
            
            new Product("Core Base Layer", 65.00,
                "https://images.unsplash.com/photo-1522898467493-49726bf28798?w=800&h=1000&fit=crop",
                "Winter", "Compression", Arrays.asList("S", "M", "L"), "#D9D9D9",
                "Essential base layer for core warmth", 70),
            
            new Product("Elite Shorts", 55.00,
                "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=1000&fit=crop",
                "Winter", "Bottoms & Pants", Arrays.asList("M", "L", "XL"), "#0F1112",
                "Premium athletic shorts for intense workouts", 80),
            
            new Product("Hybrid Jacket", 185.00,
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop",
                "Winter", "Outerwear", Arrays.asList("M", "L", "XL", "XXL"), "#5A3E36",
                "Versatile hybrid jacket for all conditions", 40),
            
            new Product("Performance Gear 9", 128.00,
                "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop",
                "New", "Tops & Shirts", Arrays.asList("S", "M", "L"), "#212A3E",
                "Latest performance gear technology", 35),
            
            new Product("Performance Gear 10", 140.00,
                "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=1000&fit=crop",
                "Top Rated", "Compression", Arrays.asList("M", "L", "XL"), "#0F1112",
                "Top-rated compression wear", 50),
            
            new Product("Performance Gear 11", 152.00,
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop",
                "Winter", "Accessories", Arrays.asList("One Size"), "#C8D8DB",
                "Essential workout accessories", 100),
            
            new Product("Performance Gear 12", 164.00,
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop",
                "New", "Outerwear", Arrays.asList("L", "XL", "XXL"), "#7B8A8D",
                "New arrival outerwear collection", 25)
        );

        productRepository.saveAll(products);
        System.out.println("Sample products initialized: " + products.size() + " products added.");
    }
}

