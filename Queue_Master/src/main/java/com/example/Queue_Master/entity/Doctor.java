

// Doctor.java (unchanged – already correct)
package com.example.Queue_Master.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialization;
    private String experience;
    private String timing;
    private double rating;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(name = "avg_consultation_time")
    private int avgConsultationTime;

    // Bidirectional helper methods (good practice)
    public void setBranch(Branch branch) {
        if (this.branch != null) {
            this.branch.getDoctors().remove(this);
        }
        this.branch = branch;
        if (branch != null && !branch.getDoctors().contains(this)) {
            branch.getDoctors().add(this);
        }
    }

    // This is useful for DTOs/serialization, but NOT used by Spring Data query methods
    public Long getBranchId() {
        return branch != null ? branch.getId() : null;
    }
}