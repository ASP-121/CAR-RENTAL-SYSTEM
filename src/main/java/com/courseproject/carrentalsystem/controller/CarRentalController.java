package com.courseproject.carrentalsystem.controller;

import com.courseproject.carrentalsystem.model.CarDetail;
import com.courseproject.carrentalsystem.service.CarRentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/cars")
public class CarRentalController {

    @Autowired
    CarRentalService carRentalService;

    @GetMapping
    public List<CarDetail> getAllCarDetails(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer seats,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy
    ) {
        if (type != null || seats != null || maxPrice != null || search != null || sortBy != null) {
            return carRentalService.getFilteredCars(type, seats, maxPrice, search, sortBy);
        }
        return carRentalService.getCarDetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDetail> getCarById(@PathVariable String id) {
        Optional<CarDetail> car = carRentalService.getCarById(id);
        return car.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/add")
    public ResponseEntity<CarDetail> postCarDetail(@RequestBody CarDetail carDetail) {
        CarDetail saved = carRentalService.addCarDetails(carDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarDetail> updateCarDetail(@PathVariable String id, @RequestBody CarDetail carDetail) {
        Optional<CarDetail> updated = carRentalService.updateCarDetails(id, carDetail);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteCarDetail(@PathVariable String id) {
        boolean deleted = carRentalService.deleteCarDetails(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
    }
}
