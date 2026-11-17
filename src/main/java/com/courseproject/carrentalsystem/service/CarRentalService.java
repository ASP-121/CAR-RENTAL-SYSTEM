package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.model.CarDetail;
import com.courseproject.carrentalsystem.repository.CarDetailRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarRentalService {

    @Autowired
    CarDetailRepository carDetailRepository;

    @PostConstruct
    public void seedDefaultFleet() {
        try {
            if (carDetailRepository.count() == 0) {
                List<CarDetail> initialFleet = List.of(
                    new CarDetail("car_1", "Model 3 Performance", "Tesla", 89.0, 4.95, "Electric", 5, "315 mi", "3.1s", "Electric", "/assets/cars/electric.jpg"),
                    new CarDetail("car_2", "C-Class Sedan", "Mercedes-Benz", 115.0, 4.88, "Sedan", 5, "540 mi", "5.3s", "Gasoline", "/assets/cars/sedan.jpg"),
                    new CarDetail("car_3", "X5 xDrive40i", "BMW", 135.0, 4.92, "SUV", 7, "480 mi", "4.8s", "Hybrid", "/assets/cars/suv.jpg"),
                    new CarDetail("car_4", "911 Carrera Cabriolet", "Porsche", 240.0, 4.99, "Convertible", 4, "410 mi", "3.8s", "Gasoline", "/assets/cars/convertible.jpg"),
                    new CarDetail("car_5", "Golf GTI Clubsport", "Volkswagen", 65.0, 4.79, "Hatchback", 5, "450 mi", "5.6s", "Gasoline", "/assets/cars/hatchback.jpg")
                );
                carDetailRepository.saveAll(initialFleet);
            }
        } catch (Exception e) {
            System.err.println("Note: MongoDB is currently offline or connecting. Startup seeding will run once MongoDB is available: " + e.getMessage());
        }
    }

    public List<CarDetail> getCarDetails() {
        return carDetailRepository.findAll();
    }

    public List<CarDetail> getFilteredCars(String type, Integer seats, Double maxPrice, String search, String sortBy) {
        List<CarDetail> cars = carDetailRepository.findAll();

        return cars.stream()
            .filter(c -> {
                if (type != null && !type.equalsIgnoreCase("All") && !type.trim().isEmpty()) {
                    if (!c.getType().equalsIgnoreCase(type.trim())) return false;
                }
                if (seats != null && seats > 0) {
                    if (c.getSeats() != seats) return false;
                }
                if (maxPrice != null && maxPrice > 0) {
                    if (c.getPrice() > maxPrice) return false;
                }
                if (search != null && !search.trim().isEmpty()) {
                    String query = search.trim().toLowerCase();
                    boolean matchName = c.getName() != null && c.getName().toLowerCase().contains(query);
                    boolean matchCompany = c.getCompany() != null && c.getCompany().toLowerCase().contains(query);
                    if (!matchName && !matchCompany) return false;
                }
                return true;
            })
            .sorted((a, b) -> {
                if ("price-low".equalsIgnoreCase(sortBy)) {
                    return Double.compare(a.getPrice(), b.getPrice());
                } else if ("price-high".equalsIgnoreCase(sortBy)) {
                    return Double.compare(b.getPrice(), a.getPrice());
                } else if ("rating".equalsIgnoreCase(sortBy)) {
                    return Double.compare(b.getRating(), a.getRating());
                }
                return 0;
            })
            .collect(Collectors.toList());
    }

    public Optional<CarDetail> getCarById(String id) {
        Optional<CarDetail> car = carDetailRepository.findById(id);
        if (car.isPresent()) return car;
        return carDetailRepository.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(id))
                .findFirst();
    }

    public CarDetail addCarDetails(CarDetail carDetail) {
        if (carDetail.getId() == null || carDetail.getId().trim().isEmpty()) {
            carDetail.setId("car_" + System.currentTimeMillis());
        }
        return carDetailRepository.save(carDetail);
    }

    public Optional<CarDetail> updateCarDetails(String id, CarDetail updatedCar) {
        Optional<CarDetail> existing = getCarById(id);
        if (existing.isPresent()) {
            CarDetail car = existing.get();
            if (updatedCar.getName() != null) car.setName(updatedCar.getName());
            if (updatedCar.getCompany() != null) car.setCompany(updatedCar.getCompany());
            if (updatedCar.getPrice() > 0) car.setPrice(updatedCar.getPrice());
            if (updatedCar.getRating() > 0) car.setRating(updatedCar.getRating());
            if (updatedCar.getType() != null) car.setType(updatedCar.getType());
            if (updatedCar.getSeats() > 0) car.setSeats(updatedCar.getSeats());
            if (updatedCar.getRange() != null) car.setRange(updatedCar.getRange());
            if (updatedCar.getAcceleration() != null) car.setAcceleration(updatedCar.getAcceleration());
            if (updatedCar.getFuelType() != null) car.setFuelType(updatedCar.getFuelType());
            if (updatedCar.getImageUrl() != null) car.setImageUrl(updatedCar.getImageUrl());
            return Optional.of(carDetailRepository.save(car));
        }
        return Optional.empty();
    }

    public boolean deleteCarDetails(String id) {
        Optional<CarDetail> existing = getCarById(id);
        if (existing.isPresent()) {
            carDetailRepository.delete(existing.get());
            return true;
        }
        return false;
    }
}
