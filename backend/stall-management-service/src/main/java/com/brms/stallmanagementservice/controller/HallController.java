package com.brms.stallmanagementservice.controller;

import com.brms.stallmanagementservice.dto.HallFilter;
import com.brms.stallmanagementservice.dto.HallRequest;
import com.brms.stallmanagementservice.dto.HallResponse;
import com.brms.stallmanagementservice.dto.StallFilter;
import com.brms.stallmanagementservice.enums.HallStatus;
import com.brms.stallmanagementservice.service.HallService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/halls")
@RequiredArgsConstructor
public class HallController {

    private final HallService hallService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<HallResponse> create(@Validated @RequestBody HallRequest req) {
        return ResponseEntity.ok(hallService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<HallResponse> update(@PathVariable Long id,
                                               @Validated @RequestBody HallRequest req) {
        return ResponseEntity.ok(hallService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<HallResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(hallService.get(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        hallService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<HallResponse>> search(@RequestBody(required = false) HallFilter filter,
                                                     @RequestParam(value = "page", defaultValue = "0") int page,
                                                     @RequestParam(value = "size", defaultValue = "10") int size
                                                     ) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return ResponseEntity.ok(hallService.search(filter, pageable));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<HallResponse> changeStatus(@PathVariable Long id,
                                                     @RequestParam HallStatus status) {
        return ResponseEntity.ok(hallService.changeStatus(id, status));
    }
}
