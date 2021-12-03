CREATE TABLE IF NOT EXISTS `roles` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `role` varchar(30)
);

ALTER TABLE `accounts` ADD FOREIGN KEY (`role`) REFERENCES `roles` (`id`);


INSERT INTO roles(role) VALUES("admin");
INSERT INTO roles(role) VALUES("student");