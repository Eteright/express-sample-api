SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `empty_project` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `empty_project`;

DROP TABLE IF EXISTS `test`;
CREATE TABLE IF NOT EXISTS `test` (
  `id` int(11) NOT NULL,
  `value` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='test table';

ALTER TABLE `test`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;