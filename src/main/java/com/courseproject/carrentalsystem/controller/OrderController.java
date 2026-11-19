package com.courseproject.carrentalsystem.controller;

import com.courseproject.carrentalsystem.dto.AvailabilityResponse;
import com.courseproject.carrentalsystem.dto.DynamicPriceResponse;
import com.courseproject.carrentalsystem.model.CarDetail;
import com.courseproject.carrentalsystem.model.OrderDetail;
import com.courseproject.carrentalsystem.service.CarRentalService;
import com.courseproject.carrentalsystem.service.DynamicPricingService;
import com.courseproject.carrentalsystem.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/booking")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CarRentalService carRentalService;

    @Autowired
    private DynamicPricingService dynamicPricingService;

    @GetMapping("/calculate-price")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<DynamicPriceResponse> calculateDynamicPrice(
            @RequestParam String carName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime pickUpTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime returnUpTime) {
        DynamicPriceResponse response = dynamicPricingService.calculatePrice(carName, pickUpTime, returnUpTime);
        return ResponseEntity.ok(response);
    }

    /**
     * Requirement: Only admin can see each car's previous order details.
     */
    @GetMapping("/history/{carName}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDetail> getHistory(@PathVariable String carName) {
        return orderService.getHistory(carName);
    }

    @GetMapping("/check-availability")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<AvailabilityResponse> checkAvailability(
            @RequestParam String carName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime pickUpTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime returnUpTime) {
        boolean available = orderService.isCarAvailable(carName, pickUpTime, returnUpTime);
        if (available) {
            return ResponseEntity.ok(new AvailabilityResponse(true, carName,
                    "Car is available for the requested dates"));
        } else {
            return ResponseEntity.ok(new AvailabilityResponse(false, carName,
                    "Car is already booked for these dates"));
        }
    }

    @PostMapping("/car")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<?> bookCar(@RequestBody OrderDetail booking) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Bind booking to the authenticated user's email to prevent user spoofing
        if (!isAdmin && email != null) {
            booking.setCarUser(email);
        } else if (booking.getCarUser() == null || booking.getCarUser().trim().isEmpty()) {
            booking.setCarUser(email);
        }

        // Look up vehicle to automatically set the verified carOwner
        if (booking.getCarName() != null) {
            Optional<CarDetail> carOpt = carRentalService.getCarByName(booking.getCarName());
            if (carOpt.isPresent() && carOpt.get().getOwnerEmail() != null && !carOpt.get().getOwnerEmail().trim().isEmpty()) {
                booking.setCarOwner(carOpt.get().getOwnerEmail().trim().toLowerCase());
            } else if (booking.getCarOwner() == null || booking.getCarOwner().trim().isEmpty()) {
                booking.setCarOwner("akash2006@gmail.com");
            }
        }

        if (booking.getPickUpTime() != null && booking.getReturnUpTime() != null && booking.getCarName() != null) {
            boolean available = orderService.isCarAvailable(booking.getCarName(),
                    booking.getPickUpTime(), booking.getReturnUpTime());
            if (!available) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new AvailabilityResponse(false, booking.getCarName(),
                                "Car is already booked for the selected schedule. Please choose different dates."));
            }
        }
        OrderDetail saved = orderService.postOrderDetail(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/order/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<OrderDetail> getInvoice(@PathVariable("id") String orderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Optional<OrderDetail> orderOpt = orderService.getOrderDetail(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        OrderDetail order = orderOpt.get();
        boolean isRenter = email != null && email.equalsIgnoreCase(order.getCarUser());
        boolean isCarOwner = email != null && email.equalsIgnoreCase(order.getCarOwner());

        // Allowed for: Administrator, the renter (carUser), or the car's owner (carOwner)
        if (!isAdmin && !isRenter && !isCarOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(order);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDetail> listOrders() {
        return orderService.getAllOrders();
    }

    /**
     * Orders booked by the currently logged-in user.
     */
    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<OrderDetail> getOrdersByUser() {
        return orderService.getOrdersByUser();
    }

    /**
     * Requirement: A car owner can see order details of only his car when someone books it.
     */
    @GetMapping("/owner-orders")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<OrderDetail> getOrdersForCarOwner() {
        return orderService.getOrdersForCarOwner();
    }

    @GetMapping("/user/{email}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<List<OrderDetail>> getOrdersBySpecificUser(@PathVariable String email) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = (auth != null) ? auth.getName() : null;
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && (currentEmail == null || !currentEmail.equalsIgnoreCase(email))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(orderService.getOrdersByUserEmail(email));
    }

    @PutMapping("/order/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<OrderDetail> cancelOrder(@PathVariable("id") String orderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Optional<OrderDetail> opt = orderService.getOrderDetail(orderId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        OrderDetail order = opt.get();
        boolean isRenter = email != null && email.equalsIgnoreCase(order.getCarUser());
        boolean isCarOwner = email != null && email.equalsIgnoreCase(order.getCarOwner());

        if (!isAdmin && !isRenter && !isCarOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<OrderDetail> cancelled = orderService.cancelOrder(orderId);
        return cancelled.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/order/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDetail> updateStatus(@PathVariable("id") String orderId,
                                                    @RequestParam String status) {
        Optional<OrderDetail> updated = orderService.updateOrderStatus(orderId, status);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
