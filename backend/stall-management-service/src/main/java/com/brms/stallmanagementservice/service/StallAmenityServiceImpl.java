package com.brms.stallmanagementservice.service;

import com.brms.stallmanagementservice.dto.StallAmenityFilter;
import com.brms.stallmanagementservice.dto.StallAmenityRequest;
import com.brms.stallmanagementservice.dto.StallAmenityResponse;
import com.brms.stallmanagementservice.entity.StallAmenity;
import com.brms.stallmanagementservice.repository.StallAmenityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StallAmenityServiceImpl implements StallAmenityService {

    private final StallAmenityRepository amenityRepository;
    private final ModelMapper mapper;

    @Override
    public StallAmenityResponse create(StallAmenityRequest req) {
        log.info("Creating amenity name={}", req.name());
        StallAmenity entity = new StallAmenity();
        applyRequest(entity, req);
        var saved = amenityRepository.save(entity);
        log.debug("Created amenity id={}", saved.getId());
        return toResponse(saved);
    }

    @Override
    public StallAmenityResponse update(Long id, StallAmenityRequest req) {
        log.info("Updating amenity id={}", id);
        StallAmenity entity = amenityRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Amenity not found: " + id));
        applyRequest(entity, req);
        return toResponse(amenityRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public StallAmenityResponse get(Long id) {
        return amenityRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Amenity not found: " + id));
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting amenity id={}", id);
        if (!amenityRepository.existsById(id)) {
            throw new NoSuchElementException("Amenity not found: " + id);
        }
        amenityRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StallAmenityResponse> search(StallAmenityFilter filter, Pageable pageable) {
        if (filter == null) {
            log.info("Searching amenities (no filter), page={}", pageable);
            return amenityRepository.findAll(pageable).map(this::toResponse);
        }

        log.info("Searching amenities with filter={}, page={}", filter, pageable);
        Specification<StallAmenity> spec = (root, q, cb) -> {
            List<Predicate> ps = new ArrayList<>();
            if (filter.nameLike() != null && !filter.nameLike().isBlank()) {
                ps.add(cb.like(cb.lower(root.get("name")), "%" + filter.nameLike().toLowerCase() + "%"));
            }
            return cb.and(ps.toArray(new Predicate[0]));
        };
        return amenityRepository.findAll(spec, pageable).map(this::toResponse);
    }

    /* ------------ helpers ------------ */

    private void applyRequest(StallAmenity entity, StallAmenityRequest req) {
        mapper.map(req, entity);
    }

    private StallAmenityResponse toResponse(StallAmenity a) {
        return new StallAmenityResponse(
                a.getId(),
                a.getName(),
                a.getCreatedAt(),
                a.getUpdatedAt()
        );
    }
}
