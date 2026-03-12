package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.Token.QueueType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TokenRequest {

    @NotNull(message = "Queue type is required")
    private QueueType queueType;

    private Long doctorId;

    private Long branchServiceId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "User ID is required")
    private Long userId;
}