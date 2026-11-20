package com.inventory.service;

import com.inventory.dto.StockTransactionDto;
import com.inventory.entity.Product;
import com.inventory.entity.StockTransaction;
import com.inventory.exception.InsufficientStockException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StockTransactionService {

    private final StockTransactionRepository stockTransactionRepository;
    private final ProductRepository productRepository;

    public StockTransactionService(StockTransactionRepository stockTransactionRepository,
                                   ProductRepository productRepository) {
        this.stockTransactionRepository = stockTransactionRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<StockTransactionDto> getAllTransactions() {
        return stockTransactionRepository.findAllByOrderByTransactionDateDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StockTransactionDto stockIn(StockTransactionDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", dto.getProductId()));

        product.setQuantity(product.getQuantity() + dto.getQuantity());
        productRepository.save(product);

        StockTransaction transaction = StockTransaction.builder()
                .product(product)
                .type(StockTransaction.TransactionType.STOCK_IN)
                .quantity(dto.getQuantity())
                .notes(dto.getNotes())
                .build();

        StockTransaction saved = stockTransactionRepository.save(transaction);
        return mapToDto(saved);
    }

    public StockTransactionDto stockOut(StockTransactionDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", dto.getProductId()));

        if (product.getQuantity() < dto.getQuantity()) {
            throw new InsufficientStockException(product.getName(), product.getQuantity(), dto.getQuantity());
        }

        product.setQuantity(product.getQuantity() - dto.getQuantity());
        productRepository.save(product);

        StockTransaction transaction = StockTransaction.builder()
                .product(product)
                .type(StockTransaction.TransactionType.STOCK_OUT)
                .quantity(dto.getQuantity())
                .notes(dto.getNotes())
                .build();

        StockTransaction saved = stockTransactionRepository.save(transaction);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<StockTransactionDto> getTransactionsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
        return stockTransactionRepository.findByProductIdOrderByTransactionDateDesc(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private StockTransactionDto mapToDto(StockTransaction transaction) {
        return StockTransactionDto.builder()
                .id(transaction.getId())
                .productId(transaction.getProduct().getId())
                .productName(transaction.getProduct().getName())
                .type(transaction.getType().name())
                .quantity(transaction.getQuantity())
                .notes(transaction.getNotes())
                .transactionDate(transaction.getTransactionDate())
                .build();
    }
}
