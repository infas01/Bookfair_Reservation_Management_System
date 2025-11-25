package com.brms.stallmanagementservice.controller;

import com.brms.stallmanagementservice.dto.HallFilter;
import com.brms.stallmanagementservice.dto.StallFilter;
import com.brms.stallmanagementservice.dto.StallRequest;
import com.brms.stallmanagementservice.dto.StallResponse;
import com.brms.stallmanagementservice.enums.StallSize;
import com.brms.stallmanagementservice.enums.StallStatus;
import com.brms.stallmanagementservice.service.StallService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stalls")
@RequiredArgsConstructor
public class StallController {

    private final StallService stallService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<StallResponse> create(@Validated @RequestBody StallRequest req) {
        return ResponseEntity.ok(stallService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<StallResponse> update(@PathVariable Long id,
                                                @Validated @RequestBody StallRequest req) {
        return ResponseEntity.ok(stallService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StallResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(stallService.get(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stallService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<StallResponse>> search(@RequestBody(required = false) StallFilter filter,
                                                      @RequestParam(value = "page", defaultValue = "0") int page,
                                                      @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return ResponseEntity.ok(stallService.search(filter, pageable));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<StallResponse> changeStatus(@PathVariable Long id,
                                                      @RequestParam StallStatus status,
                                                      @RequestParam(required = false) String reason,
                                                      @RequestParam(required = false) String changedBy) {
        return ResponseEntity.ok(stallService.changeStatus(id, status, reason, changedBy));
    }
}
