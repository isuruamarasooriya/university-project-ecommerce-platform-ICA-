package com.ecommerce.model;

public class OrderItem {
    private String productId;
    private String sellerId;
    private int quantity;
    private Double priceAtPurchase;

    public OrderItem() {}

    public OrderItem(String productId, String sellerId, int quantity, Double priceAtPurchase) {
        this.productId = productId;
        this.sellerId = sellerId;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Double getPriceAtPurchase() { return priceAtPurchase; }
    public void setPriceAtPurchase(Double priceAtPurchase) { this.priceAtPurchase = priceAtPurchase; }
}
