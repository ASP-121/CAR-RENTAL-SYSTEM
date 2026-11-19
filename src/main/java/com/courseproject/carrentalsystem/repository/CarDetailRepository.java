package com.courseproject.carrentalsystem.repository;

import com.courseproject.carrentalsystem.model.CarDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CarDetailRepository extends MongoRepository<CarDetail, String> {
    List<CarDetail> findByOwnerEmailIgnoreCase(String ownerEmail);
    Optional<CarDetail> findByNameIgnoreCase(String name);
}
