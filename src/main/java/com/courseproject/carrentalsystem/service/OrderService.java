package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.model.OrderDetail;
import com.courseproject.carrentalsystem.model.TelemetryState;
import com.courseproject.carrentalsystem.repository.OrderDetailRepository;
import com.courseproject.carrentalsystem.repository.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private TelemetryRepository telemetryRepository;

    public List<OrderDetail> getHistory(String carName) {
        return orderDetailRepository.findByCarName(carName);
    }

    public boolean isCarAvailable(String carName, LocalDateTime pickUpTime, LocalDateTime returnUpTime) {
        if (carName == null || pickUpTime == null || returnUpTime == null) {
            return true;
        }

        List<OrderDetail> existingBookings = orderDetailRepository.findByCarNameAndIsBookedTrue(carName);
        for (OrderDetail b : existingBookings) {
            if ("CANCELLED".equalsIgnoreCase(b.getStatus())) {
                continue;
            }
            if (b.getPickUpTime() != null && b.getReturnUpTime() != null) {
                // Interval overlap: startA < endB && endA > startB
                boolean overlaps = pickUpTime.isBefore(b.getReturnUpTime()) && returnUpTime.isAfter(b.getPickUpTime());
                if (overlaps) {
                    return false;
                }
            }
        }
        return true;
    }

    public OrderDetail postOrderDetail(OrderDetail booking) {
        if (booking.getOrderId() == null || booking.getOrderId().trim().isEmpty()) {
            booking.setOrderId("ORD-" + System.currentTimeMillis());
        }
        booking.setBooked(true);
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("CONFIRMED");
        }
        OrderDetail saved = orderDetailRepository.save(booking);

        // Also initialize digital key telemetry for this reservation
        TelemetryState telemetry = new TelemetryState(
                saved.getOrderId(),
                saved.getCarName(),
                false, // initial lock state: unlocked
                true,  // initial climate: on (auto)
                70,    // 70 F
                94,    // 94% battery
                "ONLINE"
        );
        telemetryRepository.save(telemetry);

        return saved;
    }

    public Optional<OrderDetail> getOrderDetail(String orderId) {
        return orderDetailRepository.findById(orderId);
    }

    public List<OrderDetail> getAllOrders() {
        return orderDetailRepository.findAll();
    }

    public List<OrderDetail> getOrdersByUserEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return orderDetailRepository.findByCarUserIgnoreCase(email.trim());
    }

    public List<OrderDetail> getOrdersByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Collections.emptyList();
        }
        String email = authentication.getName();
        return getOrdersByUserEmail(email);
    }

    public List<OrderDetail> getOrdersForCarOwner() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Collections.emptyList();
        }
        String ownerEmail = authentication.getName();
        return getOrdersForCarOwner(ownerEmail);
    }

    public List<OrderDetail> getOrdersForCarOwner(String ownerEmail) {
        if (ownerEmail == null || ownerEmail.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return orderDetailRepository.findByCarOwnerIgnoreCase(ownerEmail.trim());
    }

    public Optional<OrderDetail> cancelOrder(String orderId) {
        Optional<OrderDetail> opt = orderDetailRepository.findById(orderId);
        if (opt.isPresent()) {
            OrderDetail order = opt.get();
            order.setBooked(false);
            order.setStatus("CANCELLED");
            return Optional.of(orderDetailRepository.save(order));
        }
        return Optional.empty();
    }

    public Optional<OrderDetail> updateOrderStatus(String orderId, String status) {
        Optional<OrderDetail> opt = orderDetailRepository.findById(orderId);
        if (opt.isPresent()) {
            OrderDetail order = opt.get();
            order.setStatus(status);
            if ("CANCELLED".equalsIgnoreCase(status)) {
                order.setBooked(false);
            }
            return Optional.of(orderDetailRepository.save(order));
        }
        return Optional.empty();
    }
}
