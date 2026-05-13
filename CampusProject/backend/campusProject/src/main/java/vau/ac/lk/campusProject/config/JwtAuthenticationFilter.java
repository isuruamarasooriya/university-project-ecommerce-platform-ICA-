package vau.ac.lk.campusProject.config;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import vau.ac.lk.campusProject.util.JwtUtil;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getTokenFromRequest(request);
        try {
            if (token != null && jwtUtil.validateToken(token, jwtUtil.extractUsername(token))) {
                String email = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    email, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Ignore invalid token, let it continue unauthenticated
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}