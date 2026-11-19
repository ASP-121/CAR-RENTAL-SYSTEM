package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.dto.DynamicPriceResponse;
import com.courseproject.carrentalsystem.model.CarDetail;
import com.courseproject.carrentalsystem.model.OrderDetail;
import com.courseproject.carrentalsystem.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DynamicPricingService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CarRentalService carRentalService;

    public DynamicPriceResponse calculatePrice(String carName, LocalDateTime pickUpTime, LocalDateTime returnUpTime) {
        double baseRate = 3499.0;
        Optional<CarDetail> carOpt = carRentalService.getCarByName(carName);
        if (carOpt.isPresent() && carOpt.get().getPrice() > 0) {
            baseRate = carOpt.get().getPrice();
        }

        if (pickUpTime == null || returnUpTime == null || returnUpTime.isBefore(pickUpTime)) {
            return new DynamicPriceResponse(
                    carName, baseRate, baseRate, 1.0, 1,
                    baseRate, Math.round(baseRate * 0.18), Math.round(baseRate * 1.18),
                    "STANDARD", "Standard base rate applied", 0
            );
        }

        long hours = Duration.between(pickUpTime, returnUpTime).toHours();
        int days = (int) Math.ceil((double) hours / 24.0);
        if (days < 1) days = 1;

        // 1. Check Weekend Days in the Interval (Friday, Saturday, Sunday)
        boolean hasWeekend = false;
        LocalDateTime cursor = pickUpTime;
        while (!cursor.isAfter(returnUpTime)) {
            DayOfWeek dow = cursor.getDayOfWeek();
            if (dow == DayOfWeek.FRIDAY || dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                hasWeekend = true;
                break;
            }
            cursor = cursor.plusDays(1);
        }

        // 2. Active overlapping fleet bookings during this window
        List<OrderDetail> allOrders = orderDetailRepository.findAll();
        long activeOverlaps = allOrders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .filter(o -> o.getPickUpTime() != null && o.getReturnUpTime() != null)
                .filter(o -> pickUpTime.isBefore(o.getReturnUpTime()) && returnUpTime.isAfter(o.getPickUpTime()))
                .count();

        // 3. Dynamic Multiplier Calculation
        double multiplier = 1.0;
        String surgeType = "STANDARD";
        String surgeMessage = "Standard daily rate";

        if (activeOverlaps >= 4) {
            multiplier += 0.25; // +25% High fleet demand
            surgeType = "HIGH_DEMAND";
            surgeMessage = "⚡ High Demand Surge (+25%): Significant fleet reservations recorded for these dates";
        } else if (hasWeekend && activeOverlaps >= 2) {
            multiplier += 0.20; // +20% Weekend + Moderate Demand
            surgeType = "WEEKEND_PEAK";
            surgeMessage = "⚡ Weekend Peak (+20%): High weekend demand & limited vehicle availability";
        } else if (hasWeekend) {
            multiplier += 0.15; // +15% Weekend rate
            surgeType = "WEEKEND_PEAK";
            surgeMessage = "⚡ Weekend Surge (+15%): Standard weekend travel premium (Fri–Sun)";
        } else if (days >= 7) {
            multiplier -= 0.15; // 15% Long trip discount
            surgeType = "LONG_TRIP_DEAL";
            surgeMessage = "🎉 Weekly Saver Deal (15% OFF): Extended reservation discount applied";
        } else if (days >= 5) {
            multiplier -= 0.10; // 10% Long trip discount
            surgeType = "LONG_TRIP_DEAL";
            surgeMessage = "🎉 Long Trip Deal (10% OFF): Multi-day volume discount applied";
        } else if (activeOverlaps <= 1) {
            multiplier -= 0.10; // 10% Off-peak weekday saver
            surgeType = "OFF_PEAK_SAVER";
            surgeMessage = "🎉 Midweek Saver (10% OFF): Off-peak weekday pricing advantage";
        }

        // Safety clamps: between 0.80x and 1.50x
        multiplier = Math.max(0.80, Math.min(1.50, multiplier));
        double effectiveRate = Math.round(baseRate * multiplier);
        double baseSubtotal = effectiveRate * days;
        double tax = Math.round(baseSubtotal * 0.18);
        double grandTotal = baseSubtotal + tax;

        return new DynamicPriceResponse(
                carName,
                baseRate,
                effectiveRate,
                Math.round(multiplier * 100.0) / 100.0,
                days,
                baseSubtotal,
                tax,
                grandTotal,
                surgeType,
                surgeMessage,
                (int) activeOverlaps
        );
    }
}
