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
public class OrderDetail {
    @Id
    private String orderId;

    private LocalDateTime pickUpTime;
    private LocalDateTime returnUpTime;
    private String pickupLocation;

    private String carName;
    private String carCompany;
    private double carPrice;
    private double carRating;
    private String carType;
    private int seats;

    private String carOwner;
    private String carUser;
    private boolean isBooked;
}
