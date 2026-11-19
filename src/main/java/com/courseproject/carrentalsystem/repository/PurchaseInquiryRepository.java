package com.courseproject.carrentalsystem.repository;

import com.courseproject.carrentalsystem.model.PurchaseInquiry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PurchaseInquiryRepository extends MongoRepository<PurchaseInquiry, String> {
    List<PurchaseInquiry> findBySellerEmailIgnoreCase(String sellerEmail);
    List<PurchaseInquiry> findByBuyerEmailIgnoreCase(String buyerEmail);
    List<PurchaseInquiry> findByListingId(String listingId);
}
