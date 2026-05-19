package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String email;

    private String password;

    private Set<Role> roles;

    private Set<String> wishlist = new HashSet<>();

    private List<CartItem> cart = new ArrayList<>();

    private BankDetails bankDetails;

    private boolean twoFactorEnabled = false;

    public User() {}

    public boolean isTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    public User(String id, String email, String password, Set<Role> roles, Set<String> wishlist, List<CartItem> cart, BankDetails bankDetails) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.wishlist = wishlist != null ? wishlist : new HashSet<>();
        this.cart = cart != null ? cart : new ArrayList<>();
        this.bankDetails = bankDetails;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    public Set<String> getWishlist() { return wishlist; }
    public void setWishlist(Set<String> wishlist) { this.wishlist = wishlist; }

    public List<CartItem> getCart() { return cart; }
    public void setCart(List<CartItem> cart) { this.cart = cart; }

    public BankDetails getBankDetails() { return bankDetails; }
    public void setBankDetails(BankDetails bankDetails) { this.bankDetails = bankDetails; }
}
