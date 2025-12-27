package com.example.demo.util.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class TableWhiteListProperties {

    private Set<String> allowedTables = new HashSet<>();
}