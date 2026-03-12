package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    // This method is used in MainService
    List<Branch> findByCategory_Id(Long categoryId);

    // Optional useful methods (add if you need them)
    List<Branch> findByCategory_IdAndStatus(Long categoryId, String status);
    List<Branch> findByNameContainingIgnoreCase(String name);
    List<Branch> findByLocationContainingIgnoreCase(String location);
}