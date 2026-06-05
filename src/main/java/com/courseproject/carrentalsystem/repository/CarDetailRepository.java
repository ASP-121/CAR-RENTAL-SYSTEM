package com.courseproject.carrentalsystem.repository;

import com.courseproject.carrentalsystem.model.CarDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CarDetailRepository extends MongoRepository<CarDetail, String>
{

}
