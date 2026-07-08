package com.portfolio.healthcare.dto;

import java.time.Instant;
import java.util.Map;

public final class CommonDtos {
    private CommonDtos() {
    }

    public record ApiError(
            Instant timestamp,
            int status,
            String error,
            String message,
            String path,
            Map<String, String> fields
    ) {
    }
}
