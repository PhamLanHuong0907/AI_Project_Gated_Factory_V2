package com.pas.backend.repository;

import com.pas.backend.entity.ConfigQr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConfigQrRepository extends JpaRepository<ConfigQr, UUID> {

    Optional<ConfigQr> findFirstByIsActiveTrue();
}
