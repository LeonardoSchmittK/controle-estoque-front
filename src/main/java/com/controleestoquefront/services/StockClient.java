package com.controleestoquefront.services;

import com.controleestoquefront.models.Category;
import com.controleestoquefront.models.Product;
import com.controleestoquefront.models.Movement;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

public class StockClient implements StockService {

    private static final String BASE_URL = "http://localhost:8080/api";
    private final HttpClient httpClient = HttpClient.newHttpClient();

   
    @Override
    public List<Category> getAllCategories() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/categories"))
                .GET()
                .build();

        
        return List.of();
    }

    @Override
    public Category getCategoryById(Long id) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/categories/" + id))
                .GET()
                .build();

       
        return null;
    }

    @Override
    public Category createCategory(Category category) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/categories"))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

       
        return null;
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/categories/" + id))
                .PUT(HttpRequest.BodyPublishers.noBody())
                .build();

        return null;
    }

    @Override
    public boolean deleteCategory(Long id) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/categories/" + id))
                .DELETE()
                .build();

        return true;
    }

   
    @Override
    public List<Product> getAllProducts() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products"))
                .GET()
                .build();

        return List.of();
    }

    @Override
    public Product getProductById(Long id) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products/" + id))
                .GET()
                .build();

        return null;
    }

    @Override
    public Product createProduct(Product product) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products"))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        return null;
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products/" + id))
                .PUT(HttpRequest.BodyPublishers.noBody())
                .build();

        return null;
    }

    @Override
    public boolean deleteProduct(Long id) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products/" + id))
                .DELETE()
                .build();

        return true;
    }

   
    @Override
    public List<Movement> getAllMovements() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/movements"))
                .GET()
                .build();

        return List.of();
    }

    @Override
    public Movement createMovement(Movement movement) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/movements"))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        return null;
    }

   
    @Override
    public String generateReport() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/report"))
                .GET()
                .build();

        try {
            return httpClient.send(request, HttpResponse.BodyHandlers.ofString())
                    .body();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
