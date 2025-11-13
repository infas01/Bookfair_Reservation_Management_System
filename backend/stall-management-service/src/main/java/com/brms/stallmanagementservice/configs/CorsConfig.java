package com.brms.stallmanagementservice.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Use exact origins or patterns (do NOT put paths here)
        // If you need both localhost ports, use patterns:
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "https://api.dev.payroll.graceconstruction.lk/"
        ));
        // If you prefer strict, replace the pattern with exact allowedOrigins(...)

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"
        ));
        config.setExposedHeaders(List.of("Authorization")); // optional
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply to everything
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
