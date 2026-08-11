package com.pas.backend.security;

import com.pas.backend.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Spring Security UserDetails implementation backed by the PAS User entity.
 * Bridges the domain model to the Spring Security authentication framework.
 */
public class UserDetailsImpl implements UserDetails {

    private final UUID id;
    private final String employeeCode;
    private final String email;
    private final String password;
    private final String role;
    private final Boolean active;

    public UserDetailsImpl(
            UUID id,
            String employeeCode,
            String email,
            String password,
            String role,
            Boolean active) {
        this.id = id;
        this.employeeCode = employeeCode;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = active;
    }

    /**
     * Create a UserDetailsImpl from a User entity.
     *
     * @param user the domain User entity
     * @return a fully populated UserDetailsImpl
     */
    public static UserDetailsImpl fromUser(User user) {
        return new UserDetailsImpl(
                user.getId(),
                user.getEmployeeCode(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getRole().name(),
                user.getIsActive()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(active);
    }

    public UUID getId() {
        return id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getRole() {
        return role;
    }

    public Boolean getActive() {
        return active;
    }
}
