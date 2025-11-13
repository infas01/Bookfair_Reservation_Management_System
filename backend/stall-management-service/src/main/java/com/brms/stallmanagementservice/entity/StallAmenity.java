package com.brms.stallmanagementservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "stall_amenity", indexes = {
        @Index(name = "ix_stall_amenity_name", columnList = "name", unique = true)
})
public class StallAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String name; // e.g., "Power Outlet", "Corner", "Near Entrance"

    @ManyToMany(mappedBy = "amenities", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Stall> stalls = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
