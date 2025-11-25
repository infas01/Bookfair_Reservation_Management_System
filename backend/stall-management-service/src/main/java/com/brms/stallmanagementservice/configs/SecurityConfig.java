package com.brms.stallmanagementservice.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.HashSet;

@Configuration
@EnableMethodSecurity // enables @PreAuthorize in controllers/services
public class SecurityConfig {

    @Bean
    JwtDecoder jwtDecoder(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.issuer:}") String issuer,
            @Value("${jwt.audience:}") String audience
    ) {
        var key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        var decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();

        // Optional validations (only enable if your tokens include these claims)
        OAuth2TokenValidator<Jwt> validator = new JwtTimestampValidator();
        if (!issuer.isBlank()) {
            validator = new DelegatingOAuth2TokenValidator<>(validator, JwtValidators.createDefaultWithIssuer(issuer));
        }
        if (!audience.isBlank()) {
            var audValidator = new JwtClaimValidator<Collection<String>>("aud",
                    aud -> aud != null && aud.contains(audience));
            validator = new DelegatingOAuth2TokenValidator<>(validator, audValidator);
        }
        decoder.setJwtValidator(validator);
        return decoder;
    }

    @Bean
    JwtAuthenticationConverter jwtAuthConverter() {
        var roleConv = new org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter();
        roleConv.setAuthoritiesClaimName("roles");  // <— align with token format
        roleConv.setAuthorityPrefix("ROLE_");

        var scopeConv = new org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter();
        scopeConv.setAuthoritiesClaimName("scope"); // or "scp" if you use that
        scopeConv.setAuthorityPrefix("SCOPE_");

        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            var merged = new HashSet<GrantedAuthority>();
            Collection<GrantedAuthority> r = roleConv.convert(jwt);
            Collection<GrantedAuthority> s = scopeConv.convert(jwt);
            merged.addAll(r);
            merged.addAll(s);
            return merged;
        });
        return converter;
    }

    /* === HTTP security: stateless API; everything requires a valid token === */
    @Bean
    SecurityFilterChain api(HttpSecurity http, JwtAuthenticationConverter jwtAuthConverter) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(reg -> reg
                        .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter)))
                .build();
    }
}
