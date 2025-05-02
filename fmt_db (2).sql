-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2025 at 01:31 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fmt_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE `player` (
  `player_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `academy_join_date` date DEFAULT NULL,
  `status` enum('Active','Inactive','Graduated') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `player`
--

INSERT INTO `player` (`player_id`, `first_name`, `last_name`, `date_of_birth`, `position`, `nationality`, `height`, `weight`, `contact_email`, `contact_phone`, `academy_join_date`, `status`) VALUES
(1, 'Thabo', 'Mokoena', '2005-03-21', 'Forward', 'South Africa', 1.75, 68.50, 'thabo.mokoena@example.com', '0712345678', '2022-01-10', 'Active'),
(2, 'Sipho', 'Nkosi', '2006-07-15', 'Midfielder', 'South Africa', 1.68, 65.00, 'sipho.nkosi@example.com', '0723456789', '2022-03-05', 'Active'),
(7, 'Lesego', 'Mngomezulu', '2005-08-13', 'MIDFIELDER', 'South Africa', 175.00, 68.00, 'thabo.mokoena@example.com', '+27731234567', '2023-01-08', 'Active'),
(89, 'Pedri', 'Gonzalez', '2025-04-01', 'MIDFIELDER', 'Nigeria', 120.00, 70.00, 'player@pedri.com', '+27813479054', '2025-04-27', 'Inactive'),
(90, 'Lamine ', 'Yamal', '2025-04-28', 'MIDFIELDER', 'South Africa', 210.00, 117.00, 'lamine@player.com', '+27763110372', '2025-04-28', 'Graduated'),
(91, 'Kylian', 'Mbappe', '2025-04-04', 'DEFENDER', 'Nigeria', 122.00, 111.00, 'mbappe@player.com', '+27813479054', '2025-04-28', 'Inactive'),
(92, 'Lionel', 'Messi', '2003-01-01', 'MIDFIELDER', 'South Africa', 117.00, 82.00, 'messi@player.com', '081546789', '2025-04-28', 'Inactive'),
(93, 'Lunga', 'Ntshingila', '2001-06-16', 'MIDFIELDER', 'South Africa', 117.00, 75.00, 'player@lunga.com', '0755639875', '2025-04-28', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `playercontract`
--

CREATE TABLE `playercontract` (
  `contract_id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `contract_type` enum('Scholarship','Amateur','Professional') DEFAULT NULL,
  `monthly_stipend` decimal(10,2) DEFAULT NULL,
  `performance_bonus` decimal(10,2) DEFAULT NULL,
  `status` enum('Active','Expired','Terminated') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `playercontract`
--

INSERT INTO `playercontract` (`contract_id`, `player_id`, `start_date`, `end_date`, `contract_type`, `monthly_stipend`, `performance_bonus`, `status`) VALUES
(1, 92, '2025-04-28', '2025-06-28', 'Professional', 10000.00, 1000.00, 'Active'),
(2, 2, '2025-04-18', '2025-04-30', 'Amateur', 1000.00, 100.00, 'Active'),
(3, 7, '2025-05-14', '2025-05-16', 'Scholarship', 5000.00, 100.00, 'Expired');

-- --------------------------------------------------------

--
-- Table structure for table `playerperformance`
--

CREATE TABLE `playerperformance` (
  `performance_id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `assessment_date` date DEFAULT NULL,
  `technical_score` decimal(5,2) DEFAULT NULL,
  `tactical_score` decimal(5,2) DEFAULT NULL,
  `physical_score` decimal(5,2) DEFAULT NULL,
  `psychological_score` decimal(5,2) DEFAULT NULL,
  `overall_rating` decimal(5,2) DEFAULT NULL,
  `coach_comments` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `playerperformance`
--

INSERT INTO `playerperformance` (`performance_id`, `player_id`, `assessment_date`, `technical_score`, `tactical_score`, `physical_score`, `psychological_score`, `overall_rating`, `coach_comments`) VALUES
(1, 92, '2025-04-28', 10.00, 10.00, 10.00, 10.00, 10.00, 'Perfection'),
(2, 7, '2025-04-28', 5.00, 5.00, 5.00, 5.00, 5.00, 'Lot of room for improvement'),
(3, 92, '2025-04-28', 10.00, 10.00, 10.00, 10.00, 10.00, 'Exceptional'),
(4, 90, '2025-04-28', 10.00, 10.00, 10.00, 10.00, 10.00, 'Starrr');

-- --------------------------------------------------------

--
-- Table structure for table `trainingattendance`
--

CREATE TABLE `trainingattendance` (
  `attendance_id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `attendance_status` enum('Present','Absent','Excused') DEFAULT NULL,
  `performance_notes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainingsession`
--

CREATE TABLE `trainingsession` (
  `session_id` int(11) NOT NULL,
  `session_date` date DEFAULT NULL,
  `session_type` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `coach_id` int(11) DEFAULT NULL,
  `duration_hours` decimal(4,2) DEFAULT NULL,
  `focus_area` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','scout','player') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `first_name`, `last_name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Peter', 'Magudulela', 'peter@admin.com', 'Peter#123', 'admin', '2025-04-28 11:56:11'),
(2, 'Patrice', 'Motsepe', 'motsepe@foundation.com', 'Motsepe#123', 'admin', '2025-04-28 12:02:36'),
(3, 'Bongani', 'Mongwe', 'mongwe@admin.com', 'Bongzz123', 'admin', '2025-04-28 14:37:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`player_id`);

--
-- Indexes for table `playercontract`
--
ALTER TABLE `playercontract`
  ADD PRIMARY KEY (`contract_id`),
  ADD KEY `player_id` (`player_id`);

--
-- Indexes for table `playerperformance`
--
ALTER TABLE `playerperformance`
  ADD PRIMARY KEY (`performance_id`),
  ADD KEY `player_id` (`player_id`);

--
-- Indexes for table `trainingattendance`
--
ALTER TABLE `trainingattendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `trainingsession`
--
ALTER TABLE `trainingsession`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `player`
--
ALTER TABLE `player`
  MODIFY `player_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `playercontract`
--
ALTER TABLE `playercontract`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `playerperformance`
--
ALTER TABLE `playerperformance`
  MODIFY `performance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `trainingattendance`
--
ALTER TABLE `trainingattendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trainingsession`
--
ALTER TABLE `trainingsession`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `playercontract`
--
ALTER TABLE `playercontract`
  ADD CONSTRAINT `playercontract_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`player_id`);

--
-- Constraints for table `playerperformance`
--
ALTER TABLE `playerperformance`
  ADD CONSTRAINT `playerperformance_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`player_id`);

--
-- Constraints for table `trainingattendance`
--
ALTER TABLE `trainingattendance`
  ADD CONSTRAINT `trainingattendance_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`player_id`),
  ADD CONSTRAINT `trainingattendance_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `trainingsession` (`session_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
