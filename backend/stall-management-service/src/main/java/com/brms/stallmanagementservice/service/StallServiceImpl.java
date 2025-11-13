package com.brms.stallmanagementservice.service;

import com.brms.stallmanagementservice.dto.StallFilter;
import com.brms.stallmanagementservice.dto.StallRequest;
import com.brms.stallmanagementservice.dto.StallResponse;
import com.brms.stallmanagementservice.entity.Hall;
import com.brms.stallmanagementservice.entity.Stall;
import com.brms.stallmanagementservice.entity.StallAmenity;
import com.brms.stallmanagementservice.enums.StallStatus;
import com.brms.stallmanagementservice.repository.HallRepository;
import com.brms.stallmanagementservice.repository.StallAmenityRepository;
import com.brms.stallmanagementservice.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StallServiceImpl implements StallService {

    private final StallRepository stallRepository;
    private final HallRepository hallRepository;
    private final StallAmenityRepository amenityRepository;
    private final ModelMapper mapper;

    @Override
    public StallResponse create(StallRequest req) {
        log.info("Creating stall code={} hallId={}", req.code(), req.hallId());
        Hall hall = hallRepository.findById(req.hallId())
                .orElseThrow(() -> new NoSuchElementException("Hall not found: " + req.hallId()));

        Stall entity = new Stall();
        applyRequest(entity, req, hall);

        Stall saved = stallRepository.save(entity);
        log.debug("Created stall id={}", saved.getId());
        return toResponse(saved);
    }

    @Override
    public StallResponse update(Long id, StallRequest req) {
        log.info("Updating stall id={}", id);
        Stall entity = stallRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Stall not found: " + id));

        Hall hall = (req.hallId() != null && (entity.getHall() == null ||
                !req.hallId().equals(entity.getHall().getId())))
                ? hallRepository.findById(req.hallId())
                .orElseThrow(() -> new NoSuchElementException("Hall not found: " + req.hallId()))
                : entity.getHall();

        applyRequest(entity, req, hall);

        Stall saved = stallRepository.save(entity);
        log.debug("Updated stall id={}", saved.getId());
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StallResponse get(Long id) {
        return stallRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Stall not found: " + id));
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting stall id={}", id);
        if (!stallRepository.existsById(id)) {
            throw new NoSuchElementException("Stall not found: " + id);
        }
        stallRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StallResponse> search(StallFilter filter, Pageable pageable) {
        if (filter == null) {
            log.info("Searching stalls with no filter (all), page={}", pageable);
            return stallRepository.findAll(pageable).map(this::toResponse);
        }

        log.info("Searching stalls with filter={}, page={}", filter, pageable);
        Specification<Stall> spec = (root, q, cb) -> {
            List<Predicate> ps = new ArrayList<>();

            if (filter.hallId() != null) {
                ps.add(cb.equal(root.get("hall").get("id"), filter.hallId()));
            }
            if (filter.hallCode() != null && !filter.hallCode().isBlank()) {
                ps.add(cb.equal(root.get("hall").get("code"), filter.hallCode()));
            }
            if (filter.size() != null) {
                ps.add(cb.equal(root.get("size"), filter.size()));
            }
            if (filter.status() != null) {
                ps.add(cb.equal(root.get("status"), filter.status()));
            }
            if (filter.codeLike() != null && !filter.codeLike().isBlank()) {
                ps.add(cb.like(cb.lower(root.get("code")), "%" + filter.codeLike().toLowerCase() + "%"));
            }
            if (filter.minArea() != null) {
                ps.add(cb.greaterThanOrEqualTo(root.get("areaSqM"), filter.minArea()));
            }
            if (filter.maxArea() != null) {
                ps.add(cb.lessThanOrEqualTo(root.get("areaSqM"), filter.maxArea()));
            }
            return cb.and(ps.toArray(new Predicate[0]));
        };

        return stallRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Override
    public StallResponse changeStatus(Long id, StallStatus newStatus, String reason, String changedBy) {
        log.info("Changing stall status id={} -> {} (by {})", id, newStatus, changedBy);
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Stall not found: " + id));

        StallStatus old = stall.getStatus();
        stall.setStatus(newStatus);

        Stall saved = stallRepository.save(stall);
        log.debug("Changed stall status id={} : {} -> {}", saved.getId(), old, newStatus);

        return toResponse(saved);
    }

    /* ---------- helpers ---------- */

    private void applyRequest(Stall entity, StallRequest req, Hall hall) {
        mapper.map(req, entity);
        entity.setHall(hall);

        if (req.amenityIds() != null) {
            var amenities = amenityRepository.findByIdIn(req.amenityIds());
            entity.getAmenities().clear();
            entity.getAmenities().addAll(amenities);
        }
        if (entity.getStatus() == null) entity.setStatus(StallStatus.AVAILABLE);
    }

    private StallResponse toResponse(Stall s) {
        var amenityNames = s.getAmenities().stream()
                .map(StallAmenity::getName)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        return new StallResponse(
                s.getId(),
                s.getHall() != null ? s.getHall().getId() : null,
                s.getHall() != null ? s.getHall().getCode() : null,
                s.getCode(),
                s.getSize(),
                s.getStatus(),
                s.getWidthMeters(),
                s.getDepthMeters(),
                s.getAreaSqM(),
                s.getBasePrice(),
                s.getMapX(), s.getMapY(), s.getMapWidth(), s.getMapHeight(),
                amenityNames,
                s.getCreatedAt(),
                s.getUpdatedAt()
        );
    }
}
