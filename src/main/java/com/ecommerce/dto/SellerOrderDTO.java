package com.ecommerce.dto;

import java.util.Date;
import java.util.List;

public class SellerOrderDTO {
    private String orderId;
    private String customerEmail;
    private String shippingAddress;
    private String status;
    private Date createdAt;
    private Double orderTotal;

    private List<SellerOrderItemDTO> sellerItems;

    public SellerOrderDTO() {
    }

    public SellerOrderDTO(String orderId, String customerEmail, String shippingAddress, String status, Date createdAt, Double orderTotal, List<SellerOrderItemDTO> sellerItems) {
        this.orderId = orderId;
        this.customerEmail = customerEmail;
        this.shippingAddress = shippingAddress;
        this.status = status;
        this.createdAt = createdAt;
        this.orderTotal = orderTotal;
        this.sellerItems = sellerItems;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Double getOrderTotal() { return orderTotal; }
    public void setOrderTotal(Double orderTotal) { this.orderTotal = orderTotal; }

    public List<SellerOrderItemDTO> getSellerItems() { return sellerItems; }
    public void setSellerItems(List<SellerOrderItemDTO> sellerItems) { this.sellerItems = sellerItems; }

    public static class SellerOrderItemDTO {
        private String productId;
        private String productTitle;
        private int quantity;
        private Double priceAtPurchase;
        private Double subtotal;

        public SellerOrderItemDTO() {
        }

        public SellerOrderItemDTO(String productId, String productTitle, int quantity, Double priceAtPurchase, Double subtotal) {
            this.productId = productId;
            this.productTitle = productTitle;
            this.quantity = quantity;
            this.priceAtPurchase = priceAtPurchase;
            this.subtotal = subtotal;
        }

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getProductTitle() { return productTitle; }
        public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public Double getPriceAtPurchase() { return priceAtPurchase; }
        public void setPriceAtPurchase(Double priceAtPurchase) { this.priceAtPurchase = priceAtPurchase; }

        public Double getSubtotal() { return subtotal; }
        public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    }
}
