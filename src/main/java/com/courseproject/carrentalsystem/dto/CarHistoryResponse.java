package com.courseproject.carrentalsystem.dto;

import java.util.List;
import com.courseproject.carrentalsystem.model.OrderDetail;

public class CarHistoryResponse {

    private int totalBookings;
    private long totalDays;
    private double totalRevenue;
    private String lastBookedDate;
    private List<OrderDetail> bookings;

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public long getTotalDays() { return totalDays; }
    public void setTotalDays(long totalDays) { this.totalDays = totalDays; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public String getLastBookedDate() { return lastBookedDate; }
    public void setLastBookedDate(String lastBookedDate) { this.lastBookedDate = lastBookedDate; }

    public List<OrderDetail> getBookings() { return bookings; }
    public void setBookings(List<OrderDetail> bookings) { this.bookings = bookings; }
}
