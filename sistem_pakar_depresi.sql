-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2025 at 08:02 AM
-- Server version: 11.4.8-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistem_pakar_depresi`
--

-- --------------------------------------------------------

--
-- Table structure for table `aturan`
--

CREATE TABLE `aturan` (
  `id_aturan` int(11) NOT NULL,
  `kondisi` text NOT NULL,
  `hasil` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `aturan`
--

INSERT INTO `aturan` (`id_aturan`, `kondisi`, `hasil`) VALUES
(9, 'C1,C2,C3', 'Depresi Ringan'),
(10, 'C1,C2,C3,C4,C6', 'Depresi Sedang'),
(11, 'C1,C2,C3,C4,C5,C6,C7,C8,C9', 'Depresi Mayor Berat');

-- --------------------------------------------------------

--
-- Table structure for table `gejala`
--

CREATE TABLE `gejala` (
  `id_gejala` int(11) NOT NULL,
  `kode_gejala` varchar(10) NOT NULL,
  `nama_gejala` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `gejala`
--

INSERT INTO `gejala` (`id_gejala`, `kode_gejala`, `nama_gejala`) VALUES
(1, 'C1', 'Suasana hati sedih hampir setiap hari'),
(2, 'C2', 'Kehilangan minat akan segala sesuatu'),
(3, 'C3', 'Perubahan berat badan atau nafsu makan secara signifikan'),
(4, 'C4', 'Insomnia atau hypersomnia'),
(5, 'C5', 'Perubahan psikomotor (lamban atau gelisah)'),
(6, 'C6', 'Kelelahan atau kehilangan energi'),
(7, 'C7', 'Perasaan tidak berharga atau rasa bersalah berlebihan'),
(8, 'C8', 'Sulit konsentrasi atau sulit dalam mengambil keputusan'),
(9, 'C9', 'Dorongan pikiran akan kematian atau bunuh diri');

-- --------------------------------------------------------

--
-- Table structure for table `hasil_diagnosa`
--

CREATE TABLE `hasil_diagnosa` (
  `id` int(11) NOT NULL,
  `nama_pasien` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `umur` int(11) DEFAULT NULL,
  `keluhan` text DEFAULT NULL,
  `hasil_penyakit` varchar(255) NOT NULL,
  `detail_gejala` text DEFAULT NULL,
  `persentase` decimal(5,2) DEFAULT 0.00,
  `tanggal` timestamp NULL DEFAULT current_timestamp(),
  `id_pengguna` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `hasil_diagnosa`
--

INSERT INTO `hasil_diagnosa` (`id`, `nama_pasien`, `email`, `umur`, `keluhan`, `hasil_penyakit`, `detail_gejala`, `persentase`, `tanggal`, `id_pengguna`) VALUES
(1, 'Dummy A', NULL, NULL, NULL, 'Depresi Ringan', NULL, 35.60, '2025-11-02 06:29:05', NULL),
(2, 'Dummy B', NULL, NULL, NULL, 'Depresi Sedang', NULL, 67.80, '2025-11-02 06:29:05', NULL),
(3, 'Dummy C', NULL, NULL, NULL, 'Depresi Berat', NULL, 89.40, '2025-11-02 06:29:05', NULL),
(4, 'anoniim', 'achmadr808@gmail.com', NULL, NULL, 'Depresi Cukup Berat', NULL, 17.00, '2025-11-02 12:37:45', NULL),
(5, 'anonim', 'achmadr808@gmail.com', NULL, NULL, 'Depresi Berat', NULL, 20.00, '2025-11-02 12:38:25', NULL),
(6, 'Anonim 3', 'anonim@gmail.com', NULL, NULL, 'Depresi Cukup Berat', NULL, 18.00, '2025-11-04 09:29:22', NULL),
(7, 'example', 'example@gmail.com', NULL, NULL, 'Depresi Sedang', NULL, 13.00, '2025-11-08 11:10:10', NULL),
(8, 'Anonim 4', 'achmadridwan587@gmail.com', NULL, NULL, 'Depresi Berat', NULL, 26.00, '2025-11-27 12:50:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `penyakit`
--

CREATE TABLE `penyakit` (
  `id` int(11) NOT NULL,
  `kode_penyakit` varchar(10) NOT NULL,
  `nama_penyakit` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `solusi` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penyakit`
