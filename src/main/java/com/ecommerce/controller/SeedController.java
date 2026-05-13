package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class SeedController {

    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/seed")
    public ResponseEntity<?> seedData() {
        // Ensure admin user exists
        if (userRepository.findByEmail("admin@multivendor.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@multivendor.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRoles(new HashSet<>(Set.of(Role.ADMIN)));
            userRepository.save(admin);
        }

        // Ensure a demo seller exists
        User seller;
        Optional<User> sellerOpt = userRepository.findByEmail("seller@multivendor.com");
        if (sellerOpt.isEmpty()) {
            seller = new User();
            seller.setEmail("seller@multivendor.com");
            seller.setPassword(passwordEncoder.encode("Seller@123"));
            seller.setRoles(new HashSet<>(Set.of(Role.SELLER)));
            seller = userRepository.save(seller);
        } else {
            seller = sellerOpt.get();
        }

        String sid = seller.getId();
        productRepository.deleteAll(); // clear existing before seed

        List<Product> products = new ArrayList<>();

        // ── ELECTRONICS ─────────────────────────────────────────────────────────
        products.add(make("Apple iPhone 15 Pro", "The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system with 48MP main sensor.", 999.99, "Electronics", "Apple", 4.8, 1342, 85, 0, sid, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80", List.of("smartphone","apple","5g","titanium")));
        products.add(make("Samsung Galaxy S25 Ultra", "Galaxy AI unleashed. 200MP camera, S Pen included, Snapdragon 8 Elite processor, 12GB RAM.", 1199.99, "Electronics", "Samsung", 4.7, 987, 62, 5, sid, "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80", List.of("samsung","android","5g","stylus")));
        products.add(make("Sony WH-1000XM5 Headphones", "Industry-leading noise cancellation with 30hr battery. Comfortable design for all-day wear.", 349.99, "Electronics", "Sony", 4.9, 2156, 140, 15, sid, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", List.of("headphones","noise-cancelling","wireless","sony")));
        products.add(make("Apple MacBook Air M3", "Supercharged by M3 chip. Up to 18 hours battery. Fanless design. Stunning Liquid Retina display.", 1299.99, "Electronics", "Apple", 4.8, 876, 45, 0, sid, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80", List.of("laptop","apple","m3","macbook")));
        products.add(make("Dell XPS 15 Laptop", "OLED display, Intel Core i9, 32GB RAM, NVIDIA RTX 4070. Premium build for power users.", 1899.99, "Electronics", "Dell", 4.6, 543, 30, 10, sid, "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", List.of("laptop","dell","oled","gaming")));
        products.add(make("Apple iPad Pro 13\"", "M4 chip with Ultra Retina XDR display. Compatible with Apple Pencil Pro.", 1099.99, "Electronics", "Apple", 4.7, 721, 55, 0, sid, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80", List.of("tablet","apple","m4","ipad")));
        products.add(make("Samsung Galaxy Watch 7", "Advanced health monitoring with AI energy score. Titanium case, 3-day battery life.", 299.99, "Electronics", "Samsung", 4.5, 432, 90, 10, sid, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", List.of("smartwatch","samsung","health","wearable")));
        products.add(make("Apple AirPods Pro 2", "Active Noise Cancellation, Transparency mode, Adaptive Audio. USB-C charging case.", 249.99, "Electronics", "Apple", 4.8, 1876, 200, 0, sid, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80", List.of("earbuds","apple","anc","wireless")));
        products.add(make("Sony PlayStation 5 Controller", "DualSense wireless controller with haptic feedback and adaptive triggers.", 69.99, "Electronics", "Sony", 4.7, 3210, 350, 0, sid, "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80", List.of("gaming","ps5","controller","sony")));
        products.add(make("ASUS ROG RTX 4090 GPU", "Ada Lovelace architecture. 24GB GDDR6X. 4K/8K gaming powerhouse.", 1599.99, "Electronics", "ASUS", 4.9, 234, 12, 5, sid, "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80", List.of("gpu","gaming","4k","rtx")));
        products.add(make("Kindle Paperwhite 2024", "300 PPI display, 3-month battery, IPX8 waterproof. The ultimate e-reader.", 139.99, "Electronics", "Amazon", 4.6, 2341, 180, 0, sid, "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80", List.of("ereader","kindle","amazon","reading")));
        products.add(make("GoPro HERO12 Black", "5.3K video, HyperSmooth 6.0, unlimited cloud backup. Waterproof to 33ft.", 399.99, "Electronics", "GoPro", 4.5, 876, 65, 10, sid, "https://images.unsplash.com/photo-1553246969-4f0c11ed2f72?w=600&q=80", List.of("camera","action","waterproof","4k")));
        products.add(make("Canon EOS R50 Mirrorless", "24.2MP APS-C sensor, 4K video, RF lens mount. Perfect for content creators.", 679.99, "Electronics", "Canon", 4.6, 543, 40, 5, sid, "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", List.of("camera","canon","mirrorless","photography")));
        products.add(make("LG OLED 65\" 4K TV", "Evo OLED panel with α9 AI Processor. Dolby Vision IQ, webOS Smart TV.", 1799.99, "Electronics", "LG", 4.8, 432, 18, 12, sid, "https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=600&q=80", List.of("tv","oled","4k","smart")));
        products.add(make("Arduino Mega 2560 Kit", "Complete starter kit with 65 components, breadboard, jumper wires, and detailed project guide.", 49.99, "Electronics", "Arduino", 4.7, 1234, 250, 0, sid, "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&q=80", List.of("arduino","diy","electronics","maker")));

        // ── FASHION ──────────────────────────────────────────────────────────────
        products.add(make("Nike Air Max 270", "Air unit delivers unrivaled, all-day comfort. Breathable mesh upper with foam midsole.", 149.99, "Fashion", "Nike", 4.6, 2345, 320, 10, sid, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", List.of("shoes","nike","running","airmax")));
        products.add(make("Adidas Ultraboost 23", "Responsive Boost cushioning with Primeknit+ upper. Continental rubber outsole.", 189.99, "Fashion", "Adidas", 4.7, 1876, 210, 15, sid, "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80", List.of("shoes","adidas","running","boost")));
        products.add(make("Levi's 501 Original Jeans", "The original blue jean since 1873. Straight leg, button fly, 100% cotton denim.", 69.99, "Fashion", "Levi's", 4.5, 4321, 450, 0, sid, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", List.of("jeans","denim","levis","classic")));
        products.add(make("Ray-Ban Wayfarer Sunglasses", "Iconic square frame sunglasses. UV400 protection, acetate frame, crystal lenses.", 154.99, "Fashion", "Ray-Ban", 4.6, 1543, 180, 0, sid, "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80", List.of("sunglasses","rayban","uv","fashion")));
        products.add(make("Nike Tech Fleece Hoodie", "Engineered for warmth without bulk. Double-faced fleece, kangaroo pocket.", 89.99, "Fashion", "Nike", 4.5, 987, 280, 0, sid, "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", List.of("hoodie","nike","fleece","sportswear")));
        products.add(make("Zara Oversized Blazer", "Contemporary oversized cut in premium woven fabric. Double-breasted front.", 79.99, "Fashion", "Zara", 4.3, 765, 150, 20, sid, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", List.of("blazer","zara","formal","fashion")));
        products.add(make("Rolex Submariner Watch", "Iconic diver's watch. 300m waterproof, rotating bezel, COSC certified movement.", 9999.99, "Fashion", "Rolex", 5.0, 234, 3, 0, sid, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", List.of("watch","rolex","luxury","diver")));
        products.add(make("Timberland 6\" Premium Boots", "Waterproof full-grain leather. Seam-sealed construction. Anti-fatigue comfort footbed.", 199.99, "Fashion", "Timberland", 4.6, 1234, 190, 10, sid, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", List.of("boots","timberland","waterproof","hiking")));
        products.add(make("Ralph Lauren Polo Shirt", "Classic fit pique polo. Signature embroidered pony. 100% cotton.", 89.99, "Fashion", "Ralph Lauren", 4.4, 2109, 400, 0, sid, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", List.of("polo","shirt","ralphlauren","classic")));
        products.add(make("Coach Leather Shoulder Bag", "Pebble leather with signature hardware. Adjustable strap, interior zip pocket.", 295.99, "Fashion", "Coach", 4.5, 654, 75, 0, sid, "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", List.of("bag","coach","leather","luxury")));
        products.add(make("Silk Floral Maxi Dress", "100% silk charmeuse. Hand-painted floral print. Midi length with adjustable straps.", 129.99, "Fashion", "H&M Premium", 4.3, 432, 90, 25, sid, "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80", List.of("dress","silk","floral","women")));
        products.add(make("Leather Biker Jacket", "Genuine lambskin leather. Asymmetric zip closure, quilted shoulder panels.", 299.99, "Fashion", "AllSaints", 4.7, 876, 55, 10, sid, "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&q=80", List.of("jacket","leather","biker","style")));

        // ── HOME ─────────────────────────────────────────────────────────────────
        products.add(make("Dyson V15 Detect Vacuum", "Laser reveals hidden dust. HEPA filtration. 60min run time. LCD screen shows live counts.", 749.99, "Home", "Dyson", 4.8, 1432, 85, 10, sid, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", List.of("vacuum","dyson","cordless","hepa")));
        products.add(make("Philips XXL Air Fryer", "7L capacity for family of 6. Rapid Air technology. 80% less fat. 16 presets.", 199.99, "Home", "Philips", 4.6, 2134, 210, 5, sid, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", List.of("airfryer","philips","kitchen","healthy")));
        products.add(make("IKEA BEKANT Standing Desk", "Electric height adjustment. Memory function for 4 settings. 160x80cm surface.", 449.99, "Home", "IKEA", 4.4, 876, 40, 0, sid, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", List.of("desk","standing","ikea","ergonomic")));
        products.add(make("Nespresso Vertuo Pop Machine", "Centrifusion technology for perfect espresso. Barcode recognition. 4 cup sizes.", 99.99, "Home", "Nespresso", 4.7, 1876, 320, 20, sid, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", List.of("coffee","nespresso","espresso","kitchen")));
        products.add(make("iRobot Roomba j9+ Robot Vacuum", "PrecisionVision Navigation avoids obstacles. Auto-emptying base. Learn cleaning habits.", 799.99, "Home", "iRobot", 4.6, 654, 35, 15, sid, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", List.of("robot","vacuum","irobot","smart")));
        products.add(make("Dyson Pure Hot+Cool Fan", "HEPA + activated carbon filtration. Heats in winter, cools in summer. App controlled.", 549.99, "Home", "Dyson", 4.7, 543, 60, 0, sid, "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80", List.of("fan","dyson","purifier","hepa")));
        products.add(make("Herman Miller Aeron Chair", "PostureFit SL back support. 8Z Pellicle suspension. Fully adjustable. 12-year warranty.", 1395.99, "Home", "Herman Miller", 4.9, 432, 20, 0, sid, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", List.of("chair","ergonomic","office","herman miller")));
        products.add(make("KitchenAid Stand Mixer", "5.5L bowl, 10 speeds, 59 touchpoints per rotation. Planetary mixing action.", 399.99, "Home", "KitchenAid", 4.8, 2341, 95, 10, sid, "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", List.of("mixer","kitchenaid","baking","kitchen")));
        products.add(make("Vitamix A3500 Blender", "5 program settings, self-cleaning, 2.2HP motor, 64oz container. Smart nutritional lab.", 549.99, "Home", "Vitamix", 4.7, 1234, 75, 5, sid, "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=600&q=80", List.of("blender","vitamix","smoothie","kitchen")));
        products.add(make("Philips Hue Smart Light Kit", "4 A19 bulbs + Bridge. 16 million colors, voice & app control, sets the mood.", 199.99, "Home", "Philips", 4.5, 1543, 150, 10, sid, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", List.of("smart","lights","philips","hue")));

        // ── BOOKS ────────────────────────────────────────────────────────────────
        products.add(make("Clean Code by Robert C. Martin", "A handbook of agile software craftsmanship. Learn to write clean, readable, maintainable code.", 34.99, "Books", "Prentice Hall", 4.7, 5432, 500, 0, sid, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", List.of("programming","java","clean code","software")));
        products.add(make("Design Patterns: GoF", "Seminal book on object-oriented design patterns. 23 patterns with real-world examples.", 44.99, "Books", "Addison-Wesley", 4.6, 3210, 350, 5, sid, "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80", List.of("patterns","oop","software","architecture")));
        products.add(make("Atomic Habits by James Clear", "Tiny changes, remarkable results. The definitive guide to building good habits.", 24.99, "Books", "Avery", 4.9, 12543, 1000, 10, sid, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80", List.of("habits","productivity","self-help","psychology")));
        products.add(make("The Pragmatic Programmer", "Your journey to mastery. 20th Anniversary Edition. Timeless lessons for modern developers.", 39.99, "Books", "Pragmatic Bookshelf", 4.8, 4321, 420, 0, sid, "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&q=80", List.of("programming","career","software","pragmatic")));
        products.add(make("Zero to One by Peter Thiel", "Notes on startups and how to build the future. Essential reading for entrepreneurs.", 19.99, "Books", "Crown Business", 4.5, 7654, 800, 0, sid, "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", List.of("startup","business","entrepreneurship","thiel")));

        // ── TOYS ─────────────────────────────────────────────────────────────────
        products.add(make("LEGO Star Wars Millennium Falcon", "7541-piece Ultimate Collector Series. Highly detailed cockpit, quad laser cannons.", 849.99, "Toys", "LEGO", 4.9, 2134, 45, 0, sid, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", List.of("lego","starwars","collectible","building")));
        products.add(make("Hot Wheels Ultimate Garage", "5-foot tall, 140+ car capacity, motorized elevator, giant loop, car launcher.", 129.99, "Toys", "Hot Wheels", 4.6, 1234, 85, 10, sid, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80", List.of("hotwheels","cars","garage","play")));
        products.add(make("Speed Cube 3x3 Competition", "Magnetic positioning, dual-adjustment system. WCA competition legal. GAN 13 Maglev.", 49.99, "Toys", "GAN", 4.8, 3421, 400, 5, sid, "https://images.unsplash.com/photo-1591400581-06c75e4f6d3e?w=600&q=80", List.of("rubiks","cube","speedcube","puzzle")));
        products.add(make("Jenga Giant Premium Set", "Stacks to over 5 feet. 54 hardwood blocks, carry bag included. Perfect for parties.", 64.99, "Toys", "Jenga", 4.5, 2109, 175, 0, sid, "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=600&q=80", List.of("jenga","party","family","game")));
        products.add(make("Monopoly Classic Board Game", "The world's favorite real estate trading game. 2-6 players, 8 classic tokens.", 29.99, "Toys", "Hasbro", 4.4, 8765, 600, 0, sid, "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=600&q=80", List.of("monopoly","boardgame","family","classic")));

        productRepository.saveAll(products);
        return ResponseEntity.ok(Map.of(
            "message", "Seed completed successfully",
            "productsAdded", products.size(),
            "adminEmail", "admin@multivendor.com",
            "adminPassword", "Admin@123"
        ));
    }

    private Product make(String title, String desc, double price, String cat, String brand,
                         double rating, int reviews, int stock, double discount,
                         String sellerId, String imageUrl, List<String> tags) {
        Product p = new Product();
        p.setTitle(title);
        p.setDescription(desc);
        p.setPrice(price);
        p.setCategory(cat);
        p.setBrand(brand);
        p.setRating(rating);
        p.setReviewCount(reviews);
        p.setStock(stock);
        p.setDiscount(discount);
        p.setSellerId(sellerId);
        p.setImageUrl(imageUrl);
        p.setImages(List.of(imageUrl));
        p.setTags(tags);
        return p;
    }
}
