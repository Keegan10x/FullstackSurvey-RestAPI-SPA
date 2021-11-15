CREATE TABLE IF NOT EXISTS `accounts` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `user` varchar(30),
  `pass` varchar(75),
  `group` varchar(30)
);

CREATE TABLE IF NOT EXISTS `surveys` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `usr` mediumint UNSIGNED,
  `name` varchar(30),
  `description` varchar(280),
  `created` datetime
);

CREATE TABLE IF NOT EXISTS `questions` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `survey` mediumint UNSIGNED,
  `title` varchar(30),
  `description` varchar(280),
  `created` datetime
);

CREATE TABLE IF NOT EXISTS `responses` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `question` mediumint UNSIGNED,
  `usr` mediumint UNSIGNED,
  `survey` mediumint UNSIGNED,
  `response` mediumint UNSIGNED
);

ALTER TABLE `surveys` ADD FOREIGN KEY (`usr`) REFERENCES `accounts` (`id`);

ALTER TABLE `questions` ADD FOREIGN KEY (`survey`) REFERENCES `surveys` (`id`);

ALTER TABLE `responses` ADD FOREIGN KEY (`question`) REFERENCES `questions` (`id`);

ALTER TABLE `responses` ADD FOREIGN KEY (`usr`) REFERENCES `accounts` (`id`);

ALTER TABLE `responses` ADD FOREIGN KEY (`survey`) REFERENCES `surveys` (`id`);
