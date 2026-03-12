package com.example.Queue_Master.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QueueStatusResponse {
    private Long    totalTokens;
    private Long    waitingCount;
    private Long    completedCount;
    private String  currentlyServingToken;
    private Integer estimatedWaitForNextMinutes;
}