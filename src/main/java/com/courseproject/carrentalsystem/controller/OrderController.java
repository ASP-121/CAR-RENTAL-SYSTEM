package com.courseproject.carrentalsystem.controller;

import com.courseproject.carrentalsystem.dto.CarHistoryResponse;
import com.courseproject.carrentalsystem.model.OrderDetail;
import com.courseproject.carrentalsystem.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/booking")
public class OrderController {

    @Autowired
    OrderService orderService;
    @GetMapping("/history/{carName}")
    public List<OrderDetail> getHistory(@PathVariable String carName){
        return orderService.getHistory(carName);
    }

    @PostMapping("/car")
    public void bookCar(@RequestBody OrderDetail booking){
        orderService.postOrderDetail(booking);
    }

    @GetMapping("/order/{id}")
    public Optional<OrderDetail> getInvoice(@RequestParam String orderId){
        return orderService.getOrderDetail(orderId);
    }

    @GetMapping("/orders")
    public List<OrderDetail> listOrders(){
        return orderService.getAllOrders();
    }

}
