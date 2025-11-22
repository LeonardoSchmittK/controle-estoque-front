package com.controleestoquefront.models;

import java.math.BigDecimal;

public class Product {

    private Long id;
    private String name;
    private BigDecimal unitPrice;
    private String unit;
    private Integer stockQuantity;
    private Integer minQuantity;
    private Integer maxQuantity;
    private Category category;

    // Constructors
    public Product() {}

    public Product(Long id, String name, BigDecimal unitPrice, String unit,
                   Integer stockQuantity, Integer minQuantity, Integer maxQuantity,
                   Category category) {
        this.id = id;
        this.name = name;
        this.unitPrice = unitPrice;
        this.unit = unit;
        this.stockQuantity = stockQuantity;
        this.minQuantity = minQuantity;
        this.maxQuantity = maxQuantity;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Integer getMinQuantity() {
        return minQuantity;
    }

    public void setMinQuantity(Integer minQuantity) {
        this.minQuantity = minQuantity;
    }

    public Integer getMaxQuantity() {
        return maxQuantity;
    }

    public void setMaxQuantity(Integer maxQuantity) {
        this.maxQuantity = maxQuantity;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
