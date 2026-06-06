# 🚗 Smart Car Rental System

A full-stack Car Rental Management System developed using Spring Boot, MongoDB, and Streamlit. The application allows users to browse available cars, add new cars, book rentals, view bookings, and analyze rental history through an intuitive web interface.

---

## 📌 Project Overview

Traditional car rental systems often require customers to visit rental offices physically and complete manual booking procedures. This project digitizes the entire process by providing an online platform for managing car rentals.

The system uses:

Spring Boot for backend REST APIs
MongoDB for data storage
Streamlit for frontend UI
JSON for data exchange between frontend and backend

---

## 🎯 Objectives

Provide an online platform for car rentals.
Allow users to browse available cars.
Enable car booking and reservation management.
Demonstrate REST API integration using Spring Boot.
Demonstrate JSON parsing and data exchange.
Store and manage rental data using MongoDB.
Track rental history and statistics.

---

## 🛠️ Technology Stack

Component	Technology
Frontend	Streamlit (Python)
Backend	Spring Boot (Java)
Database	MongoDB
API Communication	REST APIs
Data Format	JSON
Build Tool	Maven
IDE	IntelliJ IDEA / VS Code
Database Client	MongoDB Compass / Mongosh

---

## 📂 Project Structure

Smart-Car-Rental-System
│
├── backend
│   ├── controller
│   │   ├── CarRentalController.java
│   │   └── OrderController.java
│   │
│   ├── service
│   │   ├── CarRentalService.java
│   │   └── OrderService.java
│   │
│   ├── model
│   │   ├── CarDetail.java
│   │   └── OrderDetail.java
│   │
│   ├── repository
│   │   ├── CarDetailRepository.java
│   │   └── OrderDetailRepository.java
│   │
│   └── CarRentalSystemApplication.java
│
├── frontend
│   └── app.py
│
├── database
│   └── MongoDB Collections
│       ├── CarDetail
│       └── OrderDetail
│
├── resources
│   └── application.properties
│
├── pom.xml
│
└── README.md

---

## 🚘 Features

1. View Cars
Display all available cars.
Show company, model, type, rating, seating capacity, and rental price.
2. Add Car
Add new cars to inventory.
Input validation for mandatory fields.
3. Book Car
Select a car for booking.
Enter pickup location and rental dates.
Calculate rental cost automatically.
4. View Bookings
Display all booking records.
Retrieve booking information from MongoDB.
5. Rental History
View previous bookings for each car.
Calculate:
Total Bookings
Total Rental Days
Total Revenue
Last Booking Date
6. Validation
Required field validation.
Date validation.
Booking conflict detection (future enhancement).

---

## 🗄️ Database Design

CarDetail Collection
{
  "_id": "1",
  "name": "E220d",
  "company": "Mercedes Benz",
  "price": 5000,
  "rating": 4.5,
  "type": "Sedan",
  "seats": 5
}
OrderDetail Collection
{
  "_id": "101",
  "pickUpTime": "2026-02-10T00:00:00",
  "returnUpTime": "2026-02-15T00:00:00",
  "pickupLocation": "Hyderabad",
  "carName": "E220d",
  "carCompany": "Mercedes Benz",
  "carPrice": 5000,
  "carType": "Sedan",
  "seats": 5,
  "carUser": "John",
  "isBooked": true
}

---

## 🔄 System Architecture

+------------+
|  Streamlit |
| Frontend   |
+------------+
       |
       | REST API Requests
       ▼
+------------+
| Spring Boot|
|  Backend   |
+------------+
       |
       | Mongo Repository
       ▼
+------------+
|  MongoDB   |
| Database   |
+------------+
🔌 REST API Endpoints
Car APIs
Get All Cars
GET /api/cars
Add New Car
POST /api/cars/add

Request Body:

{
  "name": "Fortuner",
  "company": "Toyota",
  "price": 4500,
  "rating": 4.8,
  "type": "SUV",
  "seats": 7
}
Booking APIs
Book Car
POST /api/booking/car
Get All Bookings
GET /api/booking/orders
Get Booking By ID
GET /api/booking/order/{id}
Get Rental History
GET /api/booking/history/{carName}

---

## 📊 JSON Parsing

The application uses JSON as the communication format between frontend and backend.

Example:

{
  "carName": "City",
  "carCompany": "Honda",
  "carPrice": 2500,
  "carUser": "Adam",
  "pickupLocation": "Mumbai"
}

Spring Boot automatically converts JSON into Java objects using:

@RequestBody

and converts Java objects back into JSON responses.

---

## ▶️ How to Run

Step 1: Start MongoDB
mongod

or ensure MongoDB service is running.

Step 2: Run Spring Boot Backend
mvn spring-boot:run

Backend runs on:

http://localhost:8080
Step 3: Run Streamlit Frontend
streamlit run app.py

Frontend runs on:

http://localhost:8501

---

## 📈 Future Enhancements

User Authentication & Authorization
Payment Gateway Integration
Booking Availability Validation
Car Image Upload
Admin Dashboard
Booking Cancellation
Email Notifications
Cloud Deployment (AWS/Azure)

---

## 📚 References

Spring Boot Documentation
MongoDB Documentation
Streamlit Documentation
REST API Tutorial
DBMS and OOPJ Course Materials

---
