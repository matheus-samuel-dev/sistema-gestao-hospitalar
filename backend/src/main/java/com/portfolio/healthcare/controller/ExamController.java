package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.ClinicalDtos.ExamRequest;
import com.portfolio.healthcare.dto.ClinicalDtos.ExamResponse;
import com.portfolio.healthcare.service.ExamService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@Tag(name = "Exames")
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public List<ExamResponse> list() {
        return examService.list();
    }

    @PostMapping
    public ExamResponse create(@Valid @RequestBody ExamRequest request) {
        return examService.create(request);
    }

    @PutMapping("/{id}")
    public ExamResponse update(@PathVariable UUID id, @Valid @RequestBody ExamRequest request) {
        return examService.update(id, request);
    }
}
