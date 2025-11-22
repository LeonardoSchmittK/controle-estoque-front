package com.controleestoquefront.models;
import java.time.LocalDateTime;

public class Movement {

    public enum TypeMovement {
        ENTRY,
        EXIT
    }

    private Long id;
    private Product product;
    private LocalDateTime date;
    private Integer quantity;
    private TypeMovement type;

    // Constructors
    public Movement() {}

    public Movement(Long id, Product product, LocalDateTime date, Integer quantity, TypeMovement type) {
        this.id = id;
        this.product = product;
        this.date = date;
        this.quantity = quantity;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public TypeMovement getType() {
        return type;
    }

    public void setType(TypeMovement type) {
        this.type = type;
    }
}
