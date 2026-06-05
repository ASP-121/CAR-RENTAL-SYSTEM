package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.model.CarDetail;
import com.courseproject.carrentalsystem.repository.CarDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarRentalService {

    @Autowired
    CarDetailRepository carDetailRepository;

    public List<CarDetail> getCarDetails(){
        return carDetailRepository.findAll();
    }

    public void addCarDetails(CarDetail carDetail){
        carDetailRepository.save(carDetail);
    }
}
