package com.pas.backend.service;

import com.pas.backend.dto.salary.*;
import com.pas.backend.entity.*;
import com.pas.backend.exception.BadRequestException;
import com.pas.backend.exception.ResourceNotFoundException;
import com.pas.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalaryConfigService {

    private final SalaryPositionRepository salaryPositionRepository;
    private final SalaryExperienceRepository salaryExperienceRepository;
    private final SalaryPenaltyRepository salaryPenaltyRepository;
    private final SalaryBonusRepository salaryBonusRepository;
    private final EmpSalaryPositionRepository empSalaryPositionRepository;
    private final EmpSalaryExperienceRepository empSalaryExperienceRepository;
    private final EmpSalaryBonusRepository empSalaryBonusRepository;
    private final EmpSalaryPenaltyRepository empSalaryPenaltyRepository;
    private final ConfigSalaryRepository configSalaryRepository;
    private final UserRepository userRepository;

    // ========== Positions ==========

    public List<SalaryPositionResponse> getAllPositions() {
        return salaryPositionRepository.findAll().stream()
                .map(this::toPositionResponse)
                .toList();
    }

    @Transactional
    public SalaryPositionResponse createPosition(SalaryPositionRequest request) {
        salaryPositionRepository.findByName(request.getName()).ifPresent(p -> {
            throw new BadRequestException("Position name already exists: " + request.getName());
        });

        SalaryPosition position = SalaryPosition.builder()
                .name(request.getName())
                .baseSalary(request.getBaseSalary())
                .description(request.getDescription())
                .isActive(request.getActive() != null ? request.getActive() : true)
                .build();

        if (request.getExperiences() != null) {
            List<SalaryPositionExperience> experiences = request.getExperiences().stream()
                    .map(dto -> SalaryPositionExperience.builder()
                            .position(position)
                            .name(dto.getName())
                            .minYears(dto.getMinYears())
                            .maxYears(dto.getMaxYears())
                            .salaryAmount(dto.getSalaryAmount())
                            .build())
                    .toList();
            position.setExperiences(new ArrayList<>(experiences));
        }

        return toPositionResponse(salaryPositionRepository.save(position));
    }

    @Transactional
    public SalaryPositionResponse updatePosition(UUID id, SalaryPositionRequest request) {
        SalaryPosition position = salaryPositionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary position not found with id: " + id));

        if (request.getName() != null)
            position.setName(request.getName());
        if (request.getBaseSalary() != null)
            position.setBaseSalary(request.getBaseSalary());
        if (request.getDescription() != null)
            position.setDescription(request.getDescription());
        if (request.getActive() != null)
            position.setIsActive(request.getActive());

        if (request.getExperiences() != null) {
            position.getExperiences().clear();
            List<SalaryPositionExperience> experiences = request.getExperiences().stream()
                    .map(dto -> SalaryPositionExperience.builder()
                            .position(position)
                            .name(dto.getName())
                            .minYears(dto.getMinYears())
                            .maxYears(dto.getMaxYears())
                            .salaryAmount(dto.getSalaryAmount())
                            .build())
                    .toList();
            position.getExperiences().addAll(experiences);
        }

        return toPositionResponse(salaryPositionRepository.save(position));
    }

    @Transactional
    public void deletePosition(UUID id) {
        if (!salaryPositionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Salary position not found with id: " + id);
        }
        salaryPositionRepository.deleteById(id);
    }

    // ========== Experience ==========

    public List<SalaryExperienceResponse> getAllExperience() {
        return salaryExperienceRepository.findAll().stream()
                .map(this::toExperienceResponse)
                .toList();
    }

    @Transactional
    public SalaryExperienceResponse createExperience(SalaryExperienceRequest request) {
        salaryExperienceRepository.findByName(request.getName()).ifPresent(e -> {
            throw new BadRequestException("Experience name already exists: " + request.getName());
        });

        SalaryExperience experience = SalaryExperience.builder()
                .name(request.getName())
                .percentage(request.getPercentage())
                .minYears(request.getMinYears())
                .maxYears(request.getMaxYears())
                .isActive(request.getActive() != null ? request.getActive() : true)
                .build();

        return toExperienceResponse(salaryExperienceRepository.save(experience));
    }

    @Transactional
    public SalaryExperienceResponse updateExperience(UUID id, SalaryExperienceRequest request) {
        SalaryExperience experience = salaryExperienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary experience not found with id: " + id));

        if (request.getName() != null)
            experience.setName(request.getName());
        if (request.getPercentage() != null)
            experience.setPercentage(request.getPercentage());
        if (request.getMinYears() != null)
            experience.setMinYears(request.getMinYears());
        if (request.getMaxYears() != null)
            experience.setMaxYears(request.getMaxYears());
        if (request.getActive() != null)
            experience.setIsActive(request.getActive());

        return toExperienceResponse(salaryExperienceRepository.save(experience));
    }

    @Transactional
    public void deleteExperience(UUID id) {
        if (!salaryExperienceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Salary experience not found with id: " + id);
        }
        salaryExperienceRepository.deleteById(id);
    }

    // ========== Penalties ==========

    public List<SalaryPenaltyResponse> getAllPenalties() {
        return salaryPenaltyRepository.findAll().stream()
                .map(this::toPenaltyResponse)
                .toList();
    }

    @Transactional
    public SalaryPenaltyResponse createPenalty(SalaryPenaltyRequest request) {
        salaryPenaltyRepository.findByName(request.getName()).ifPresent(p -> {
            throw new BadRequestException("Penalty name already exists: " + request.getName());
        });

        SalaryPenalty penalty = SalaryPenalty.builder()
                .name(request.getName())
                .penaltyType(SalaryPenalty.PenaltyType.valueOf(request.getPenaltyType()))
                .amount(request.getAmount())
                .description(request.getDescription())
                .isActive(request.getActive() != null ? request.getActive() : true)
                .build();

        return toPenaltyResponse(salaryPenaltyRepository.save(penalty));
    }

    @Transactional
    public SalaryPenaltyResponse updatePenalty(UUID id, SalaryPenaltyRequest request) {
        SalaryPenalty penalty = salaryPenaltyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary penalty not found with id: " + id));

        if (request.getName() != null)
            penalty.setName(request.getName());
        if (request.getPenaltyType() != null) {
            penalty.setPenaltyType(SalaryPenalty.PenaltyType.valueOf(request.getPenaltyType()));
        }
        if (request.getAmount() != null)
            penalty.setAmount(request.getAmount());
        if (request.getDescription() != null)
            penalty.setDescription(request.getDescription());
        if (request.getActive() != null)
            penalty.setIsActive(request.getActive());

        return toPenaltyResponse(salaryPenaltyRepository.save(penalty));
    }

    @Transactional
    public void deletePenalty(UUID id) {
        if (!salaryPenaltyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Salary penalty not found with id: " + id);
        }
        salaryPenaltyRepository.deleteById(id);
    }

    // ========== Bonus ==========

    public List<SalaryBonusResponse> getAllBonus() {
        return salaryBonusRepository.findAll().stream()
                .map(this::toBonusResponse)
                .toList();
    }

    @Transactional
    public SalaryBonusResponse createBonus(SalaryBonusRequest request) {
        salaryBonusRepository.findByName(request.getName()).ifPresent(b -> {
            throw new BadRequestException("Bonus name already exists: " + request.getName());
        });

        SalaryBonus bonus = SalaryBonus.builder()
                .name(request.getName())
                .bonusType(SalaryBonus.BonusType.valueOf(request.getBonusType()))
                .amount(request.getAmount())
                .description(request.getDescription())
                .isActive(request.getActive() != null ? request.getActive() : true)
                .build();

        return toBonusResponse(salaryBonusRepository.save(bonus));
    }

    @Transactional
    public SalaryBonusResponse updateBonus(UUID id, SalaryBonusRequest request) {
        SalaryBonus bonus = salaryBonusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary bonus not found with id: " + id));

        if (request.getName() != null)
            bonus.setName(request.getName());
        if (request.getBonusType() != null) {
            bonus.setBonusType(SalaryBonus.BonusType.valueOf(request.getBonusType()));
        }
        if (request.getAmount() != null)
            bonus.setAmount(request.getAmount());
        if (request.getDescription() != null)
            bonus.setDescription(request.getDescription());
        if (request.getActive() != null)
            bonus.setIsActive(request.getActive());

        return toBonusResponse(salaryBonusRepository.save(bonus));
    }

    @Transactional
    public void deleteBonus(UUID id) {
        if (!salaryBonusRepository.existsById(id)) {
            throw new ResourceNotFoundException("Salary bonus not found with id: " + id);
        }
        salaryBonusRepository.deleteById(id);
    }

    // ========== Assign / Unassign ==========

    @Transactional
    public void assignPosition(SalaryAssignRequest request) {
        userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        salaryPositionRepository.findById(request.getConfigId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Salary position not found with id: " + request.getConfigId()));

        List<EmpSalaryPosition> existing = empSalaryPositionRepository.findByUserId(request.getUserId());
        boolean alreadyAssigned = existing.stream()
                .anyMatch(e -> e.getPositionId().equals(request.getConfigId()));
        if (alreadyAssigned) {
            throw new BadRequestException("Position already assigned to this employee");
        }

        EmpSalaryPosition empSalaryPosition = EmpSalaryPosition.builder()
                .userId(request.getUserId())
                .positionId(request.getConfigId())
                .assignedAt(OffsetDateTime.now())
                .build();
        empSalaryPositionRepository.save(empSalaryPosition);
    }

    @Transactional
    public void unassignPosition(SalaryAssignRequest request) {
        empSalaryPositionRepository.deleteByUserIdAndPositionId(request.getUserId(), request.getConfigId());
    }

    @Transactional
    public void assignExperience(SalaryAssignRequest request) {
        userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        salaryExperienceRepository.findById(request.getConfigId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Salary experience not found with id: " + request.getConfigId()));

        List<EmpSalaryExperience> existing = empSalaryExperienceRepository.findByUserId(request.getUserId());
        boolean alreadyAssigned = existing.stream()
                .anyMatch(e -> e.getExperienceId().equals(request.getConfigId()));
        if (alreadyAssigned) {
            throw new BadRequestException("Experience already assigned to this employee");
        }

        EmpSalaryExperience empSalaryExperience = EmpSalaryExperience.builder()
                .userId(request.getUserId())
                .experienceId(request.getConfigId())
                .assignedAt(OffsetDateTime.now())
                .build();
        empSalaryExperienceRepository.save(empSalaryExperience);
    }

    @Transactional
    public void unassignExperience(SalaryAssignRequest request) {
        empSalaryExperienceRepository.deleteByUserIdAndExperienceId(request.getUserId(), request.getConfigId());
    }

    @Transactional
    public void assignBonus(SalaryAssignRequest request) {
        userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        salaryBonusRepository.findById(request.getConfigId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Salary bonus not found with id: " + request.getConfigId()));

        List<EmpSalaryBonus> existing = empSalaryBonusRepository.findByUserId(request.getUserId());
        boolean alreadyAssigned = existing.stream()
                .anyMatch(e -> e.getBonusId().equals(request.getConfigId()));
        if (alreadyAssigned) {
            throw new BadRequestException("Bonus already assigned to this employee");
        }

        EmpSalaryBonus empSalaryBonus = EmpSalaryBonus.builder()
                .userId(request.getUserId())
                .bonusId(request.getConfigId())
                .assignedAt(OffsetDateTime.now())
                .build();
        empSalaryBonusRepository.save(empSalaryBonus);
    }

    @Transactional
    public void unassignBonus(SalaryAssignRequest request) {
        empSalaryBonusRepository.deleteByUserIdAndBonusId(request.getUserId(), request.getConfigId());
    }

    @Transactional
    public void assignPenalty(SalaryAssignRequest request) {
        userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        salaryPenaltyRepository.findById(request.getConfigId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Salary penalty not found with id: " + request.getConfigId()));

        List<EmpSalaryPenalty> existing = empSalaryPenaltyRepository.findByUserId(request.getUserId());
        boolean alreadyAssigned = existing.stream()
                .anyMatch(e -> e.getPenaltyId().equals(request.getConfigId()));
        if (alreadyAssigned) {
            throw new BadRequestException("Penalty already assigned to this employee");
        }

        EmpSalaryPenalty empSalaryPenalty = EmpSalaryPenalty.builder()
                .userId(request.getUserId())
                .penaltyId(request.getConfigId())
                .assignedAt(OffsetDateTime.now())
                .build();
        empSalaryPenaltyRepository.save(empSalaryPenalty);
    }

    @Transactional
    public void unassignPenalty(SalaryAssignRequest request) {
        empSalaryPenaltyRepository.deleteByUserIdAndPenaltyId(request.getUserId(), request.getConfigId());
    }

    // ========== Formula ==========

    public String getSalaryFormula() {
        List<ConfigSalary> configs = configSalaryRepository.findAll();
        if (configs.isEmpty()) {
            return "{BASE_SALARY} + {TOTAL_BONUS} - {TOTAL_PENALTY}";
        }
        return configs.get(configs.size() - 1).getFormula();
    }

    @Transactional
    public void updateSalaryFormula(String formula) {
        if (formula == null || formula.isBlank()) {
            throw new BadRequestException("Formula cannot be empty");
        }
        ConfigSalary config = new ConfigSalary();
        config.setFormula(formula);
        configSalaryRepository.save(config);
    }

    // ========== Employee Salary Detail ==========

    public EmployeeSalaryDetailResponse getEmployeeSalaryDetail(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        BigDecimal baseSalary = BigDecimal.ZERO;
        List<SalaryPositionResponse> positionResponses = new ArrayList<>();

        // Calculate current experience years
        float currentExperienceYears = (user.getInitialExperienceYears() != null ? user.getInitialExperienceYears()
                : 0f);
        if (user.getJoinDate() != null) {
            long daysSinceJoin = java.time.Duration.between(user.getJoinDate(), OffsetDateTime.now()).toDays();
            currentExperienceYears += (daysSinceJoin / 365.25f);
        }

        if (user.getPositionId() != null) {
            SalaryPosition pos = salaryPositionRepository.findById(user.getPositionId()).orElse(null);
            if (pos != null) {
                positionResponses.add(toPositionResponse(pos));
                BigDecimal matchingSalary = pos.getBaseSalary();
                if (pos.getExperiences() != null) {
                    for (SalaryPositionExperience exp : pos.getExperiences()) {
                        boolean meetsMin = exp.getMinYears() == null || currentExperienceYears >= exp.getMinYears();
                        boolean meetsMax = exp.getMaxYears() == null || currentExperienceYears < exp.getMaxYears();
                        if (meetsMin && meetsMax) {
                            matchingSalary = exp.getSalaryAmount();
                            break;
                        }
                    }
                }
                baseSalary = matchingSalary;
            }
        }

        List<SalaryBonusResponse> bonuses = empSalaryBonusRepository.findByUserId(userId).stream()
                .map(esb -> salaryBonusRepository.findById(esb.getBonusId())
                        .map(this::toBonusResponse).orElse(null))
                .filter(java.util.Objects::nonNull)
                .toList();

        List<SalaryPenaltyResponse> penalties = empSalaryPenaltyRepository.findByUserId(userId).stream()
                .map(esp -> salaryPenaltyRepository.findById(esp.getPenaltyId())
                        .map(this::toPenaltyResponse).orElse(null))
                .filter(java.util.Objects::nonNull)
                .toList();

        BigDecimal totalBonus = bonuses.stream()
                .map(SalaryBonusResponse::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPenalty = penalties.stream()
                .map(SalaryPenaltyResponse::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Dynamic calculation
        String rawFormula = getSalaryFormula();
        String spelFormula = rawFormula;
        Map<String, Object> vars = new HashMap<>();
        vars.put("BASE_SALARY", baseSalary.doubleValue());
        vars.put("TOTAL_BONUS", totalBonus.doubleValue());
        vars.put("TOTAL_PENALTY", totalPenalty.doubleValue());

        List<SalaryBonus> allBonuses = salaryBonusRepository.findAll();
        for (SalaryBonus b : allBonuses) {
            String code = "BONUS_" + b.getId().toString().replace("-", "_");
            double amount = bonuses.stream().anyMatch(eb -> eb.getId().equals(b.getId())) ? b.getAmount().doubleValue()
                    : 0.0;
            vars.put(code, amount);
            spelFormula = spelFormula.replace("{BONUS_" + b.getId() + "}", "#" + code);
        }

        List<SalaryPenalty> allPenalties = salaryPenaltyRepository.findAll();
        for (SalaryPenalty p : allPenalties) {
            String code = "PENALTY_" + p.getId().toString().replace("-", "_");
            double amount = penalties.stream().anyMatch(ep -> ep.getId().equals(p.getId()))
                    ? p.getAmount().doubleValue()
                    : 0.0;
            vars.put(code, amount);
            spelFormula = spelFormula.replace("{PENALTY_" + p.getId() + "}", "#" + code);
        }

        spelFormula = spelFormula.replace("{BASE_SALARY}", "#BASE_SALARY")
                .replace("{TOTAL_BONUS}", "#TOTAL_BONUS")
                .replace("{TOTAL_PENALTY}", "#TOTAL_PENALTY");

        BigDecimal calculatedSalary = BigDecimal.ZERO;
        try {
            ExpressionParser parser = new SpelExpressionParser();
            StandardEvaluationContext context = new StandardEvaluationContext();
            context.setVariables(vars);
            Number result = parser.parseExpression(spelFormula).getValue(context, Number.class);
            if (result != null) {
                calculatedSalary = BigDecimal.valueOf(result.doubleValue());
            }
        } catch (Exception e) {
            calculatedSalary = baseSalary.add(totalBonus).subtract(totalPenalty);
        }

        return EmployeeSalaryDetailResponse.builder()
                .userId(userId)
                .userName(user.getFullName())
                .baseSalary(baseSalary)
                .positions(positionResponses)
                .experiences(new ArrayList<>())
                .bonuses(bonuses)
                .penalties(penalties)
                .totalBaseSalary(baseSalary)
                .totalBonus(totalBonus)
                .totalPenalty(totalPenalty)
                .calculatedSalary(calculatedSalary)
                .build();
    }

    // ========== Mapping helpers ==========

    private SalaryPositionResponse toPositionResponse(SalaryPosition position) {
        SalaryPositionResponse response = new SalaryPositionResponse();
        response.setId(position.getId());
        response.setName(position.getName());
        response.setBaseSalary(position.getBaseSalary());
        response.setDescription(position.getDescription());
        response.setActive(position.getIsActive());
        response.setCreatedAt(position.getCreatedAt() != null
                ? position.getCreatedAt().toLocalDateTime()
                : null);
        response.setUpdatedAt(position.getUpdatedAt() != null
                ? position.getUpdatedAt().toLocalDateTime()
                : null);
        if (position.getExperiences() != null) {
            response.setExperiences(position.getExperiences().stream().map(e -> {
                SalaryPositionExperienceDto dto = new SalaryPositionExperienceDto();
                dto.setId(e.getId());
                dto.setName(e.getName());
                dto.setMinYears(e.getMinYears());
                dto.setMaxYears(e.getMaxYears());
                dto.setSalaryAmount(e.getSalaryAmount());
                return dto;
            }).toList());
        }
        return response;
    }

    private SalaryExperienceResponse toExperienceResponse(SalaryExperience experience) {
        SalaryExperienceResponse response = new SalaryExperienceResponse();
        response.setId(experience.getId());
        response.setName(experience.getName());
        response.setPercentage(experience.getPercentage());
        response.setMinYears(experience.getMinYears());
        response.setMaxYears(experience.getMaxYears());
        response.setActive(experience.getIsActive());
        response.setCreatedAt(experience.getCreatedAt() != null
                ? experience.getCreatedAt().toLocalDateTime()
                : null);
        response.setUpdatedAt(experience.getUpdatedAt() != null
                ? experience.getUpdatedAt().toLocalDateTime()
                : null);
        return response;
    }

    private SalaryPenaltyResponse toPenaltyResponse(SalaryPenalty penalty) {
        SalaryPenaltyResponse response = new SalaryPenaltyResponse();
        response.setId(penalty.getId());
        response.setName(penalty.getName());
        response.setPenaltyType(penalty.getPenaltyType().name());
        response.setAmount(penalty.getAmount());
        response.setDescription(penalty.getDescription());
        response.setActive(penalty.getIsActive());
        response.setCreatedAt(penalty.getCreatedAt() != null
                ? penalty.getCreatedAt().toLocalDateTime()
                : null);
        response.setUpdatedAt(penalty.getUpdatedAt() != null
                ? penalty.getUpdatedAt().toLocalDateTime()
                : null);
        return response;
    }

    private SalaryBonusResponse toBonusResponse(SalaryBonus bonus) {
        SalaryBonusResponse response = new SalaryBonusResponse();
        response.setId(bonus.getId());
        response.setName(bonus.getName());
        response.setBonusType(bonus.getBonusType().name());
        response.setAmount(bonus.getAmount());
        response.setDescription(bonus.getDescription());
        response.setActive(bonus.getIsActive());
        response.setCreatedAt(bonus.getCreatedAt() != null
                ? bonus.getCreatedAt().toLocalDateTime()
                : null);
        response.setUpdatedAt(bonus.getUpdatedAt() != null
                ? bonus.getUpdatedAt().toLocalDateTime()
                : null);
        return response;
    }

    public List<SalaryReportResponse> getSalaryReport(String month, UUID currentUserId, String role) {
        List<User> users = userRepository.findAll();
        
        if ("ROLE_EMPLOYEE".equals(role) || "EMPLOYEE".equals(role)) {
            users = users.stream().filter(u -> u.getId().equals(currentUserId)).toList();
        }

        return users.stream().map(user -> {
            EmployeeSalaryDetailResponse detail = getEmployeeSalaryDetail(user.getId());
            SalaryReportResponse report = new SalaryReportResponse();
            report.setUserId(user.getId());
            report.setFullName(user.getFullName());
            report.setEmployeeCode(user.getEmployeeCode());
            report.setPosition(detail.getPositions() != null && !detail.getPositions().isEmpty()
                    ? detail.getPositions().get(0).getName()
                    : "N/A");

            double baseSalary = detail.getBaseSalary() != null ? detail.getBaseSalary().doubleValue() : 0;
            double totalBonus = detail.getTotalBonus() != null ? detail.getTotalBonus().doubleValue() : 0;
            double totalPenalty = detail.getTotalPenalty() != null ? detail.getTotalPenalty().doubleValue() : 0;
            double netSalary = detail.getCalculatedSalary() != null ? detail.getCalculatedSalary().doubleValue() : 0;
            report.setBaseSalary(baseSalary);
            report.setExperienceBonus(0); // Legacy, set to 0 or remove from DTO
            report.setBonuses(totalBonus);
            report.setPenalties(totalPenalty);
            report.setNetSalary(netSalary);

            return report;
        }).toList();
    }
}