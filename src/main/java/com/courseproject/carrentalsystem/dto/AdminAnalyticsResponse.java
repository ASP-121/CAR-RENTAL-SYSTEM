package com.courseproject.carrentalsystem.dto;

import com.courseproject.carrentalsystem.model.OrderDetail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminAnalyticsResponse {
    private double grossRevenue;
    private int totalBookings;
    private int activeTrips;
    private int totalCars;
    private double utilizationRate;
    private double averageRating;
    private List<OrderDetail> recentOrders;
}
