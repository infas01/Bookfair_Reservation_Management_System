package com.brms.stallmanagementservice.service;

import com.brms.stallmanagementservice.dto.HallFilter;
import com.brms.stallmanagementservice.dto.HallRequest;
import com.brms.stallmanagementservice.dto.HallResponse;
import com.brms.stallmanagementservice.entity.Hall;
import com.brms.stallmanagementservice.enums.HallStatus;
import com.brms.stallmanagementservice.repository.HallRepository;
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
public class HallServiceImpl implements HallService {

    private final HallRepository hallRepository;
    private final ModelMapper mapper;

    @Override
    public HallResponse create(HallRequest req) {
        log.info("Creating hall code={}", req.code());
        Hall hall = new Hall();
        applyRequest(hall, req);
        Hall saved = hallRepository.save(hall);
        log.debug("Created hall id={}", saved.getId());
        return toResponse(saved);
    }

    @Override
    public HallResponse update(Long id, HallRequest req) {
        log.info("Updating hall id={}", id);
        Hall hall = hallRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Hall not found: " + id));
        applyRequest(hall, req);
        Hall saved = hallRepository.save(hall);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public HallResponse get(Long id) {
        return hallRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Hall not found: " + id));
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting hall id={}", id);
        if (!hallRepository.existsById(id)) {
            throw new NoSuchElementException("Hall not found: " + id);
        }
        hallRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HallResponse> search(HallFilter filter, Pageable pageable) {
        if (filter == null) {
            log.info("Searching halls (no filter), page={}", pageable);
            return hallRepository.findAll(pageable).map(this::toResponse);
        }

        log.info("Searching halls with filter={}, page={}", filter, pageable);
        Specification<Hall> spec = (root, q, cb) -> {
            List<Predicate> ps = new ArrayList<>();
            if (filter.code() != null && !filter.code().isBlank()) {
                ps.add(cb.equal(root.get("code"), filter.code()));
            }
            if (filter.status() != null) {
                ps.add(cb.equal(root.get("status"), filter.status()));
            }
            if (filter.nameLike() != null && !filter.nameLike().isBlank()) {
                ps.add(cb.like(cb.lower(root.get("name")), "%" + filter.nameLike().toLowerCase() + "%"));
            }
            return cb.and(ps.toArray(new Predicate[0]));
        };
        return hallRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Override
    public HallResponse changeStatus(Long id, HallStatus newStatus) {
        log.info("Changing hall status id={} -> {}", id, newStatus);
        Hall hall = hallRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Hall not found: " + id));
        hall.setStatus(newStatus);
        return toResponse(hallRepository.save(hall));
    }

    /* ------------ helpers ------------ */

    private void applyRequest(Hall hall, HallRequest req) {
        mapper.map(req, hall);
        if (hall.getStatus() == null) hall.setStatus(HallStatus.ACTIVE);
    }

    private HallResponse toResponse(Hall h) {
        return new HallResponse(
                h.getId(),
                h.getName(),
                h.getCode(),
                h.getStatus(),
                h.getMapImageUrl(),
                h.getCreatedAt(),
                h.getUpdatedAt()
        );
    }
}
