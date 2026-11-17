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
    private String Id;
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
}
