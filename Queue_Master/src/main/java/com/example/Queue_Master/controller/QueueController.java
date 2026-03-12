//package com.example.Queue_Master.controller;
//
//import com.example.Queue_Master.entity.Token;
//import com.example.Queue_Master.repository.TokenRepository;
//
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/queue")
//@CrossOrigin
//public class QueueController {
//
//    private final TokenRepository tokenRepository;
//
//    public QueueController(TokenRepository tokenRepository) {
//        this.tokenRepository = tokenRepository;
//    }
//
//    // Get all tokens for a doctor queue
//    @GetMapping("/{doctorId}")
//    public List<Token> getQueue(@PathVariable Long doctorId) {
//        return tokenRepository.findByDoctorIdOrderByTokenNumberAsc(doctorId);
//    }
//}










//
//package com.example.Queue_Master.controller;
//
//import com.example.Queue_Master.entity.Token;
//import com.example.Queue_Master.repository.TokenRepository;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/queue")
//@CrossOrigin(origins = "*")
//public class QueueController {
//
//    private final TokenRepository tokenRepository;
//
//    public QueueController(TokenRepository tokenRepository) {
//        this.tokenRepository = tokenRepository;
//    }
//
//    /**
//     * Get public queue status for a specific service (doctor or counter).
//     * Shows token numbers, status, and estimated wait time (no user details for privacy).
//     * Accessible to all users – useful for seeing current queue length.
//     */
//    @GetMapping("/service/{branchServiceId}")
//    public ResponseEntity<QueueStatusResponse> getServiceQueue(@PathVariable Long branchServiceId) {
//        List<Token> tokens = tokenRepository.findByBranchServiceIdOrderByTokenNumberAsc(branchServiceId);
//
//        // Filter to only BOOKED tokens and anonymize (no userId)
//        List<QueueToken> publicTokens = tokens.stream()
//                .filter(t -> "BOOKED".equals(t.getStatus()))
//                .map(t -> new QueueToken(t.getTokenNumber(), t.getStatus(), t.getEstimatedWaitTime()))
//                .collect(Collectors.toList());
//
//        int currentQueueLength = publicTokens.size();
//        int estimatedWait = currentQueueLength > 0 ? publicTokens.get(publicTokens.size() - 1).getEstimatedWaitTime() : 0;
//
//        QueueStatusResponse response = new QueueStatusResponse(
//                branchServiceId,
//                currentQueueLength,
//                estimatedWait,
//                publicTokens
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Get queue status for a specific doctor (backward compatibility + doctor-specific).
//     * Similar to service queue but filtered by doctorId.
//     */
//    @GetMapping("/{doctorId}")
//    public ResponseEntity<QueueStatusResponse> getDoctorQueue(@PathVariable Long doctorId) {
//        List<Token> tokens = tokenRepository.findByDoctorIdOrderByTokenNumberAsc(doctorId);
//
//        List<QueueToken> publicTokens = tokens.stream()
//                .filter(t -> "BOOKED".equals(t.getStatus()))
//                .map(t -> new QueueToken(t.getTokenNumber(), t.getStatus(), t.getEstimatedWaitTime()))
//                .collect(Collectors.toList());
//
//        int currentQueueLength = publicTokens.size();
//        int estimatedWait = currentQueueLength > 0 ? publicTokens.get(publicTokens.size() - 1).getEstimatedWaitTime() : 0;
//
//        QueueStatusResponse response = new QueueStatusResponse(
//                doctorId,
//                currentQueueLength,
//                estimatedWait,
//                publicTokens
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Get user's personal queue status (only their tokens across all services).
//     * Shows user's position in each queue (private – requires userId, ideally from auth).
//     * Other users cannot see this.
//     */
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<UserQueueStatus>> getUserQueues(@PathVariable Long userId) {
//        List<Token> userTokens = tokenRepository.findByUserId(userId);
//
//        // Group by service and calculate position
//        Map<Long, UserQueueStatus> queues = userTokens.stream()
//                .collect(Collectors.groupingBy(
//                        Token::getBranchServiceId,
//                        Collectors.collectingAndThen(
//                                Collectors.toList(),
//                                tokens -> {
//                                    // Get full queue for this service
//                                    List<Token> fullQueue = tokenRepository.findByBranchServiceIdOrderByTokenNumberAsc(tokens.get(0).getBranchServiceId());
//                                    int userPosition = fullQueue.stream()
//                                            .map(Token::getTokenNumber)
//                                            .sorted()
//                                            .collect(Collectors.toList())
//                                            .indexOf(tokens.get(0).getTokenNumber()) + 1;  // 1-based position
//
//                                    return new UserQueueStatus(
//                                            tokens.get(0).getBranchServiceId(),
//                                            userPosition,
//                                            tokens.get(0).getTokenNumber(),
//                                            tokens.get(0).getStatus(),
//                                            tokens.get(0).getEstimatedWaitTime()
//                                    );
//                                }
//                        )
//                ));
//
//        return ResponseEntity.ok(queues.values().stream().collect(Collectors.toList()));
//    }
//
//    // Helper classes for responses (anonymized for privacy)
//    public static class QueueStatusResponse {
//        private Long serviceId;
//        private int queueLength;
//        private int estimatedWaitMinutes;
//        private List<QueueToken> tokens;
//
//        public QueueStatusResponse(Long serviceId, int queueLength, int estimatedWaitMinutes, List<QueueToken> tokens) {
//            this.serviceId = serviceId;
//            this.queueLength = queueLength;
//            this.estimatedWaitMinutes = estimatedWaitMinutes;
//            this.tokens = tokens;
//        }
//
//        // Getters & Setters
//        public Long getServiceId() { return serviceId; }
//        public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
//        public int getQueueLength() { return queueLength; }
//        public void setQueueLength(int queueLength) { this.queueLength = queueLength; }
//        public int getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
//        public void setEstimatedWaitMinutes(int estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; }
//        public List<QueueToken> getTokens() { return tokens; }
//        public void setTokens(List<QueueToken> tokens) { this.tokens = tokens; }
//    }
//
//    public static class QueueToken {
//        private Integer tokenNumber;
//        private String status;
//        private Integer estimatedWaitTime;
//
//        public QueueToken(Integer tokenNumber, String status, Integer estimatedWaitTime) {
//            this.tokenNumber = tokenNumber;
//            this.status = status;
//            this.estimatedWaitTime = estimatedWaitTime;
//        }
//
//        // Getters & Setters
//        public Integer getTokenNumber() { return tokenNumber; }
//        public void setTokenNumber(Integer tokenNumber) { this.tokenNumber = tokenNumber; }
//        public String getStatus() { return status; }
//        public void setStatus(String status) { this.status = status; }
//        public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
//        public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }
//    }
//
//    public static class UserQueueStatus {
//        private Long serviceId;
//        private int userPosition;  // e.g., "You are #3 in queue"
//        private Integer tokenNumber;
//        private String status;
//        private Integer estimatedWaitTime;
//
//        public UserQueueStatus(Long serviceId, int userPosition, Integer tokenNumber, String status, Integer estimatedWaitTime) {
//            this.serviceId = serviceId;
//            this.userPosition = userPosition;
//            this.tokenNumber = tokenNumber;
//            this.status = status;
//            this.estimatedWaitTime = estimatedWaitTime;
//        }
//
//        // Getters & Setters
//        public Long getServiceId() { return serviceId; }
//        public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
//        public int getUserPosition() { return userPosition; }
//        public void setUserPosition(int userPosition) { this.userPosition = userPosition; }
//        public Integer getTokenNumber() { return tokenNumber; }
//        public void setTokenNumber(Integer tokenNumber) { this.tokenNumber = tokenNumber; }
//        public String getStatus() { return status; }
//        public void setStatus(String status) { this.status = status; }
//        public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
//        public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }
//    }
//}