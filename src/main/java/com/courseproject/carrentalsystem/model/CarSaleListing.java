package com.courseproject.carrentalsystem.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarSaleListing {
    @Id
    private String id;
    private String carName;
    private String company;
    private int year;
    private int kmDriven;
    private double sellingPrice; // In INR (₹)
    private String fuelType;
    private String transmission; // "Automatic", "Manual"
    private String ownerType; // "1st Owner", "2nd Owner"
    private String city;
    private String sellerEmail;
    private String sellerName;
    private String sellerPhone;
    private String imageUrl;
    private String description;
    private String status; // "AVAILABLE", "UNDER_OFFER", "SOLD"
    private LocalDateTime createdAt;
}
