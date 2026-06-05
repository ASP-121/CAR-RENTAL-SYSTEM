package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.model.OrderDetail;
import com.courseproject.carrentalsystem.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> getHistory(String carName){
        return orderDetailRepository.findByCarName(carName);
    }
    public void postOrderDetail(OrderDetail booking){
        orderDetailRepository.save(booking);
    }

    public Optional<OrderDetail> getOrderDetail(String orderId){
        return orderDetailRepository.findById(orderId);
    }

    public List<OrderDetail> getAllOrders(){
        return orderDetailRepository.findAll();
    }
}
