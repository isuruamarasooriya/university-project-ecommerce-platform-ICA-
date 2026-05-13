package vau.ac.lk.campusProject.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "products")
public class Product {
    
    @Id
    private String id;
    private String name;
    private Double price;
    private String image;
    private String tag;
    private String category;
    private List<String> sizes;
    private String color;
    private String description;
    private Integer stock;

    // Constructors
    public Product() {}

    public Product(String name, Double price, String image, String tag, String category, 
                   List<String> sizes, String color, String description, Integer stock) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.tag = tag;
        this.category = category;
        this.sizes = sizes;
        this.color = color;
        this.description = description;
        this.stock = stock;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getSizes() { return sizes; }
    public void setSizes(List<String> sizes) { this.sizes = sizes; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
