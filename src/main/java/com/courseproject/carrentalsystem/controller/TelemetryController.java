package com.courseproject.carrentalsystem.controller;

import com.courseproject.carrentalsystem.model.OrderDetail;
import com.courseproject.carrentalsystem.model.TelemetryState;
import com.courseproject.carrentalsystem.service.OrderService;
import com.courseproject.carrentalsystem.service.TelemetryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/telemetry")
public class TelemetryController {

    @Autowired
    private TelemetryService telemetryService;

    @Autowired
    private OrderService orderService;

    private boolean isAuthorizedForOrder(String orderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return true;

        Optional<OrderDetail> orderOpt = orderService.getOrderDetail(orderId);
        if (orderOpt.isEmpty()) return false;
        OrderDetail order = orderOpt.get();
        String email = auth.getName();
        return (email.equalsIgnoreCase(order.getCarUser()) || email.equalsIgnoreCase(order.getCarOwner()));
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<TelemetryState> getTelemetry(@PathVariable String orderId) {
        if (!isAuthorizedForOrder(orderId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        TelemetryState state = telemetryService.getTelemetry(orderId);
        return ResponseEntity.ok(state);
    }

    @PostMapping("/{orderId}/lock")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<TelemetryState> toggleLock(@PathVariable String orderId) {
        if (!isAuthorizedForOrder(orderId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        TelemetryState updated = telemetryService.toggleLock(orderId);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{orderId}/climate")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<TelemetryState> toggleClimate(@PathVariable String orderId) {
        if (!isAuthorizedForOrder(orderId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        TelemetryState updated = telemetryService.toggleClimate(orderId);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{orderId}/temperature")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<TelemetryState> setTemperature(
            @PathVariable String orderId,
            @RequestParam int temp
    ) {
        if (!isAuthorizedForOrder(orderId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        TelemetryState updated = telemetryService.updateTemperature(orderId, temp);
        return ResponseEntity.ok(updated);
    }
}
