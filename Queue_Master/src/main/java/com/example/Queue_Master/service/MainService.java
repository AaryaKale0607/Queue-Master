
package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.BranchServiceDTO;
import com.example.Queue_Master.dto.DoctorDTO;
import com.example.Queue_Master.entity.Branch;
import com.example.Queue_Master.entity.BranchService;
import com.example.Queue_Master.entity.Doctor;
import com.example.Queue_Master.entity.ServiceCategory;
import com.example.Queue_Master.exception.ResourceNotFoundException;
import com.example.Queue_Master.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MainService {

    private final ServiceCategoryRepository categoryRepository;
    private final BranchRepository branchRepository;
    private final DoctorRepository doctorRepository;
    private final BranchServiceRepository branchServiceRepository;

    public List<ServiceCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Branch> getBranchesByCategory(Long categoryId) {
        if (categoryId == null) return List.of();
        return branchRepository.findByCategory_Id(categoryId);
    }

    public List<DoctorDTO> getDoctorsByBranch(Long branchId) {
        if (branchId == null) return List.of();
        return doctorRepository.findByBranch_Id(branchId).stream()
                .map(this::toDoctorDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));
        return toDoctorDTO(doctor);
    }

    public List<BranchServiceDTO> getBranchServicesByBranch(Long branchId) {
        if (branchId == null) return List.of();
        return branchServiceRepository.findByBranch_Id(branchId).stream()   // ← FIXED HERE (was findByBranchId)
                .map(this::toBranchServiceDTO)
                .collect(Collectors.toList());
    }

    private DoctorDTO toDoctorDTO(Doctor doctor) {
        return new DoctorDTO(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getExperience(),
                doctor.getTiming(),
                doctor.getRating(),
                doctor.getStatus(),
                doctor.getAvgConsultationTime(),
                doctor.getBranch() != null ? doctor.getBranch().getId() : null,
                doctor.getBranch() != null ? doctor.getBranch().getName() : null
        );
    }

    private BranchServiceDTO toBranchServiceDTO(BranchService service) {
        return new BranchServiceDTO(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getCounter(),
                service.getTiming(),
                service.getStatus(),
                service.getBranch() != null ? service.getBranch().getId() : null,
                service.getBranch() != null ? service.getBranch().getName() : null
        );
    }
}