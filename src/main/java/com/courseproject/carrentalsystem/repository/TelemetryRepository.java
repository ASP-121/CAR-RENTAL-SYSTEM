package com.courseproject.carrentalsystem.repository;

import com.courseproject.carrentalsystem.model.TelemetryState;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TelemetryRepository extends MongoRepository<TelemetryState, String> {
}
