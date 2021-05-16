CREATE DATABASE `exercicio`;

USE `exercicio`;

CREATE TABLE `users` (
  `id` INT(10) AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `birthdate` DATE NOT NULL,
  `picture` varchar(255)
);