--

INSERT INTO `penyakit` (`id`, `kode_penyakit`, `nama_penyakit`, `deskripsi`, `solusi`, `created_at`) VALUES
(1, 'P01', 'Depresi Ringan', 'Ditandai dengan perasaan sedih, kehilangan minat, dan penurunan energi, tetapi masih dapat melakukan aktivitas sehari-hari.', 'Rutin berolahraga ringan, tidur cukup, konsumsi makanan bergizi, dan bercerita dengan orang yang dipercaya.', '2025-11-01 20:33:58'),
(2, 'P02', 'Depresi Sedang', 'Mulai muncul kesulitan fokus, gangguan tidur, dan menurunnya produktivitas; membutuhkan perhatian klinis.', 'Konsultasikan dengan psikolog atau psikiater. Hindari isolasi sosial dan lakukan terapi perilaku kognitif.', '2025-11-01 20:33:58'),
(3, 'P03', 'Depresi Berat', 'Kehilangan minat total, muncul pikiran menyakiti diri, dan tidak mampu melakukan aktivitas harian.', 'Segera temui psikiater. Dapat memerlukan pengobatan farmakoterapi (antidepresan) dan pendampingan intensif.', '2025-11-01 20:33:58'),
(4, 'P04', 'Gangguan Cemas Menyeluruh', 'Kecemasan berlebihan terhadap berbagai hal sehari-hari tanpa alasan jelas.', 'Latihan relaksasi, teknik pernapasan, dan terapi psikologis. Hindari konsumsi kafein berlebih.', '2025-11-01 20:33:58'),
(5, 'P05', 'Burnout', 'Kelelahan fisik dan emosional akibat tekanan kerja atau tanggung jawab berlebihan.', 'Istirahat cukup, batasi beban kerja, dan lakukan aktivitas yang memberi rasa puas dan rileks.', '2025-11-01 20:33:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `role` enum('admin','super-admin') DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `foto_profil` varchar(255) DEFAULT 'default.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `nama_lengkap`, `role`, `created_at`, `foto_profil`) VALUES
(1, 'admin1', 'admin1@gmail.com', '$2b$10$VJR0bnD4LXKzIBfid43dTOfFzfAeTqhXcb3hmpfzTIw4RBgQ5JziW', 'Psikolog', 'admin', '2025-11-01 18:58:39', 'default.jpg'),
(3, 'admin2', 'admin2@gmail.com', '$2b$10$PBBpG0Go9OVdVJ6gmtoBhulNLmM3dvIqIO5GLizkCZKjIdIpE.S1m', 'admin2', 'admin', '2025-11-04 07:12:52', 'default.jpg'),
(11, 'admin', 'admin@gmail.com', '$2b$10$uKJcwkorYujcC/JI2.ixqOL6pwZWQp7MsHY1u/TshY/kljuvhnty2', 'admin', 'admin', '2025-11-29 19:18:17', '1764459019115-758120070.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aturan`
--
ALTER TABLE `aturan`
  ADD PRIMARY KEY (`id_aturan`);

--
-- Indexes for table `gejala`
--
ALTER TABLE `gejala`
  ADD PRIMARY KEY (`id_gejala`);

--
-- Indexes for table `hasil_diagnosa`
--
ALTER TABLE `hasil_diagnosa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_hasil_pengguna` (`id_pengguna`);

--
-- Indexes for table `penyakit`
--
ALTER TABLE `penyakit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_penyakit` (`kode_penyakit`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aturan`
--
ALTER TABLE `aturan`
  MODIFY `id_aturan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `gejala`
--
ALTER TABLE `gejala`
  MODIFY `id_gejala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `hasil_diagnosa`
--
ALTER TABLE `hasil_diagnosa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `penyakit`
--
ALTER TABLE `penyakit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hasil_diagnosa`
--
ALTER TABLE `hasil_diagnosa`
  ADD CONSTRAINT `fk_hasil_pengguna` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna_diagnosa` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
