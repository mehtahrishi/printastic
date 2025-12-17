CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`size` varchar(50),
	`color` varchar(50),
	`customization_text` text,
	`customization_images` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_previews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`setting` varchar(100) NOT NULL,
	`image_url` text NOT NULL,
	`image_hint` text,
	CONSTRAINT `product_previews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`original_price` decimal(10,2),
	`category` varchar(100),
	`sizes` json,
	`colors` json,
	`images` json NOT NULL,
	`is_trending` boolean DEFAULT false,
	`is_visible` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `address` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `apartment` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `postal_code` varchar(20);--> statement-breakpoint
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_previews` ADD CONSTRAINT `product_previews_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;