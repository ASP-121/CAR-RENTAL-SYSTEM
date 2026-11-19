package com.courseproject.carrentalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DynamicPriceResponse {
    private String carName;
    private double baseDailyRate;
    private double effectiveDailyRate;
    private double multiplier;
    private int rentalDays;
    private double baseSubtotal;
    private double tax; // 18% GST
    private double grandTotal;
    private String surgeType; // "WEEKEND_PEAK", "HIGH_DEMAND", "OFF_PEAK_SAVER", "LONG_TRIP_DEAL", "STANDARD"
    private String surgeMessage;
    private int activeFleetBookings;
}
