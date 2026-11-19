package com.courseproject.carrentalsystem.controller;

import com.courseproject.carrentalsystem.model.CarSaleListing;
import com.courseproject.carrentalsystem.model.PurchaseInquiry;
import com.courseproject.carrentalsystem.service.CarSaleService;
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
@RequestMapping("/api/marketplace")
public class CarSaleController {

    @Autowired
    private CarSaleService carSaleService;

    @GetMapping("/cars")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<CarSaleListing> getCarSaleListings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double maxPrice
    ) {
        return carSaleService.getAllListings(search, city, maxPrice);
    }

    @GetMapping("/cars/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<CarSaleListing> getListingById(@PathVariable String id) {
        Optional<CarSaleListing> listing = carSaleService.getListingById(id);
        return listing.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/cars/sell")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<CarSaleListing> createListing(@RequestBody CarSaleListing listing) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : "seller@driveease.com";
        CarSaleListing saved = carSaleService.createListing(listing, email, listing.getSellerName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/cars/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<CarSaleListing> updateListing(@PathVariable String id, @RequestBody CarSaleListing updated) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Optional<CarSaleListing> existing = carSaleService.getListingById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (!isAdmin && (email == null || !email.equalsIgnoreCase(existing.get().getSellerEmail()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<CarSaleListing> result = carSaleService.updateListing(id, updated);
        return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/cars/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<Boolean> deleteListing(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Optional<CarSaleListing> existing = carSaleService.getListingById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }

        if (!isAdmin && (email == null || !email.equalsIgnoreCase(existing.get().getSellerEmail()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(false);
        }

        boolean deleted = carSaleService.deleteListing(id);
        return ResponseEntity.ok(deleted);
    }

    @GetMapping("/my-listings")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<CarSaleListing> getMyListings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        return carSaleService.getMyListings(email);
    }

    @PostMapping("/inquiries")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<PurchaseInquiry> submitInquiry(@RequestBody PurchaseInquiry inquiry) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : "buyer@driveease.com";
        PurchaseInquiry saved = carSaleService.submitInquiry(inquiry, email, inquiry.getBuyerName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/my-inquiries")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<PurchaseInquiry> getMyInquiries() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        return carSaleService.getInquiriesForUser(email);
    }

    @PutMapping("/inquiries/{id}/status")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<PurchaseInquiry> updateInquiryStatus(@PathVariable String id, @RequestParam String status) {
        Optional<PurchaseInquiry> updated = carSaleService.updateInquiryStatus(id, status);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
