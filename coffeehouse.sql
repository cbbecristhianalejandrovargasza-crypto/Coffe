SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS coffeehouse
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE coffeehouse;

CREATE TABLE IF NOT EXISTS cafeteria (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  direccion VARCHAR(200) NOT NULL,
  telefono VARCHAR(30),
  horario VARCHAR(150) NOT NULL,
  historia TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS servicios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  precio DECIMAL(8, 2) NOT NULL,
  especialidad TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS multimedia (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('video', 'foto') NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  poster VARCHAR(255),
  fuente_url VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS contactos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(254) NOT NULL,
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO cafeteria
  (id, nombre, ciudad, direccion, telefono, horario, historia)
VALUES
  (1, 'CoffeeHouse', 'Cochabamba, Bolivia',
   'Dirección de demostración', NULL,
   'Lunes a sábado de 08:00 a 20:00',
   'CoffeeHouse es una cafetería de demostración con café preparado al momento y repostería.');

INSERT IGNORE INTO servicios (id, nombre, descripcion) VALUES
  (1, 'Atención en el local', 'Disfruta de café y repostería en la cafetería.'),
  (2, 'Pedidos para llevar', 'Pide tu bebida o postre para recoger en el local.'),
  (3, 'Reservas de mesa', 'Consulta la disponibilidad de mesas para grupos.');

INSERT IGNORE INTO productos
  (id, nombre, descripcion, precio, especialidad)
VALUES
  (1, 'Cappuccino de la casa', 'Espresso con leche y espuma cremosa.', 18.00, 1),
  (2, 'Mocaccino', 'Espresso con leche y chocolate.', 22.00, 1),
  (3, 'Espresso', 'Una porción de café concentrado.', 12.00, 0),
  (4, 'Croissant de mantequilla', 'Hojaldre dorado y crujiente.', 14.00, 0),
  (5, 'Brownie de chocolate', 'Porción de brownie de chocolate.', 16.00, 0);

INSERT IGNORE INTO multimedia
  (id, tipo, titulo, descripcion, url, poster, fuente_url)
VALUES
  (1, 'video', 'Café hecho al momento',
   'Espresso, bebidas con leche y repostería en Cochabamba.',
   '/api/media/cafe.mp4', '/api/media/local-1.jpg',
   'https://www.pexels.com/video/a-machine-pouring-coffee-in-a-cup-9399042/'),
  (2, 'foto', 'Interior de la cafetería',
   'Imagen de referencia de un café con barra y taburetes.',
   '/api/media/local-1.jpg', NULL,
   'https://www.pexels.com/photo/modern-cozy-cafe-interior-with-bar-stools-31206777/'),
  (3, 'foto', 'Barra de café',
   'Imagen de referencia de una barra de madera.',
   '/api/media/local-2.jpg', NULL,
   'https://www.pexels.com/photo/modern-cozy-coffee-shop-interior-with-bar-stools-33386568/');