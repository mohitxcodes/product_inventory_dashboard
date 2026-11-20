package com.inventory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Product Inventory Management API")
                        .version("1.0.0")
                        .description("REST API for managing product inventory, categories, and stock transactions")
                        .contact(new Contact()
                                .name("Inventory Team")
                                .email("admin@inventory.com")));
    }
}
