package com.inventory.controller;

import com.inventory.dto.StockTransactionDto;
import com.inventory.service.StockTransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-transactions")
public class StockTransactionController {

    private final StockTransactionService stockTransactionService;

    public StockTransactionController(StockTransactionService stockTransactionService) {
        this.stockTransactionService = stockTransactionService;
    }

    @GetMapping
    public ResponseEntity<List<StockTransactionDto>> getAllTransactions() {
        return ResponseEntity.ok(stockTransactionService.getAllTransactions());
    }

    @PostMapping("/stock-in")
    public ResponseEntity<StockTransactionDto> stockIn(@Valid @RequestBody StockTransactionDto dto) {
        StockTransactionDto result = stockTransactionService.stockIn(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/stock-out")
    public ResponseEntity<StockTransactionDto> stockOut(@Valid @RequestBody StockTransactionDto dto) {
        StockTransactionDto result = stockTransactionService.stockOut(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockTransactionDto>> getTransactionsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(stockTransactionService.getTransactionsByProductId(productId));
    }
}
