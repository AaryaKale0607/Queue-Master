package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.BranchService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchServiceRepository extends JpaRepository<BranchService, Long> {

    // ← THIS IS THE CORRECT METHOD (with underscore)
    Optional<BranchService> findByIdAndBranch_Id(Long serviceId, Long branchId);

    // For listing services by branch (used in MainService)
    List<BranchService> findByBranch_Id(Long branchId);
}