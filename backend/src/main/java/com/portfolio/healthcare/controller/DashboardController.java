package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.DashboardDtos.DashboardResponse;
import com.portfolio.healthcare.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse overview() {
        return dashboardService.overview();
    }
}
