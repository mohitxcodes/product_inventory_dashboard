package com.inventory.repository;

import com.inventory.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByProductIdOrderByTransactionDateDesc(Long productId);

    @Query("SELECT COUNT(st) FROM StockTransaction st WHERE st.type = :type")
    Long countByType(@Param("type") StockTransaction.TransactionType type);

    List<StockTransaction> findAllByOrderByTransactionDateDesc();
}
