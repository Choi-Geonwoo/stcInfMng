package com.example.demo.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Aspect
@Component
public class LoggingAspect {

    // 컨트롤러, 서비스 등 메서드 실행 전
    @Before("execution(* com.example.demo..*Service.*(..))")
    public void beforeServiceMethod(JoinPoint joinPoint) {
        log.info("#############################################");
        log.info("# Before: " + joinPoint.getSignature());
        // 메서드 파라미터 가져오기
        Object[] args = joinPoint.getArgs();
        for (int i = 0; i < args.length; i++) {
            log.info("# Arg[" + i + "] = " + args[i]);
        }
        log.info("#############################################");
    }

    // 메서드 실행 후 반환값
    @AfterReturning(pointcut = "execution(* com.example.demo..*Service.*(..))", returning = "result")
    public void afterServiceMethod(JoinPoint joinPoint, Object result) {
        log.info("#############################################");
        log.info("# After: " + joinPoint.getSignature());
//        log.info("# Returned: " + result);
        if (result instanceof Map<?, ?> map) {
            // Map을 String/Object 타입으로 안전하게 캐스팅
            Map<String, Object> safeMap = new HashMap<>();
            map.forEach((k, v) -> safeMap.put(String.valueOf(k), v));
            // FILE_URL 최대 100글자만
            Object fileUrlValue = safeMap.get("FILE_URL");
            if (fileUrlValue != null) {
                String strFile = fileUrlValue.toString();
                int maxLength = 100;
                if (strFile.length() > maxLength) {
                    safeMap.put("FILE_URL", strFile.substring(0, maxLength));
                }
                log.info("# Returned: " + safeMap);
            } else {
                log.info("# Returned: " + result);
            }
        }
        log.info("#############################################");
    }

    @Before("execution(* com.example.demo..*Controller.*(..))")
    public void logControllerMethod(JoinPoint joinPoint) {
        // HttpServletRequest 가져오기
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        log.info("#############################################");
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            log.info("# Request URL: " + request.getRequestURL());
            log.info("# HTTP Method: " + request.getMethod());
        }

        // 컨트롤러 메서드 파라미터
        Object[] args = joinPoint.getArgs();
        for (int i = 0; i < args.length; i++) {
            log.info("# Param[" + i + "] = " + args[i]);
        }
        log.info("Controller Method: " + joinPoint.getSignature());
        log.info("#############################################");
    }
}
