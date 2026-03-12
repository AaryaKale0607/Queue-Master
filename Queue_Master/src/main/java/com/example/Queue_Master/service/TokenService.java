
package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.QueueStatusResponse;
import com.example.Queue_Master.dto.TokenRequest;
import com.example.Queue_Master.dto.TokenResponse;
import com.example.Queue_Master.entity.Branch;
import com.example.Queue_Master.entity.BranchService;
import com.example.Queue_Master.entity.Doctor;
import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.entity.Token.QueueType;
import com.example.Queue_Master.entity.Token.TokenStatus;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.exception.ResourceNotFoundException;
import com.example.Queue_Master.exception.TokenBookingException;
import com.example.Queue_Master.repository.BranchRepository;
import com.example.Queue_Master.repository.BranchServiceRepository;
import com.example.Queue_Master.repository.DoctorRepository;
import com.example.Queue_Master.repository.TokenRepository;
import com.example.Queue_Master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository         tokenRepository;
    private final UserRepository          userRepository;
    private final DoctorRepository        doctorRepository;
    private final BranchServiceRepository branchServiceRepository;
    private final BranchRepository        branchRepository;

    // ── BOOK TOKEN ───────────────────────────────────────────

    @Transactional
    public TokenResponse bookToken(TokenRequest request) {
        log.info("bookToken: queueType={}, userId={}, date={}",
                request.getQueueType(), request.getUserId(), request.getBookingDate());

        validateBookingDate(request.getBookingDate());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + request.getUserId()));

        return switch (request.getQueueType()) {
            case DOCTOR         -> bookDoctorToken(request, user);
            case BRANCH_SERVICE -> bookBranchServiceToken(request, user);
        };
    }

    // ── DOCTOR QUEUE ─────────────────────────────────────────

    @Transactional
    public TokenResponse bookDoctorToken(TokenRequest request, User user) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Doctor not found: " + request.getDoctorId()));

        if (!"Available".equalsIgnoreCase(doctor.getStatus())) {
            throw new TokenBookingException(
                    "Dr. " + doctor.getName() + " is not available.");
        }

        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserAndDoctor(
                user.getId(), doctor.getId(), request.getBookingDate());
        if (alreadyBooked) {
            throw new TokenBookingException(
                    "You already have an active token for Dr. " + doctor.getName()
                            + " on " + request.getBookingDate());
        }

        Branch branch     = doctor.getBranch();
        int nextNumber    = getNextDoctorTokenNumber(doctor.getId(), request.getBookingDate());
        String display    = buildDisplayToken("D", nextNumber);
        int tokensAhead   = nextNumber - 1;

        // FIX 1: avgConsultationTime is primitive int, cannot compare to null
        int avgTime       = doctor.getAvgConsultationTime() > 0
                ? doctor.getAvgConsultationTime() : 10;
        int estimatedWait = tokensAhead * avgTime;

        Token token = Token.builder()
                .tokenNumber(nextNumber)
                .displayToken(display)
                .bookingDate(request.getBookingDate())
                .status(TokenStatus.BOOKED)
                .queueType(QueueType.DOCTOR)
                .user(user)
                .doctor(doctor)
                .branch(branch)
                .estimatedWaitTimeMinutes(estimatedWait)
                .build();

        Token saved = tokenRepository.save(token);
        log.info("Doctor token saved: {}", display);
        return buildDoctorResponse(saved, tokensAhead);
    }

    // ── BRANCH SERVICE QUEUE ─────────────────────────────────

    @Transactional
    public TokenResponse bookBranchServiceToken(TokenRequest request, User user) {

        BranchService branchService = branchServiceRepository.findById(request.getBranchServiceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch service not found: " + request.getBranchServiceId()));

        if (!"Available".equalsIgnoreCase(branchService.getStatus())) {
            throw new TokenBookingException(
                    "Service '" + branchService.getName() + "' is unavailable.");
        }

        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserAndBranchService(
                user.getId(), branchService.getId(), request.getBookingDate());
        if (alreadyBooked) {
            throw new TokenBookingException(
                    "You already have an active token for '" + branchService.getName()
                            + "' on " + request.getBookingDate());
        }

        Branch branch     = branchService.getBranch();
        int nextNumber    = getNextBranchServiceTokenNumber(
                branchService.getId(), request.getBookingDate());
        String display    = buildDisplayToken("BS", nextNumber);
        int tokensAhead   = nextNumber - 1;
        int estimatedWait = tokensAhead * 10;

        Token token = Token.builder()
                .tokenNumber(nextNumber)
                .displayToken(display)
                .bookingDate(request.getBookingDate())
                .status(TokenStatus.BOOKED)
                .queueType(QueueType.BRANCH_SERVICE)
                .user(user)
                .branchService(branchService)
                .branch(branch)
                .estimatedWaitTimeMinutes(estimatedWait)
                .build();

        Token saved = tokenRepository.save(token);
        log.info("Branch service token saved: {}", display);
        return buildBranchServiceResponse(saved, tokensAhead);
    }

    // ── CANCEL ───────────────────────────────────────────────

    @Transactional
    public TokenResponse cancelToken(Long tokenId, Long userId) {

        Token token = tokenRepository.findByIdWithDetails(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Token not found: " + tokenId));

        if (!token.getUser().getId().equals(userId)) {
            throw new TokenBookingException("Not authorised to cancel this token.");
        }

        if (token.getStatus() != TokenStatus.BOOKED) {
            throw new TokenBookingException(
                    "Cannot cancel token with status: " + token.getStatus());
        }

        token.setStatus(TokenStatus.CANCELLED);
        Token saved = tokenRepository.save(token);

        return TokenResponse.builder()
                .tokenId(saved.getId())
                .displayToken(saved.getDisplayToken())
                .status(saved.getStatus())
                .bookingDate(saved.getBookingDate())
                .message("Token " + saved.getDisplayToken() + " cancelled successfully.")
                .build();
    }

    // ── STAFF: CALL NEXT ─────────────────────────────────────

    @Transactional
    public TokenResponse callNextDoctorToken(Long doctorId, LocalDate date) {
        tokenRepository.findCurrentlyServingForDoctor(doctorId, date)
                .ifPresent(this::completeToken);

        Token next = tokenRepository.findNextTokenForDoctor(doctorId, date)
                .orElseThrow(() -> new TokenBookingException(
                        "No more tokens in doctor queue for " + date));

        next.setStatus(TokenStatus.IN_PROGRESS);
        next.setServingStartedAt(LocalDateTime.now());
        Token saved = tokenRepository.save(next);

        Token full = tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved);
        return buildDoctorResponse(full, 0);
    }

    @Transactional
    public TokenResponse callNextBranchServiceToken(Long branchServiceId, LocalDate date) {
        tokenRepository.findCurrentlyServingForBranchService(branchServiceId, date)
                .ifPresent(this::completeToken);

        Token next = tokenRepository.findNextTokenForBranchService(branchServiceId, date)
                .orElseThrow(() -> new TokenBookingException(
                        "No more tokens in branch service queue for " + date));

        next.setStatus(TokenStatus.IN_PROGRESS);
        next.setServingStartedAt(LocalDateTime.now());
        Token saved = tokenRepository.save(next);

        Token full = tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved);
        return buildBranchServiceResponse(full, 0);
    }

    private void completeToken(Token token) {
        token.setStatus(TokenStatus.COMPLETED);
        token.setServingCompletedAt(LocalDateTime.now());
        if (token.getServingStartedAt() != null) {
            long actual = Duration.between(
                    token.getServingStartedAt(), LocalDateTime.now()).toMinutes();
            token.setActualWaitTimeMinutes((int) actual);
        }
        tokenRepository.save(token);
    }

    // ── QUEUE STATUS ─────────────────────────────────────────

    @Transactional(readOnly = true)
    public QueueStatusResponse getDoctorQueueStatus(Long doctorId, LocalDate date) {
        List<Token> queue = tokenRepository.findDoctorQueueForDate(doctorId, date);
        long waiting   = queue.stream().filter(t ->
                t.getStatus() == TokenStatus.BOOKED ||
                        t.getStatus() == TokenStatus.CALLED).count();
        long completed = queue.stream().filter(t ->
                t.getStatus() == TokenStatus.COMPLETED).count();
        String serving = tokenRepository.findCurrentlyServingForDoctor(doctorId, date)
                .map(Token::getDisplayToken).orElse("None");
        return QueueStatusResponse.builder()
                .totalTokens((long) queue.size())
                .waitingCount(waiting)
                .completedCount(completed)
                .currentlyServingToken(serving)
                .build();
    }

    @Transactional(readOnly = true)
    public QueueStatusResponse getBranchServiceQueueStatus(Long branchServiceId, LocalDate date) {
        List<Token> queue = tokenRepository.findBranchServiceQueueForDate(branchServiceId, date);
        long waiting   = queue.stream().filter(t ->
                t.getStatus() == TokenStatus.BOOKED ||
                        t.getStatus() == TokenStatus.CALLED).count();
        long completed = queue.stream().filter(t ->
                t.getStatus() == TokenStatus.COMPLETED).count();
        String serving = tokenRepository
                .findCurrentlyServingForBranchService(branchServiceId, date)
                .map(Token::getDisplayToken).orElse("None");
        return QueueStatusResponse.builder()
                .totalTokens((long) queue.size())
                .waitingCount(waiting)
                .completedCount(completed)
                .currentlyServingToken(serving)
                .build();
    }

    // ── USER HISTORY ─────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TokenResponse> getUserTokenHistory(Long userId) {
        return tokenRepository.findAllByUserId(userId)
                .stream().map(this::buildGenericResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TokenResponse> getUserActiveTokens(Long userId) {
        return tokenRepository.findActiveTokensByUserId(userId, LocalDate.now())
                .stream().map(this::buildGenericResponse).toList();
    }

    // ── TOKEN NUMBER GENERATION ──────────────────────────────

    private int getNextDoctorTokenNumber(Long doctorId, LocalDate date) {
        return tokenRepository.findMaxTokenNumberByDoctorAndDate(doctorId, date)
                .map(max -> max + 1).orElse(1);
    }

    private int getNextBranchServiceTokenNumber(Long branchServiceId, LocalDate date) {
        return tokenRepository.findMaxTokenNumberByBranchServiceAndDate(branchServiceId, date)
                .map(max -> max + 1).orElse(1);
    }

    // ── VALIDATION ───────────────────────────────────────────

    private void validateBookingDate(LocalDate bookingDate) {
        LocalDate today = LocalDate.now();
        if (bookingDate.isBefore(today)) {
            throw new TokenBookingException("Cannot book a token for a past date.");
        }
        if (bookingDate.isAfter(today.plusDays(7))) {
            throw new TokenBookingException("Advance booking limited to 7 days.");
        }
    }

    // ── HELPERS ──────────────────────────────────────────────

    private String buildDisplayToken(String prefix, int number) {
        return prefix + String.format("%03d", number);
    }

    private TokenResponse buildDoctorResponse(Token token, int queuePosition) {
        Doctor doctor = token.getDoctor();
        Branch branch = token.getBranch();
        User   user   = token.getUser();
        return TokenResponse.builder()
                .tokenId(token.getId())
                .displayToken(token.getDisplayToken())
                .tokenNumber(token.getTokenNumber())
                .queuePosition(queuePosition)
                .estimatedWaitTimeMinutes(token.getEstimatedWaitTimeMinutes())
                .queueType(token.getQueueType())
                .status(token.getStatus())
                .bookingDate(token.getBookingDate())
                .doctorId(doctor.getId())
                .doctorName(doctor.getName())
                .doctorSpecialization(doctor.getSpecialization())
                .doctorTiming(doctor.getTiming())
                .branchId(branch.getId())
                .branchName(branch.getName())
                .branchLocation(branch.getLocation())
                .userId(user.getId())
                // FIX 2 & 3: User entity uses getUsername() not getName()
                .userName(user.getUsername())
                .bookedAt(token.getCreatedAt())
                .message("Token booked! Your number is " + token.getDisplayToken()
                        + ". Estimated wait: " + token.getEstimatedWaitTimeMinutes() + " min.")
                .build();
    }

    private TokenResponse buildBranchServiceResponse(Token token, int queuePosition) {
        BranchService bs     = token.getBranchService();
        Branch        branch = token.getBranch();
        User          user   = token.getUser();
        return TokenResponse.builder()
                .tokenId(token.getId())
                .displayToken(token.getDisplayToken())
                .tokenNumber(token.getTokenNumber())
                .queuePosition(queuePosition)
                .estimatedWaitTimeMinutes(token.getEstimatedWaitTimeMinutes())
                .queueType(token.getQueueType())
                .status(token.getStatus())
                .bookingDate(token.getBookingDate())
                .branchServiceId(bs.getId())
                .branchServiceName(bs.getName())
                .branchServiceCounter(bs.getCounter())
                .branchServiceTiming(bs.getTiming())
                .branchId(branch.getId())
                .branchName(branch.getName())
                .branchLocation(branch.getLocation())
                .userId(user.getId())
                // FIX 2 & 3: User entity uses getUsername() not getName()
                .userName(user.getUsername())
                .bookedAt(token.getCreatedAt())
                .message("Token booked! Your number is " + token.getDisplayToken()
                        + ". Estimated wait: " + token.getEstimatedWaitTimeMinutes() + " min.")
                .build();
    }

    private TokenResponse buildGenericResponse(Token token) {
        if (token.getQueueType() == QueueType.DOCTOR) {
            int ahead = token.getDoctor() != null
                    ? tokenRepository.countActiveTokensAheadForDoctor(
                    token.getDoctor().getId(),
                    token.getBookingDate(),
                    token.getTokenNumber())
                    : 0;
            return buildDoctorResponse(token, ahead);
        } else {
            int ahead = token.getBranchService() != null
                    ? tokenRepository.countActiveTokensAheadForBranchService(
                    token.getBranchService().getId(),
                    token.getBookingDate(),
                    token.getTokenNumber())
                    : 0;
            return buildBranchServiceResponse(token, ahead);
        }
    }
}