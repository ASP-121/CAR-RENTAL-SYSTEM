package com.courseproject.carrentalsystem.controller;

import com.courseproject.carrentalsystem.dto.AvailabilityResponse;
import com.courseproject.carrentalsystem.model.OrderDetail;
import com.courseproject.carrentalsystem.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/booking")
public class OrderController {

    @Autowired
    OrderService orderService;

    @GetMapping("/history/{carName}")
    public List<OrderDetail> getHistory(@PathVariable String carName){
        return orderService.getHistory(carName);
    }

    @GetMapping("/check-availability")
    public ResponseEntity<AvailabilityResponse> checkAvailability(
            @RequestParam String carName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime pickUpTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime returnUpTime
    ) {
        boolean available = orderService.isCarAvailable(carName, pickUpTime, returnUpTime);
        if (available) {
            return ResponseEntity.ok(new AvailabilityResponse(true, carName, "Car is available for the requested dates"));
        } else {
            return ResponseEntity.ok(new AvailabilityResponse(false, carName, "Car is already booked for these dates"));
        }
    }

    @PostMapping("/car")
    public ResponseEntity<?> bookCar(@RequestBody OrderDetail booking){
        if (booking.getPickUpTime() != null && booking.getReturnUpTime() != null && booking.getCarName() != null) {
            boolean available = orderService.isCarAvailable(booking.getCarName(), booking.getPickUpTime(), booking.getReturnUpTime());
            if (!available) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new AvailabilityResponse(false, booking.getCarName(), "Car is already booked for the selected schedule. Please choose different dates."));
            }
        }
        OrderDetail saved = orderService.postOrderDetail(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<OrderDetail> getInvoice(@PathVariable("id") String orderId){
        Optional<OrderDetail> order = orderService.getOrderDetail(orderId);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/orders")
    public List<OrderDetail> listOrders(){
        return orderService.getAllOrders();
    }

    @GetMapping("/user/{carUser}")
    public List<OrderDetail> getOrdersByUser(@PathVariable String carUser){
        return orderService.getOrdersByUser(carUser);
    }

    @PutMapping("/order/{id}/cancel")
    public ResponseEntity<OrderDetail> cancelOrder(@PathVariable("id") String orderId) {
        Optional<OrderDetail> cancelled = orderService.cancelOrder(orderId);
        return cancelled.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/order/{id}/status")
    public ResponseEntity<OrderDetail> updateStatus(@PathVariable("id") String orderId, @RequestParam String status) {
        Optional<OrderDetail> updated = orderService.updateOrderStatus(orderId, status);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
