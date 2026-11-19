package com.courseproject.carrentalsystem.repository;

import com.courseproject.carrentalsystem.model.OrderDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderDetailRepository extends MongoRepository<OrderDetail, String> {
    List<OrderDetail> findByCarName(String carName);
    List<OrderDetail> findByCarUser(String carUser);
    List<OrderDetail> findByCarUserIgnoreCase(String carUser);
    List<OrderDetail> findByCarOwnerIgnoreCase(String carOwner);
    List<OrderDetail> findByCarNameAndIsBookedTrue(String carName);
}
