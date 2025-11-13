package com.brms.stallmanagementservice.entity;

import com.brms.stallmanagementservice.enums.StallSize;
import com.brms.stallmanagementservice.enums.StallStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "stall", indexes = {
        @Index(name = "ix_stall_code", columnList = "code"),
        @Index(name = "ix_stall_hall", columnList = "hall_id"),
        @Index(name = "ix_stall_status", columnList = "status"),
        @Index(name = "ix_stall_size", columnList = "size")
})
public class Stall {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private Long id;

    // e.g., "A01", "B12"
    @Column(nullable = false, length = 16)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private StallSize size;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private StallStatus status;

    // Dimensions (optional)
    @Column(precision = 10, scale = 2)
    private BigDecimal widthMeters;

    @Column(precision = 10, scale = 2)
    private BigDecimal depthMeters;

    @Column(precision = 12, scale = 2)
    private BigDecimal areaSqM;

    // Pricing (optional)
    @Column(precision = 12, scale = 2)
    private BigDecimal basePrice;

    // Simple map geometry (optional): top-left X/Y and W/H (px or arbitrary units)
    private Integer mapX;
    private Integer mapY;
    private Integer mapWidth;
    private Integer mapHeight;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hall_id", nullable = false)
    private Hall hall;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "stall_amenity_link",
            joinColumns = @JoinColumn(name = "stall_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @Builder.Default
    private Set<StallAmenity> amenities = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) this.status = StallStatus.AVAILABLE;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
