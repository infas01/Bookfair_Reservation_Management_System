//package com.example.stalls.security;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
//import org.springframework.security.oauth2.core.OAuth2TokenValidator;
//import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
//import org.springframework.security.oauth2.jwt.*;
//import org.springframework.security.oauth2.server.resource.authentication.*;
//import org.springframework.security.web.SecurityFilterChain;
//
//import javax.crypto.spec.SecretKeySpec;
//import java.nio.charset.StandardCharsets;
//import java.util.Collection;
//
//@Configuration
//@EnableMethodSecurity // enables @PreAuthorize, etc.
//public class SecurityConfig {
//
//    /* ===== JWT decoder for HS256 (shared secret) ===== */
//    @Bean
//    JwtDecoder jwtDecoder(
//            @Value("${security.jwt.secret}") String secret,
//            @Value("${security.jwt.issuer:}") String issuer,
//            @Value("${security.jwt.audience:}") String audience
//    ) {
//        var key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
//        var decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
//
//        // Optional validators: include only if you set 'iss' / 'aud' in tokens
//        OAuth2TokenValidator<Jwt> validator = new JwtTimestampValidator();
//        if (!issuer.isBlank()) {
//            validator = new DelegatingOAuth2TokenValidator<>(validator, JwtValidators.createDefaultWithIssuer(issuer));
//        }
//        if (!audience.isBlank()) {
//            var audValidator = new JwtClaimValidator<Collection<String>>("aud", aud -> aud != null && aud.contains(audience));
//            validator = new DelegatingOAuth2TokenValidator<>(validator, audValidator);
//        }
//        decoder.setJwtValidator(validator);
//        return decoder;
//    }
//
//    /* ===== Map token → authorities =====
//       - Roles in claim "roles": ["USER","EMPLOYEE","ADMIN"] → ROLE_USER / ROLE_EMPLOYEE / ROLE_ADMIN
//       - Scopes in "scope"/"scp" (optional): "stalls.read" → SCOPE_stalls.read
//    */
//    @Bean
//    JwtAuthenticationConverter jwtAuthConverter() {
//        var roles = new JwtGrantedAuthoritiesConverter();
//        roles.setAuthoritiesClaimName("roles");   // your UM service should put roles here
//        roles.setAuthorityPrefix("ROLE_");        // Spring expects ROLE_*
//
//        var scopes = new JwtGrantedAuthoritiesConverter(); // optional, if you also use scopes
//        scopes.setAuthoritiesClaimName("scope");           // or "scp"
//        scopes.setAuthorityPrefix("SCOPE_");
//
//        return jwt -> {
//            var a = roles.convert(jwt);
//            var b = scopes.convert(jwt);
//            var conv = new JwtAuthenticationConverter();
//            // Small trick: reuse Spring's converter but merge both sets
//            var merged = new java.util.HashSet<GrantedAuthority>();
//            if (a != null) merged.addAll(a);
//            if (b != null) merged.addAll(b);
//            return new JwtAuthenticationToken(jwt, merged);
//        };
//    }
//
//    /* ===== HTTP security ===== */
//    @Bean
//    SecurityFilterChain api(HttpSecurity http, JwtAuthenticationConverter jwtAuthConverter) throws Exception {
//        return http
//                .csrf(csrf -> csrf.disable())
//                .cors(Customizer.withDefaults())
//                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(reg -> reg
//                        .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
//                        .anyRequest().authenticated()
//                )
//                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter)))
//                .build();
//    }
//}
