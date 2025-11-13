package com.brms.stallmanagementservice.controller;

import com.brms.stallmanagementservice.dto.StallAmenityFilter;
import com.brms.stallmanagementservice.dto.StallAmenityRequest;
import com.brms.stallmanagementservice.dto.StallAmenityResponse;
import com.brms.stallmanagementservice.service.StallAmenityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
public class StallAmenityController {

    private final StallAmenityService amenityService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<StallAmenityResponse> create(@Validated @RequestBody StallAmenityRequest req) {
        return ResponseEntity.ok(amenityService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<StallAmenityResponse> update(@PathVariable Long id,
                                                       @Validated @RequestBody StallAmenityRequest req) {
        return ResponseEntity.ok(amenityService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StallAmenityResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(amenityService.get(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        amenityService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<StallAmenityResponse>> search(@RequestParam(required = false, name = "nameLike") String nameLike,
                                                             @RequestParam(value = "page", defaultValue = "0") int page,
                                                             @RequestParam(value = "size", defaultValue = "10") int size) {
        var filter = new StallAmenityFilter(nameLike);
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return ResponseEntity.ok(amenityService.search(filter, pageable));
    }
}
