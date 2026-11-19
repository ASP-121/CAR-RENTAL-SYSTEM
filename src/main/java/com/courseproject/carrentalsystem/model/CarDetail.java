package com.courseproject.carrentalsystem.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarDetail {

    @Id
    private String id;
    private String name;
    private String company;
    private double price;
    private double rating;
    private String type;
    private int seats;
    private String range;
    private String acceleration;
    private String fuelType;
    private String imageUrl;
    private String ownerEmail; // Email of the user who listed the car

    public CarDetail(String id, String name, String company, double price, double rating,
                     String type, int seats, String range, String acceleration,
                     String fuelType, String imageUrl) {
        this.id = id;
        this.name = name;
        this.company = company;
        this.price = price;
        this.rating = rating;
        this.type = type;
        this.seats = seats;
        this.range = range;
        this.acceleration = acceleration;
        this.fuelType = fuelType;
        this.imageUrl = imageUrl;
        this.ownerEmail = "akash2006@gmail.com";
    }
}
