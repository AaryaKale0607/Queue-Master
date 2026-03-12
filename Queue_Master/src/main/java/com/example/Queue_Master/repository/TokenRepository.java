

package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Token;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date")
    Optional<Integer> findMaxTokenNumberByDoctorAndDate(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date " +
            "  AND t.tokenNumber < :tokenNumber " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    int countActiveTokensAheadForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("tokenNumber") Integer tokenNumber);

    @Query("SELECT COUNT(t) > 0 FROM Token t " +
            "WHERE t.user.id = :userId " +
            "  AND t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    boolean existsActiveTokenForUserAndDoctor(
            @Param("userId") Long userId,
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
            "ORDER BY t.tokenNumber ASC")
    List<Token> findDoctorQueueForDate(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "WHERE t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date AND t.status = 'IN_PROGRESS'")
    Optional<Token> findCurrentlyServingForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "WHERE t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date AND t.status = 'BOOKED' " +
            "ORDER BY t.tokenNumber ASC LIMIT 1")
    Optional<Token> findNextTokenForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date")
    Optional<Integer> findMaxTokenNumberByBranchServiceAndDate(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date " +
            "  AND t.tokenNumber < :tokenNumber " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    int countActiveTokensAheadForBranchService(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("tokenNumber") Integer tokenNumber);

    @Query("SELECT COUNT(t) > 0 FROM Token t " +
            "WHERE t.user.id = :userId " +
            "  AND t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    boolean existsActiveTokenForUserAndBranchService(
            @Param("userId") Long userId,
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
            "ORDER BY t.tokenNumber ASC")
    List<Token> findBranchServiceQueueForDate(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date AND t.status = 'IN_PROGRESS'")
    Optional<Token> findCurrentlyServingForBranchService(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date AND t.status = 'BOOKED' " +
            "ORDER BY t.tokenNumber ASC LIMIT 1")
    Optional<Token> findNextTokenForBranchService(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "LEFT JOIN FETCH t.doctor " +
            "LEFT JOIN FETCH t.branchService " +
            "LEFT JOIN FETCH t.branch " +
            "WHERE t.user.id = :userId " +
            "ORDER BY t.bookingDate DESC, t.createdAt DESC")
    List<Token> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Token t " +
            "LEFT JOIN FETCH t.doctor " +
            "LEFT JOIN FETCH t.branchService " +
            "LEFT JOIN FETCH t.branch " +
            "WHERE t.user.id = :userId " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS') " +
            "  AND t.bookingDate >= :today " +
            "ORDER BY t.bookingDate ASC, t.tokenNumber ASC")
    List<Token> findActiveTokensByUserId(
            @Param("userId") Long userId,
            @Param("today") LocalDate today);

    @Query("SELECT t FROM Token t " +
            "JOIN FETCH t.user " +
            "JOIN FETCH t.branch " +
            "LEFT JOIN FETCH t.doctor " +
            "LEFT JOIN FETCH t.branchService " +
            "WHERE t.id = :tokenId")
    Optional<Token> findByIdWithDetails(@Param("tokenId") Long tokenId);
}