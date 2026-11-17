package com.courseproject.carrentalsystem.controller;

import com.courseproject.carrentalsystem.model.TelemetryState;
import com.courseproject.carrentalsystem.service.TelemetryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/telemetry")
public class TelemetryController {

    @Autowired
    private TelemetryService telemetryService;

    @GetMapping("/{orderId}")
    public ResponseEntity<TelemetryState> getTelemetry(@PathVariable String orderId) {
        TelemetryState state = telemetryService.getTelemetry(orderId);
        return ResponseEntity.ok(state);
    }

    @PostMapping("/{orderId}/lock")
    public ResponseEntity<TelemetryState> toggleLock(@PathVariable String orderId) {
        TelemetryState updated = telemetryService.toggleLock(orderId);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{orderId}/climate")
    public ResponseEntity<TelemetryState> toggleClimate(@PathVariable String orderId) {
        TelemetryState updated = telemetryService.toggleClimate(orderId);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{orderId}/temperature")
    public ResponseEntity<TelemetryState> setTemperature(
            @PathVariable String orderId,
            @RequestParam int temp
    ) {
        TelemetryState updated = telemetryService.updateTemperature(orderId, temp);
        return ResponseEntity.ok(updated);
    }
}
