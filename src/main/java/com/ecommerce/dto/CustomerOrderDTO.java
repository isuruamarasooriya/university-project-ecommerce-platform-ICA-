package com.ecommerce.dto;

import java.util.Date;
import java.util.List;

public class CustomerOrderDTO {
    private String id;
    private List<CustomerOrderItemDTO> items;
    private Double totalAmount;
    private String shippingAddress;
    private String status;
    private Date createdAt;

    public CustomerOrderDTO() {}

    public CustomerOrderDTO(String id, List<CustomerOrderItemDTO> items, Double totalAmount, String shippingAddress, String status, Date createdAt) {
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public List<CustomerOrderItemDTO> getItems() { return items; }
    public void setItems(List<CustomerOrderItemDTO> items) { this.items = items; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public static class CustomerOrderItemDTO {
        private String productId;
        private String productTitle;
        private String productImage;
        private int quantity;
        private Double priceAtPurchase;
        private Double subtotal;

        public CustomerOrderItemDTO() {}

        public CustomerOrderItemDTO(String productId, String productTitle, String productImage, int quantity, Double priceAtPurchase, Double subtotal) {
            this.productId = productId;
            this.productTitle = productTitle;
            this.productImage = productImage;
            this.quantity = quantity;
            this.priceAtPurchase = priceAtPurchase;
            this.subtotal = subtotal;
        }

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getProductTitle() { return productTitle; }
        public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

        public String getProductImage() { return productImage; }
        public void setProductImage(String productImage) { this.productImage = productImage; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public Double getPriceAtPurchase() { return priceAtPurchase; }
        public void setPriceAtPurchase(Double priceAtPurchase) { this.priceAtPurchase = priceAtPurchase; }

        public Double getSubtotal() { return subtotal; }
        public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    }
}
