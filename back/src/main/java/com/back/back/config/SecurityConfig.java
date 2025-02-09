package com.back.back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactivar CSRF (si no lo necesitas)
            .authorizeRequests(auth -> auth
                .requestMatchers("/**").permitAll()  // Permite el acceso a todas las rutas sin autenticación
            )
            .formLogin().disable();  // Desactiva la autenticación por formulario (si no la necesitas)
        return http.build();
    }
}
