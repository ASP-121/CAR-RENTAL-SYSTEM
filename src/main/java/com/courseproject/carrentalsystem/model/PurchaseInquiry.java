package com.courseproject.carrentalsystem.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseInquiry {
    @Id
    private String id;
    private String listingId;
    private String carName;
    private String sellerEmail;
    private String buyerEmail;
    private String buyerName;
    private String buyerPhone;
    private double offeredPrice;
    private String inquiryType; // "BUY_OFFER", "SCHEDULE_TEST_DRIVE"
    private String message;
    private String status; // "PENDING", "ACCEPTED", "REJECTED"
    private LocalDateTime createdAt;
}
