package com.ecommerce.dto;

import java.util.List;

public class ProductRequest {
    private String title;
    private String description;
    private Double price;
    private String category;
    private List<String> tags;
    private String imageUrl;
    private Integer stock;
    private Double discount;

    public ProductRequest() {}

    public ProductRequest(String title, String description, Double price, String category, List<String> tags, String imageUrl, Integer stock, Double discount) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.tags = tags;
        this.imageUrl = imageUrl;
        this.stock = stock;
        this.discount = discount;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }
}
