package com.inventory.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {

    private Long totalProducts;
    private Long totalCategories;
    private Long totalStockIn;
    private Long totalStockOut;
    private Long lowStockCount;
    private BigDecimal totalInventoryValue;
}
