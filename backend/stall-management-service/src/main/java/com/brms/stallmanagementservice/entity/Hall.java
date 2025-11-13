package com.brms.stallmanagementservice.entity;

import com.brms.stallmanagementservice.enums.HallStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "hall", indexes = {
        @Index(name = "ix_hall_code", columnList = "code", unique = true),
        @Index(name = "ix_hall_status", columnList = "status")
})
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 16, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private HallStatus status;

    @Column(length = 512)
    private String mapImageUrl;

    @OneToMany(mappedBy = "hall", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Stall> stalls = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) this.status = HallStatus.ACTIVE;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
