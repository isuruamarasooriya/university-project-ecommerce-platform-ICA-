package vau.ac.lk.campusProject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.campusProject.model.User;
import vau.ac.lk.campusProject.repository.UserRepository;
import vau.ac.lk.campusProject.util.JwtUtil;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        User user = optionalUser.orElse(null);
        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(new AuthResponse(token, user));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest signupRequest) {
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());
        User user = new User(null, signupRequest.getEmail(), encodedPassword, signupRequest.getRole());
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class SignupRequest {
        private String email;
        private String password;
        private String role;

        public SignupRequest() {}

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class AuthResponse {
        private String token;
        private User user;

        public AuthResponse(String token, User user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }
    }
}