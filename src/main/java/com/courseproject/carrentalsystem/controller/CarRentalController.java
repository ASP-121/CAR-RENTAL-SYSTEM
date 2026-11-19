package com.courseproject.carrentalsystem.controller;

import com.courseproject.carrentalsystem.model.CarDetail;
import com.courseproject.carrentalsystem.service.CarRentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/cars")
public class CarRentalController {

    @Autowired
    private CarRentalService carRentalService;

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

    @GetMapping("/my-cars")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<CarDetail> getMyCars() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        return carRentalService.getMyCars(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDetail> getCarById(@PathVariable String id) {
        Optional<CarDetail> car = carRentalService.getCarById(id);
        return car.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<CarDetail> postCarDetail(@RequestBody CarDetail carDetail) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : "akash2006@gmail.com";
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // If not admin, bind the owner to the authenticated user's email
        if (!isAdmin || carDetail.getOwnerEmail() == null || carDetail.getOwnerEmail().trim().isEmpty()) {
            carDetail.setOwnerEmail(email);
        }

        CarDetail saved = carRentalService.addCarDetails(carDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<CarDetail> updateCarDetail(@PathVariable String id, @RequestBody CarDetail carDetail) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Optional<CarDetail> existingOpt = carRentalService.getCarById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        CarDetail existing = existingOpt.get();
        // Only admin or the vehicle's owner can modify vehicle details
        if (!isAdmin && (email == null || !email.equalsIgnoreCase(existing.getOwnerEmail()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        carDetail.setOwnerEmail(existing.getOwnerEmail());
        Optional<CarDetail> updated = carRentalService.updateCarDetails(id, carDetail);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<Boolean> deleteCarDetail(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Optional<CarDetail> existingOpt = carRentalService.getCarById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }

        CarDetail existing = existingOpt.get();
        // Only admin or the vehicle's owner can delete vehicle
        if (!isAdmin && (email == null || !email.equalsIgnoreCase(existing.getOwnerEmail()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(false);
        }

        boolean deleted = carRentalService.deleteCarDetails(id);
        return ResponseEntity.ok(deleted);
    }
}
