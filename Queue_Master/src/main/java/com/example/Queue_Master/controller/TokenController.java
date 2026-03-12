package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.QueueStatusResponse;
import com.example.Queue_Master.dto.TokenRequest;
import com.example.Queue_Master.dto.TokenResponse;
import com.example.Queue_Master.service.TokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tokens")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TokenController {

    private final TokenService tokenService;

    // POST /api/v1/tokens/book
    @PostMapping("/book")
    public ResponseEntity<TokenResponse> bookToken(
            @Valid @RequestBody TokenRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(tokenService.bookToken(request));
    }

    // DELETE /api/v1/tokens/{tokenId}/cancel?userId=5
    @DeleteMapping("/{tokenId}/cancel")
    public ResponseEntity<TokenResponse> cancelToken(
            @PathVariable Long tokenId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(tokenService.cancelToken(tokenId, userId));
    }

    // GET /api/v1/tokens/user/{userId}/active
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<TokenResponse>> getUserActiveTokens(
            @PathVariable Long userId) {
        return ResponseEntity.ok(tokenService.getUserActiveTokens(userId));
    }

    // GET /api/v1/tokens/user/{userId}/history
    @GetMapping("/user/{userId}/history")
    public ResponseEntity<List<TokenResponse>> getUserTokenHistory(
            @PathVariable Long userId) {
        return ResponseEntity.ok(tokenService.getUserTokenHistory(userId));
    }

    // GET /api/v1/tokens/doctor/{doctorId}/queue-status?date=2026-03-12
    @GetMapping("/doctor/{doctorId}/queue-status")
    public ResponseEntity<QueueStatusResponse> getDoctorQueueStatus(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(
                tokenService.getDoctorQueueStatus(doctorId, date));
    }

    // GET /api/v1/tokens/branch-service/{id}/queue-status?date=2026-03-12
    @GetMapping("/branch-service/{branchServiceId}/queue-status")
    public ResponseEntity<QueueStatusResponse> getBranchServiceQueueStatus(
            @PathVariable Long branchServiceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(
                tokenService.getBranchServiceQueueStatus(branchServiceId, date));
    }

    // POST /api/v1/tokens/doctor/{doctorId}/call-next?date=2026-03-12
    @PostMapping("/doctor/{doctorId}/call-next")
    public ResponseEntity<TokenResponse> callNextDoctorToken(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(
                tokenService.callNextDoctorToken(doctorId, date));
    }

    // POST /api/v1/tokens/branch-service/{id}/call-next?date=2026-03-12
    @PostMapping("/branch-service/{branchServiceId}/call-next")
    public ResponseEntity<TokenResponse> callNextBranchServiceToken(
            @PathVariable Long branchServiceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(
                tokenService.callNextBranchServiceToken(branchServiceId, date));
    }
}