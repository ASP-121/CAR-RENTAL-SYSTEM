package com.courseproject.carrentalsystem.controller;
import com.courseproject.carrentalsystem.model.CarDetail;
import com.courseproject.carrentalsystem.service.CarRentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarRentalController {

    @Autowired
    CarRentalService carRentalService;

    @GetMapping
    public List<CarDetail> getAllCarDetails(){
        return carRentalService.getCarDetails();
    }

    @PostMapping("/add")
    public boolean postCarDetail(@RequestBody CarDetail carDetail){
        carRentalService.addCarDetails(carDetail);
        return true;
    }



}
