package com.pas.backend.repository;

import com.pas.backend.entity.ConfigGps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConfigGpsRepository extends JpaRepository<ConfigGps, UUID> {

    Optional<ConfigGps> findFirstByIsActiveTrue();
}
