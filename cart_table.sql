-- Create cart_items table (stores only product_id, fetches fresh data on load)
CREATE TABLE IF NOT EXISTS `cart_items` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `product_id` int NOT NULL,
    `quantity` int NOT NULL DEFAULT 1,
    `size` varchar(50),
    `color` varchar(50),
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `cart_items_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `cart_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
