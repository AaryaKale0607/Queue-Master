
package com.example.Queue_Master.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "branch_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor   // ← added (useful when creating objects manually)
@Builder              // ← added (very convenient + matches your other entities)
@ToString(exclude = {"branch"})   // ← prevents infinite recursion in logs
@EqualsAndHashCode(exclude = {"branch"})
public class BranchService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String counter;     // e.g. "Counter 1", "Desk A"

    private String timing;      // e.g. "10:00 AM - 04:00 PM"

    private String status;      // e.g. "Available", "Closed"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    // ────────────────────────────────────────────────
    // Crucial field needed by TokenBookingService
    // ────────────────────────────────────────────────
    @Column(name = "avg_service_time_minutes")
    private Integer avgServiceTimeMinutes;   // e.g. 10, 12, 15 minutes per token

    // If you want to add more real-world fields later:
    // private Integer maxTokensPerDay;
    // private Boolean requiresDoctor;
    // private String serviceType; // "COUNTER", "CONSULTATION", "BOOKING"
}