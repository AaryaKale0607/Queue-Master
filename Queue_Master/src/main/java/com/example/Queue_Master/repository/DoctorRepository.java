
package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByIdAndBranch_Id(Long doctorId, Long branchId);

    List<Doctor> findByBranch_Id(Long branchId);                    // ← FIXED

    List<Doctor> findByBranch_IdAndStatus(Long branchId, String status);  // ← FIXED
}