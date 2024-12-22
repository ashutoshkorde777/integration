-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 22, 2024 at 07:49 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `commondb`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigntraining`
--

DROP TABLE IF EXISTS `assigntraining`;
CREATE TABLE IF NOT EXISTS `assigntraining` (
  `employeeId` int UNSIGNED DEFAULT NULL,
  `employeeName` varchar(50) NOT NULL,
  `skillName` varchar(50) DEFAULT NULL,
  `skillId` tinyint UNSIGNED DEFAULT NULL,
  `grade` tinyint UNSIGNED DEFAULT NULL,
  KEY `skillId` (`skillId`),
  KEY `employeeId` (`employeeId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE IF NOT EXISTS `attendance` (
  `employeeId` int UNSIGNED NOT NULL,
  `sessionId` tinyint UNSIGNED NOT NULL,
  `attendanceStatus` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`employeeId`,`sessionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
CREATE TABLE IF NOT EXISTS `department` (
  `departmentId` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `departmentName` varchar(50) NOT NULL,
  `departmentStartDate` date DEFAULT NULL,
  `departmentEndDate` date DEFAULT NULL,
  PRIMARY KEY (`departmentId`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`departmentId`, `departmentName`, `departmentStartDate`, `departmentEndDate`) VALUES
(1, 'Training', '2024-12-02', NULL),
(2, 'ERP', '2024-12-02', NULL),
(3, 'Software Development', '2024-12-02', NULL),
(4, 'AA', '2024-12-03', '2024-12-05'),
(7, 'Marketing', '2024-12-22', NULL),
(6, 'Pro', '2024-12-01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departmentskill`
--

DROP TABLE IF EXISTS `departmentskill`;
CREATE TABLE IF NOT EXISTS `departmentskill` (
  `departmentSkillId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `skillId` tinyint UNSIGNED DEFAULT NULL,
  `departmentId` tinyint UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`departmentSkillId`),
  KEY `skillId` (`skillId`),
  KEY `departmentId` (`departmentId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `designation`
--

DROP TABLE IF EXISTS `designation`;
CREATE TABLE IF NOT EXISTS `designation` (
  `designationId` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `designationName` varchar(50) NOT NULL,
  PRIMARY KEY (`designationId`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `designation`
--

INSERT INTO `designation` (`designationId`, `designationName`) VALUES
(1, 'Die Engineer'),
(2, 'Senior Die Engineer'),
(3, 'Team Lead'),
(4, 'Junior LPDC Engineer'),
(10, 'Trainer'),
(6, 'Training Admin'),
(7, 'Frontend Developer'),
(8, 'Department Head'),
(9, 'Project Lead'),
(11, 'Machine Learning Engineering'),
(12, 'Backend Developer'),
(13, 'Field Manager'),
(14, 'Safety Trainer'),
(15, 'DepartmentHead'),
(16, 'Project Lead'),
(17, 'DepartmentHead'),
(18, 'Project Lead'),
(19, 'DepartmentHead'),
(20, 'Project Lead'),
(21, 'DepartmentHead'),
(22, 'Project Lead'),
(23, 'DepartmentHead'),
(24, 'Project Lead'),
(25, 'Marketing Head');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
CREATE TABLE IF NOT EXISTS `employee` (
  `employeeId` int NOT NULL AUTO_INCREMENT,
  `customEmployeeId` varchar(50) NOT NULL,
  `employeeName` varchar(100) NOT NULL,
  `companyName` varchar(100) NOT NULL,
  `employeeQualification` varchar(100) DEFAULT NULL,
  `experienceInYears` int DEFAULT NULL,
  `employeeDOB` date DEFAULT NULL,
  `employeeJoinDate` date DEFAULT NULL,
  `employeeGender` enum('Male','Female','Other') NOT NULL,
  `employeePhone` varchar(20) DEFAULT NULL,
  `employeeEmail` varchar(100) DEFAULT NULL,
  `employeePassword` varchar(255) NOT NULL,
  `employeeAccess` varchar(255) DEFAULT NULL,
  `employeeRefreshToken` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `employeeEndDate` date DEFAULT NULL,
  PRIMARY KEY (`employeeId`),
  UNIQUE KEY `employeeEmail` (`employeeEmail`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employeeId`, `customEmployeeId`, `employeeName`, `companyName`, `employeeQualification`, `experienceInYears`, `employeeDOB`, `employeeJoinDate`, `employeeGender`, `employeePhone`, `employeeEmail`, `employeePassword`, `employeeAccess`, `employeeRefreshToken`, `createdAt`, `employeeEndDate`) VALUES
(5, 'EMP003', 'Chinmay Kulkarni', 'Aakar Foundary', 'Bachelors', 5, '2004-02-24', '2023-01-01', 'Male', '9373747789', 'chinmay.kulkarni@viit.ac.in', '$2b$10$K9sNbNPxj6AFYfrNVzOj6eJ7M89fTtAR5OgkW4Epy7UoIgjffu1VG', '11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjo1LCJjdXN0b21FbXBsb3llZUlkIjoiRU1QMDAzIiwiZW1wbG95ZWVOYW1lIjoiQ2hpbm1heSBLdWxrYXJuaSIsImNvbXBhbnlOYW1lIjoiQWFrYXIgRm91bmRhcnkiLCJlbXBsb3llZVF1YWxpZmljYXRpb24iOiJCYWNoZWxvcnMiLCJleHBlcmllbmNlSW5ZZWFycy', '0000-00-00 00:00:00', NULL),
(6, 'EMP001', 'Rushikesh Ghodke', 'Aakar Moulds and Dies', 'Bachelors', 5, '2004-12-06', '2023-01-01', 'Male', '788797789', 'rushikesh.ghodke@viit.ac.in', '$2b$10$vwxy4sQEYcE1gndADQzQYefYScCx35kBUgi8WQV7EhDwzmoIXTRaK', '11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjo2LCJjdXN0b21FbXBsb3llZUlkIjoiRU1QMDAxIiwiZW1wbG95ZWVOYW1lIjoiUnVzaGlrZXNoIEdob2RrZSIsImNvbXBhbnlOYW1lIjoiQWFrYXIgTW91bGRzIGFuZCBEaWVzIiwiZW1wbG95ZWVRdWFsaWZpY2F0aW9uIjoiQmFjaGVsb3JzIiwiZXhwZXJpZW5jZU', '0000-00-00 00:00:00', NULL),
(35, 'MARK001', 'Shantanu Obrai', 'AMD', 'Diploma', 10, '1981-06-10', '2024-12-21', 'Male', '8566974523', 'shantanu.oberai@viit.ac.in', '$2b$10$hQFwlXPpyv99I4K./m6xm.sI7xuenurpnnYeU0ChqKHNB3VdWhbu6', '01000100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjozNSwiY3VzdG9tRW1wbG95ZWVJZCI6Ik1BUkswMDEiLCJlbXBsb3llZU5hbWUiOiJTaGFudGFudSBPYnJhaSIsImNvbXBhbnlOYW1lIjoiQU1EIiwiZW1wbG95ZWVRdWFsaWZpY2F0aW9uIjoiRGlwbG9tYSIsImV4cGVyaWVuY2VJblllYXJzIjoxMCwiZW1wbG95ZW', '2024-12-22 05:49:47', NULL),
(34, 'EMP0034', 'Ram', 'intel', 'Graduate', 2, '2005-12-12', '2024-12-08', 'Male', '07887986656', 'rushikeramo2021@gmail.com', '$2b$10$vHylsGAgygd0htuF2ZInT.rYZ30osQwANf37dYtDGdt4jXFeSB.ky', '01100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-19 09:34:48', '2024-12-22'),
(33, 'EMP010', 'XYZ', 'AMD', 'Diploma', 2, '1973-12-17', '2020-02-01', 'Male', '7887986666', 'xyz@viit.ac.in', '$2b$10$rmIEur34CUvGU3UtjYUtMuFk15SxjHYhPPT5e40LCmCzBXH/b1G5u', '00001100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-19 09:33:05', '2024-12-22'),
(32, 'EMP006', 'Sita Raman', 'ViDEX', 'Graduate', 2, '1985-12-16', '2024-11-30', 'Male', '07887986656', 'sitaraman@gmail.com', '$2b$10$qiYSsn0uxOzcwvRq03l94u.yPG9/NAj1wCbjm5mK66EutajdkB42m', '01100110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-19 09:23:46', NULL),
(31, 'rushikesh.ghodke@viit.ac.in', '111', '111', '12th', 11, '1111-11-10', '1111-10-31', 'Male', '07887986656', 'rushik11hodkeco2021@gmail.com', '$2b$10$DrTSDtr2cxea9BvxbkWUq.dUYTnryTMhRr09busW6LV/hpBmoSMhm', '00000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-19 09:20:21', '2024-12-19');

-- --------------------------------------------------------

--
-- Table structure for table `employeedesignation`
--

DROP TABLE IF EXISTS `employeedesignation`;
CREATE TABLE IF NOT EXISTS `employeedesignation` (
  `employeeDesignationId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `employeeId` int UNSIGNED DEFAULT NULL,
  `departmentId` tinyint UNSIGNED DEFAULT NULL,
  `designationId` tinyint UNSIGNED DEFAULT NULL,
  `managerId` int NOT NULL,
  PRIMARY KEY (`employeeDesignationId`),
  KEY `employeeId` (`employeeId`),
  KEY `departmentId` (`departmentId`),
  KEY `designationId` (`designationId`)
) ENGINE=MyISAM AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employeedesignation`
--

INSERT INTO `employeedesignation` (`employeeDesignationId`, `employeeId`, `departmentId`, `designationId`, `managerId`) VALUES
(1, 3, 7, 2, 1),
(2, 3, 8, 3, 1),
(3, 4, 7, 4, 1),
(4, 4, 8, 5, 1),
(5, 4, 3, 0, 20),
(6, 3, 3, 0, 20),
(7, 4, 3, 0, 20),
(8, 5, 1, 6, 1),
(9, 5, 3, 7, 1),
(10, 6, 3, 8, 1),
(11, 6, 2, 9, 1),
(12, 7, 2, 7, 5),
(13, 7, 2, 8, 6),
(14, 8, 1, 10, 5),
(15, 9, 3, 11, 6),
(16, 10, 3, 11, 9),
(17, 11, 1, 12, 5),
(18, 12, 2, 13, 6),
(19, 13, 1, 14, 5),
(20, 15, 1, 10, 5),
(21, 16, 1, 6, 5),
(22, 18, 3, 15, 1),
(23, 18, 2, 16, 1),
(24, 19, 1, 2, 12),
(25, 20, 3, 11, 16),
(26, 21, 1, 10, 20),
(27, 22, 3, 17, 1),
(28, 22, 2, 18, 1),
(29, 23, 3, 19, 1),
(30, 23, 2, 20, 1),
(31, 24, 3, 21, 1),
(32, 24, 2, 22, 1),
(33, 25, 3, 23, 1),
(34, 25, 2, 24, 1),
(35, 26, 2, 6, 22),
(36, 27, 2, 4, 19),
(37, 28, 2, 4, 6),
(38, 30, 3, 10, 19),
(39, 31, 1, 4, 5),
(40, 32, 2, 12, 6),
(41, 33, 2, 3, 6),
(42, 34, 2, 10, 6),
(43, 35, 7, 25, 6);

-- --------------------------------------------------------

--
-- Table structure for table `employeeskill`
--

DROP TABLE IF EXISTS `employeeskill`;
CREATE TABLE IF NOT EXISTS `employeeskill` (
  `employeeId` int UNSIGNED NOT NULL,
  `skillId` tinyint UNSIGNED NOT NULL,
  `grade` tinyint UNSIGNED DEFAULT NULL,
  `skillTrainingResult` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`employeeId`,`skillId`),
  KEY `skillId` (`skillId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `selectedassigntraining`
--

DROP TABLE IF EXISTS `selectedassigntraining`;
CREATE TABLE IF NOT EXISTS `selectedassigntraining` (
  `employeeId` int UNSIGNED NOT NULL,
  `skillId` tinyint UNSIGNED NOT NULL,
  PRIMARY KEY (`employeeId`,`skillId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `sessionId` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `sessionName` varchar(55) NOT NULL,
  `sessionDate` date DEFAULT NULL,
  `sessionStartTime` time DEFAULT NULL,
  `sessionEndTime` time DEFAULT NULL,
  `trainingId` int UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`sessionId`),
  KEY `trainingId` (`trainingId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
CREATE TABLE IF NOT EXISTS `skill` (
  `skillId` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `skillName` varchar(50) DEFAULT NULL,
  `departmentId` tinyint UNSIGNED DEFAULT NULL,
  `skillAddedBy` varchar(50) DEFAULT NULL,
  `departmentIdGivingTraining` tinyint UNSIGNED DEFAULT NULL,
  `skillDescription` varchar(200) DEFAULT NULL,
  `skillStartDate` date DEFAULT NULL,
  `skillEndDate` date DEFAULT NULL,
  `skillActivityStatus` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`skillId`),
  KEY `departmentId` (`departmentId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `training`
--

DROP TABLE IF EXISTS `training`;
CREATE TABLE IF NOT EXISTS `training` (
  `trainingId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `trainerId` int UNSIGNED DEFAULT NULL,
  `startTrainingDate` date DEFAULT NULL,
  `endTrainingDate` date DEFAULT NULL,
  `skillId` tinyint UNSIGNED DEFAULT NULL,
  `trainingTitle` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`trainingId`),
  KEY `skillId` (`skillId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainingregistration`
--

DROP TABLE IF EXISTS `trainingregistration`;
CREATE TABLE IF NOT EXISTS `trainingregistration` (
  `employeeId` int UNSIGNED DEFAULT NULL,
  `trainingId` int UNSIGNED DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainingskills`
--

DROP TABLE IF EXISTS `trainingskills`;
CREATE TABLE IF NOT EXISTS `trainingskills` (
  `trainingId` int UNSIGNED DEFAULT NULL,
  `skillId` tinyint UNSIGNED DEFAULT NULL,
  KEY `trainingId` (`trainingId`),
  KEY `skillId` (`skillId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
