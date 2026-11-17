package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.model.TelemetryState;
import com.courseproject.carrentalsystem.repository.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TelemetryService {

    @Autowired
    private TelemetryRepository telemetryRepository;

    public TelemetryState getTelemetry(String orderId) {
        return telemetryRepository.findById(orderId).orElseGet(() -> {
            TelemetryState defaultState = new TelemetryState(
                    orderId,
                    "Vehicle",
                    false, // unlocked
                    true,  // climate on
                    70,    // 70F
                    94,    // 94%
                    "ONLINE"
            );
            return telemetryRepository.save(defaultState);
        });
    }

    public TelemetryState toggleLock(String orderId) {
        TelemetryState state = getTelemetry(orderId);
        state.setLocked(!state.isLocked());
        return telemetryRepository.save(state);
    }

    public TelemetryState toggleClimate(String orderId) {
        TelemetryState state = getTelemetry(orderId);
        state.setClimateOn(!state.isClimateOn());
        return telemetryRepository.save(state);
    }

    public TelemetryState updateTemperature(String orderId, int temperature) {
        TelemetryState state = getTelemetry(orderId);
        state.setTemperature(temperature);
        return telemetryRepository.save(state);
    }
}
