package com.example.demo.util.config;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.*;
import java.time.LocalDateTime;

@Configuration
public class MyBatisConfig {

    @Bean
    public TypeHandler<LocalDateTime> oracleTimestampHandler() {

        return new BaseTypeHandler<LocalDateTime>() {

            @Override
            public void setNonNullParameter(PreparedStatement ps, int i,
                                            LocalDateTime parameter, JdbcType jdbcType) throws SQLException {
                ps.setObject(i, parameter);
            }

            @Override
            public LocalDateTime getNullableResult(ResultSet rs, String columnName) throws SQLException {
                Timestamp ts = rs.getTimestamp(columnName);
                return ts == null ? null : ts.toLocalDateTime();
            }

            @Override
            public LocalDateTime getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
                Timestamp ts = rs.getTimestamp(columnIndex);
                return ts == null ? null : ts.toLocalDateTime();
            }

            @Override
            public LocalDateTime getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
                Timestamp ts = cs.getTimestamp(columnIndex);
                return ts == null ? null : ts.toLocalDateTime();
            }
        };
    }
}
