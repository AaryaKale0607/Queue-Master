package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.BranchServiceDTO;
import com.example.Queue_Master.dto.DoctorDTO;
import com.example.Queue_Master.entity.Branch;
import com.example.Queue_Master.entity.ServiceCategory;
import com.example.Queue_Master.service.MainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MainController {

    private final MainService mainService;

    public MainController(MainService mainService) {
        this.mainService = mainService;
    }

    @GetMapping("/categories")
    public List<ServiceCategory> getCategories() {
        return mainService.getAllCategories();
    }

    @GetMapping("/branches/{categoryId}")
    public List<Branch> getBranches(@PathVariable Long categoryId) {
        return mainService.getBranchesByCategory(categoryId);
    }

    @GetMapping("/doctors/{branchId}")
    public List<DoctorDTO> getDoctorsByBranch(@PathVariable Long branchId) {
        return mainService.getDoctorsByBranch(branchId);
    }

    @GetMapping("/doctors/id/{doctorId}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long doctorId) {
        DoctorDTO doctor = mainService.getDoctorById(doctorId);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/branch-services/{branchId}")
    public List<BranchServiceDTO> getBranchServices(@PathVariable Long branchId) {
        return mainService.getBranchServicesByBranch(branchId);
    }
}
