-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 10, 2025 at 11:02 AM
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
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`departmentId`, `departmentName`, `departmentStartDate`, `departmentEndDate`) VALUES
(12, 'Manufacturing', '2024-12-22', NULL),
(11, 'Networking', '2024-12-22', '2025-01-05'),
(10, 'Training', '2024-12-22', NULL),
(9, 'UI/UX', '2024-12-03', '2024-12-25'),
(8, 'ERP', '2024-12-01', NULL),
(13, 'Testing', '2024-12-04', '2024-12-25');

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
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `designation`
--

INSERT INTO `designation` (`designationId`, `designationName`) VALUES
(28, 'Department Head'),
(27, 'Machine Learning Engineer'),
(26, 'Department Head');

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
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employeeId`, `customEmployeeId`, `employeeName`, `companyName`, `employeeQualification`, `experienceInYears`, `employeeDOB`, `employeeJoinDate`, `employeeGender`, `employeePhone`, `employeeEmail`, `employeePassword`, `employeeAccess`, `employeeRefreshToken`, `createdAt`, `employeeEndDate`) VALUES
(5, 'EMP003', 'Chinmay Kulkarni', 'Aakar Foundary', 'Bachelors', 5, '2004-02-24', '2023-01-01', 'Male', '9373747789', 'chinmay.kulkarni@viit.ac.in', '$2b$10$K9sNbNPxj6AFYfrNVzOj6eJ7M89fTtAR5OgkW4Epy7UoIgjffu1VG', '11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjo1LCJjdXN0b21FbXBsb3llZUlkIjoiRU1QMDAzIiwiZW1wbG95ZWVOYW1lIjoiQ2hpbm1heSBLdWxrYXJuaSIsImNvbXBhbnlOYW1lIjoiQWFrYXIgRm91bmRhcnkiLCJlbXBsb3llZVF1YWxpZmljYXRpb24iOiJCYWNoZWxvcnMiLCJleHBlcmllbmNlSW5ZZWFycy', '0000-00-00 00:00:00', NULL),
(6, 'EMP001', 'Rushikesh Ghodke', 'Aakar Moulds and Dies', 'Bachelors', 5, '2004-12-06', '2023-01-01', 'Male', '788797789', 'rushikesh.ghodke@viit.ac.in', '$2b$10$vwxy4sQEYcE1gndADQzQYefYScCx35kBUgi8WQV7EhDwzmoIXTRaK', '11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111,11111111111111111111111111111111111111111111111111', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjo2LCJjdXN0b21FbXBsb3llZUlkIjoiRU1QMDAxIiwiZW1wbG95ZWVOYW1lIjoiUnVzaGlrZXNoIEdob2RrZSIsImNvbXBhbnlOYW1lIjoiQWFrYXIgTW91bGRzIGFuZCBEaWVzIiwiZW1wbG95ZWVRdWFsaWZpY2F0aW9uIjoiQmFjaGVsb3JzIiwiZXhwZXJpZW5jZU', '0000-00-00 00:00:00', NULL),
(46, 'EMP019', 'Aakash Bharti', 'AF', 'ITI', 2, '2002-12-09', '2024-11-30', 'Male', '9876554433', 'aakash.bharti@af.com', '$2b$10$LBvNrUP2OjaNKHXBEiOIjOVJx7fdxHC7s6peec96/IoXH1d3KMZNm', '01000100010001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-22 14:06:52', NULL),
(43, 'EMP016', 'Neha Mehta', 'AF', 'Graduate', 3, '2001-04-12', '2024-12-05', 'Female', '9798765432', 'neha.mehta@af.com', '$2b$10$tgf9nDRvWfETxABR67ljKOVNCmQZ0KDYXKI51Eczf.x6w6qdW4HvG', '01000100010001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-22 14:06:27', NULL),
(44, 'EMP017', 'Arjun Singh', 'AF', 'Diploma', 2, '2002-11-28', '2024-12-10', 'Male', '9988775544', 'arjun.singh@af.com', '$2b$10$U7MkzHKC3Xr.OuIwHBxCAOU1EApkm1VV5Joo2MpNCl.XuZFsV1Xoy', '01000100010001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-22 14:06:36', NULL),
(42, 'EMP015', 'Vikas Yadav', 'AF', 'ITI', 4, '1999-02-14', '2024-11-28', 'Male', '9922334455', 'vikas.yadav@af.com', '$2b$10$BqeRGmeF8TQ5uJ6AFCoTdei9K4Vruwy.hlilELCyiDKQif6rP.D7q', '01000100010001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-22 14:00:03', NULL),
(38, 'EMP011', 'Amit Yadav', 'AF', 'Diploma', 2, '2002-07-19', '2024-11-25', 'Male', '9876543210', 'amit.yadav@af.com', '$2b$10$NXIvSP2ULxW8aA.EvBzub.84woHgwIqwq8d2UhU1jIW2WmNYHQege', '01000100010001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', NULL, '2024-12-22 13:58:53', NULL);

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
) ENGINE=MyISAM AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employeedesignation`
--

INSERT INTO `employeedesignation` (`employeeDesignationId`, `employeeId`, `departmentId`, `designationId`, `managerId`) VALUES
(54, 46, 8, 27, 6),
(53, 45, 12, 27, 6),
(52, 44, 8, 27, 6),
(51, 43, 10, 26, 6),
(50, 42, 12, 27, 6),
(49, 41, 12, 27, 6),
(48, 40, 13, 26, 6),
(47, 39, 11, 26, 6),
(46, 38, 12, 28, 6),
(45, 37, 8, 27, 6),
(44, 36, 9, 26, 6);

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
