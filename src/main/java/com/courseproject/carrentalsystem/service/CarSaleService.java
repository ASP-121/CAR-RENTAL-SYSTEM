package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.model.CarSaleListing;
import com.courseproject.carrentalsystem.model.PurchaseInquiry;
import com.courseproject.carrentalsystem.repository.CarSaleListingRepository;
import com.courseproject.carrentalsystem.repository.PurchaseInquiryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarSaleService {

    @Autowired
    private CarSaleListingRepository listingRepository;

    @Autowired
    private PurchaseInquiryRepository inquiryRepository;

    @PostConstruct
    public void seedInitialMarketplace() {
        try {
            if (listingRepository.count() == 0) {
                List<CarSaleListing> initialCars = List.of(
                        new CarSaleListing(
                                "sale_1", "Honda City ZX CVT", "Honda", 2022, 28000, 1180000.0,
                                "Petrol", "Automatic", "1st Owner", "Mumbai",
                                "akash2006@gmail.com", "DriveEase Certified Fleet", "+91 98765 43210",
                                "/assets/cars/sedan.jpg",
                                "Single-owner executive driven Honda City with full showroom service records, sunroof, and ADAS suite.",
                                "AVAILABLE", LocalDateTime.now()
                        ),
                        new CarSaleListing(
                                "sale_2", "Tata Harrier XZA+ Dark Edition", "Tata", 2023, 19500, 1850000.0,
                                "Diesel", "Automatic", "1st Owner", "Bengaluru",
                                "akash2006@gmail.com", "DriveEase Certified Fleet", "+91 98765 43210",
                                "/assets/cars/suv.jpg",
                                "Immaculate condition Dark Edition Harrier with panoramic sunroof, 360 camera, and ventilated seats.",
                                "AVAILABLE", LocalDateTime.now()
                        ),
                        new CarSaleListing(
                                "sale_3", "Hyundai Creta SX(O) Knight Edition", "Hyundai", 2022, 24000, 1420000.0,
                                "Petrol", "Manual", "1st Owner", "Delhi",
                                "akash2006@gmail.com", "DriveEase Certified Fleet", "+91 98765 43210",
                                "/assets/cars/hatchback.jpg",
                                "Fully loaded Knight Edition with Bose sound system, all-black interiors, and clean inspection scorecard.",
                                "AVAILABLE", LocalDateTime.now()
                        ),
                        new CarSaleListing(
                                "sale_4", "BMW 3 Series 330i M Sport", "BMW", 2021, 31000, 3950000.0,
                                "Petrol", "Automatic", "1st Owner", "Pune",
                                "akash2006@gmail.com", "DriveEase Certified Fleet", "+91 98765 43210",
                                "/assets/cars/convertible.jpg",
                                "German luxury performance sedan with active service inclusive package, pristine paint protection film.",
                                "AVAILABLE", LocalDateTime.now()
                        )
                );
                listingRepository.saveAll(initialCars);
            }
        } catch (Exception e) {
            System.err.println("Note: MongoDB connecting. Skipping marketplace seed: " + e.getMessage());
        }
    }

    public List<CarSaleListing> getAllListings(String search, String city, Double maxPrice) {
        List<CarSaleListing> all = listingRepository.findAll();
        return all.stream()
                .filter(c -> !"SOLD".equalsIgnoreCase(c.getStatus()))
                .filter(c -> {
                    if (city != null && !city.equalsIgnoreCase("All") && !city.trim().isEmpty()) {
                        if (!c.getCity().equalsIgnoreCase(city.trim())) return false;
                    }
                    if (maxPrice != null && maxPrice > 0) {
                        if (c.getSellingPrice() > maxPrice) return false;
                    }
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.toLowerCase();
                        boolean match = c.getCarName().toLowerCase().contains(q)
                                || c.getCompany().toLowerCase().contains(q)
                                || c.getCity().toLowerCase().contains(q);
                        if (!match) return false;
                    }
                    return true;
                })
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Optional<CarSaleListing> getListingById(String id) {
        return listingRepository.findById(id);
    }

    public CarSaleListing createListing(CarSaleListing listing, String sellerEmail, String sellerName) {
        if (listing.getId() == null || listing.getId().trim().isEmpty()) {
            listing.setId("sale_" + System.currentTimeMillis());
        }
        listing.setSellerEmail(sellerEmail);
        if (listing.getSellerName() == null || listing.getSellerName().trim().isEmpty()) {
            listing.setSellerName(sellerName);
        }
        if (listing.getStatus() == null || listing.getStatus().trim().isEmpty()) {
            listing.setStatus("AVAILABLE");
        }
        if (listing.getCreatedAt() == null) {
            listing.setCreatedAt(LocalDateTime.now());
        }
        return listingRepository.save(listing);
    }

    public Optional<CarSaleListing> updateListing(String id, CarSaleListing updated) {
        Optional<CarSaleListing> existingOpt = listingRepository.findById(id);
        if (existingOpt.isPresent()) {
            CarSaleListing car = existingOpt.get();
            if (updated.getCarName() != null) car.setCarName(updated.getCarName());
            if (updated.getCompany() != null) car.setCompany(updated.getCompany());
            if (updated.getYear() > 1990) car.setYear(updated.getYear());
            if (updated.getKmDriven() >= 0) car.setKmDriven(updated.getKmDriven());
            if (updated.getSellingPrice() > 0) car.setSellingPrice(updated.getSellingPrice());
            if (updated.getFuelType() != null) car.setFuelType(updated.getFuelType());
            if (updated.getTransmission() != null) car.setTransmission(updated.getTransmission());
            if (updated.getOwnerType() != null) car.setOwnerType(updated.getOwnerType());
            if (updated.getCity() != null) car.setCity(updated.getCity());
            if (updated.getImageUrl() != null) car.setImageUrl(updated.getImageUrl());
            if (updated.getDescription() != null) car.setDescription(updated.getDescription());
            if (updated.getStatus() != null) car.setStatus(updated.getStatus());
            return Optional.of(listingRepository.save(car));
        }
        return Optional.empty();
    }

    public boolean deleteListing(String id) {
        if (listingRepository.existsById(id)) {
            listingRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<CarSaleListing> getMyListings(String sellerEmail) {
        if (sellerEmail == null) return List.of();
        return listingRepository.findBySellerEmailIgnoreCase(sellerEmail.trim());
    }

    public PurchaseInquiry submitInquiry(PurchaseInquiry inquiry, String buyerEmail, String buyerName) {
        if (inquiry.getId() == null || inquiry.getId().trim().isEmpty()) {
            inquiry.setId("inq_" + System.currentTimeMillis());
        }
        inquiry.setBuyerEmail(buyerEmail);
        if (inquiry.getBuyerName() == null || inquiry.getBuyerName().trim().isEmpty()) {
            inquiry.setBuyerName(buyerName);
        }
        if (inquiry.getStatus() == null || inquiry.getStatus().trim().isEmpty()) {
            inquiry.setStatus("PENDING");
        }
        if (inquiry.getCreatedAt() == null) {
            inquiry.setCreatedAt(LocalDateTime.now());
        }

        // Look up sellerEmail from listing
        if (inquiry.getListingId() != null) {
            Optional<CarSaleListing> listing = listingRepository.findById(inquiry.getListingId());
            listing.ifPresent(l -> {
                inquiry.setSellerEmail(l.getSellerEmail());
                inquiry.setCarName(l.getCarName());
            });
        }

        return inquiryRepository.save(inquiry);
    }

    public List<PurchaseInquiry> getInquiriesForUser(String userEmail) {
        if (userEmail == null) return List.of();
        List<PurchaseInquiry> sent = inquiryRepository.findByBuyerEmailIgnoreCase(userEmail.trim());
        List<PurchaseInquiry> received = inquiryRepository.findBySellerEmailIgnoreCase(userEmail.trim());
        List<PurchaseInquiry> all = new ArrayList<>();
        all.addAll(received);
        for (PurchaseInquiry inq : sent) {
            if (all.stream().noneMatch(x -> x.getId().equals(inq.getId()))) {
                all.add(inq);
            }
        }
        all.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return all;
    }

    public Optional<PurchaseInquiry> updateInquiryStatus(String inquiryId, String status) {
        Optional<PurchaseInquiry> inqOpt = inquiryRepository.findById(inquiryId);
        if (inqOpt.isPresent()) {
            PurchaseInquiry inq = inqOpt.get();
            inq.setStatus(status);
            return Optional.of(inquiryRepository.save(inq));
        }
        return Optional.empty();
    }
}
