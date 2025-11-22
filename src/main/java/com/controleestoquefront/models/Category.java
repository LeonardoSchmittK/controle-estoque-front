package com.controleestoquefront.models;


public class Category {

    private Long id;
    private String name;
    private Size size;
    private Packaging packaging;

    // Constructors
    public Category() {}

    public Category(Long id, String name, Size size, Packaging packaging) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.packaging = packaging;
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

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Packaging getPackaging() {
        return packaging;
    }

    public void setPackaging(Packaging packaging) {
        this.packaging = packaging;
    }
}
