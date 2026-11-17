package com.courseproject.carrentalsystem.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TelemetryState {
    @Id
    private String orderId;
    private String carName;
    private boolean locked;
    private boolean climateOn;
    private int temperature; // in Fahrenheit e.g. 70
    private int batteryLevel; // in percent e.g. 94
    private String status; // "ONLINE"
}
