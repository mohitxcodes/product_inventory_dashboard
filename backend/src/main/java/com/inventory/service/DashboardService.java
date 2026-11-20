package com.inventory.service;

import com.inventory.dto.DashboardStatsDto;
import com.inventory.entity.StockTransaction;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockTransactionRepository stockTransactionRepository;

    public DashboardService(ProductRepository productRepository,
                            CategoryRepository categoryRepository,
                            StockTransactionRepository stockTransactionRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        return DashboardStatsDto.builder()
                .totalProducts(productRepository.count())
                .totalCategories(categoryRepository.count())
                .totalStockIn(stockTransactionRepository.countByType(StockTransaction.TransactionType.STOCK_IN))
                .totalStockOut(stockTransactionRepository.countByType(StockTransaction.TransactionType.STOCK_OUT))
                .lowStockCount(productRepository.countLowStockProducts(10))
                .totalInventoryValue(productRepository.calculateTotalInventoryValue())
                .build();
    }
}
