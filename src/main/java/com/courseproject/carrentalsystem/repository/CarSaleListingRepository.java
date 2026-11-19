package com.courseproject.carrentalsystem.repository;

import com.courseproject.carrentalsystem.model.CarSaleListing;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CarSaleListingRepository extends MongoRepository<CarSaleListing, String> {
    List<CarSaleListing> findByStatus(String status);
    List<CarSaleListing> findBySellerEmailIgnoreCase(String sellerEmail);
}
