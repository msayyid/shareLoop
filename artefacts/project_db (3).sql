-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 28, 2026 at 08:54 AM
-- Server version: 9.6.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `description` text,
  `icon` varchar(255) DEFAULT NULL,
  `listing_count` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `description`, `icon`, `listing_count`) VALUES
(1, 'Books', 'Books and study materials that can be borrowed, swapped, or passed on to other students.', NULL, 0),
(2, 'Electronics', 'Useful electronic items and accessories for study, daily life, and shared campus living.', NULL, 0),
(3, 'Kitchen', 'Kitchen tools and appliances suitable for shared flats, halls, and student homes.', NULL, 0),
(4, 'Sports', 'Sports and fitness items for casual exercise, training, and outdoor activities.', NULL, 0),
(5, 'Furniture', 'Furniture and room essentials that help students furnish or organise their space.', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `listing_id` int NOT NULL,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `exchange_type` enum('lending','swap','giveaway') NOT NULL,
  `condition_status` enum('like_new','good','fair','well_used') NOT NULL,
  `condition_notes` text,
  `photo_url_1` varchar(255) DEFAULT NULL,
  `photo_url_2` varchar(255) DEFAULT NULL,
  `photo_url_3` varchar(255) DEFAULT NULL,
  `swap_preferences` text,
  `is_available` tinyint(1) DEFAULT '1',
  `view_count` int DEFAULT '0',
  `request_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`listing_id`, `user_id`, `category_id`, `title`, `description`, `exchange_type`, `condition_status`, `condition_notes`, `photo_url_1`, `photo_url_2`, `photo_url_3`, `swap_preferences`, `is_available`, `view_count`, `request_count`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 1, 1, 'Python Programming Book 2', 'Good for beginners. Edited version', 'lending', 'good', 'nice', 'listing_pic_1.jpg', NULL, NULL, NULL, 0, 0, 0, '2026-03-19 00:26:42', '2026-04-28 06:55:55', 1),
(2, 2, 2, 'MacBook Charger', 'Works perfectly', 'giveaway', 'good', NULL, 'listing_pic_2.jpg', NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-24 03:19:13', 1),
(3, 3, 3, 'Rice Cooker', 'Small size', 'lending', 'fair', NULL, 'listing_pic_3.jpg', NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-24 03:19:37', 1),
(4, 4, 5, 'Yoga Mat number two', 'Barely used, and just got changed, still swap tho, but cateogry is furniture', 'swap', 'like_new', NULL, 'listing_pic_4.jpg', NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-04-23 04:16:35', 0),
(5, 5, 5, 'Desk Chair', 'Used but comfy', 'giveaway', 'well_used', NULL, 'listing_pic_5.jpg', NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-24 03:20:15', 1),
(6, 6, 1, 'Algorithms Book', 'Helpful for exams', 'lending', 'good', NULL, 'listing_pic_6.jpg', NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-24 03:20:35', 1),
(7, 7, 2, 'Bluetooth Speaker', 'Loud and clear', 'swap', 'good', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(8, 8, 3, 'Toaster', 'Works fine', 'giveaway', 'fair', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(9, 9, 4, 'Football', 'Almost new', 'lending', 'like_new', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(10, 10, 5, 'Study Desk', 'Moving out', 'giveaway', 'good', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(11, 11, 1, 'Database Systems Book', 'Second year module', 'lending', 'good', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(12, 12, 2, 'Wireless Mouse', 'Smooth and fast', 'giveaway', 'like_new', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(13, 13, 3, 'Air Fryer', 'Great condition', 'swap', 'good', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(14, 14, 4, 'Dumbbells Set', '5kg each', 'lending', 'good', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(15, 15, 5, 'Lamp', 'Desk lamp', 'giveaway', 'good', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-19 00:26:42', '2026-03-19 00:26:42', 1),
(16, 1, 1, 'Discrete Mathematics Revision Guide', 'Useful for first-year and second-year revision. A few highlighted pages but still very clear.', 'lending', 'good', 'Some notes in pencil on a few pages.', NULL, NULL, NULL, NULL, 0, 0, 0, '2026-03-23 09:00:00', '2026-04-28 06:50:03', 1),
(17, 2, 2, 'USB-C Hub', 'Small hub with HDMI and USB ports. Still works well and handy for library or home use.', 'giveaway', 'good', 'Minor scratches from normal use.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:05:00', '2026-03-23 09:05:00', 1),
(18, 3, 3, 'Saucepan Set', 'Set of two saucepans suitable for a shared student kitchen. Clean and fully usable.', 'lending', 'good', 'Handles are slightly worn but sturdy.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:10:00', '2026-03-23 09:10:00', 1),
(19, 4, 4, 'Skipping Rope', 'Lightweight skipping rope for quick workouts at home or outdoors.', 'swap', 'like_new', 'Used only a couple of times.', NULL, NULL, NULL, 'Open to swapping for a yoga block or resistance band.', 1, 0, 0, '2026-03-23 09:15:00', '2026-04-23 04:17:11', 0),
(20, 5, 5, 'Bedside Table', 'Compact bedside table with one shelf. Good for student rooms with limited space.', 'giveaway', 'fair', 'A few marks on the top surface.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:20:00', '2026-03-23 09:20:00', 1),
(21, 6, 1, 'Statistics Flashcards', 'Printed revision flashcards for core statistics topics. Useful before tests or coursework deadlines.', 'giveaway', 'good', 'Kept in a small ring binder.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:25:00', '2026-03-23 09:25:00', 1),
(22, 7, 2, 'Wired Keyboard', 'Full-size keyboard that works well for essays, coding, and general study use.', 'lending', 'good', 'A bit shiny on some keys from normal use.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:30:00', '2026-03-23 09:30:00', 1),
(23, 8, 3, 'Electric Kettle', 'Simple kettle that boils quickly and works fine. Good spare item for a new flat.', 'giveaway', 'good', 'Limescale cleaned recently.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:35:00', '2026-03-23 09:35:00', 1),
(24, 9, 4, 'Resistance Bands Set', 'Set of resistance bands for home workouts. Easy to store and carry.', 'lending', 'like_new', 'Includes carry pouch.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:40:00', '2026-03-23 09:40:00', 1),
(25, 10, 5, 'Laundry Basket', 'Lightweight laundry basket that is easy to carry between room and laundry area.', 'giveaway', 'good', 'Clean and in good shape.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:45:00', '2026-03-23 09:45:00', 1),
(26, 11, 1, 'Operating Systems Textbook', 'Older edition but still helpful for understanding core operating systems topics.', 'swap', 'fair', 'Some highlighted sections and light edge wear.', NULL, NULL, NULL, 'Would like to swap for another computing book or a desk accessory.', 1, 0, 0, '2026-03-23 09:50:00', '2026-03-23 09:50:00', 1),
(27, 12, 2, 'Desk Fan', 'Small desk fan that is useful during warmer months in halls or shared flats.', 'lending', 'good', 'Quiet on the lower setting.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 09:55:00', '2026-03-23 09:55:00', 1),
(28, 13, 3, 'Baking Tray', 'Standard baking tray that still has plenty of use left. Good for basic oven cooking.', 'giveaway', 'well_used', 'Visible signs of use but still works properly.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 10:00:00', '2026-03-23 10:00:00', 1),
(29, 14, 4, 'Tennis Racket', 'Casual-use tennis racket suitable for beginners or occasional games.', 'swap', 'good', 'Grip is still decent and frame is intact.', NULL, NULL, NULL, 'Open to swapping for another sports item of similar use.', 1, 0, 0, '2026-03-23 10:05:00', '2026-03-23 10:05:00', 1),
(30, 15, 5, 'Foldable Drying Rack', 'Useful foldable drying rack for small student rooms or shared flats.', 'lending', 'good', 'Folds flat and is easy to store.', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-03-23 10:10:00', '2026-03-23 10:10:00', 1),
(34, 4, 1, 'chingiz khan', 'a book about the conqueror of the world', 'lending', 'like_new', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-04-08 17:05:49', '2026-04-08 17:05:49', 1),
(35, 4, 2, 'laptop', 'my old laptop, i bough a new one', 'giveaway', 'like_new', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-04-09 07:07:46', '2026-04-09 07:07:46', 1),
(36, 16, 2, 'keyboard just got changed', 'giving away mac keyboard, just got changed', 'giveaway', 'good', 'the thing is it got changed', '/images/listings/1777324188418.jpg', NULL, NULL, NULL, 1, 0, 0, '2026-04-23 05:01:25', '2026-04-28 08:52:03', 0),
(37, 1, 5, 'testing 1', 'fawerqweruwqpoieur', 'lending', 'like_new', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2026-04-24 08:34:11', '2026-04-28 06:50:50', 1),
(38, 1, 5, 'tresting 2', 'ju2389ruiofsadjopi', 'swap', 'like_new', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2026-04-24 08:34:25', '2026-04-28 06:50:52', 1),
(39, 1, 5, 'testing 4', 'jaoiuf238oivpjaoip', 'giveaway', 'like_new', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2026-04-24 08:34:37', '2026-04-24 08:40:36', 1),
(40, 1, 1, 'nonlending testing', 'some things do not change', 'swap', 'like_new', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2026-04-24 09:47:05', '2026-04-28 06:02:16', 1),
(41, 1, 1, 'new listing', '56798fsadkhfiljh', 'giveaway', 'like_new', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2026-04-26 18:28:15', '2026-04-27 01:38:16', 1),
(42, 16, 2, 'monitor', 'rog monitor 144 hz', 'giveaway', 'good', 'pretty good, well maintainted', '/images/listings/1777326912729.jpg', NULL, NULL, NULL, 1, 0, 0, '2026-04-27 21:55:12', '2026-04-27 21:55:12', 1),
(43, 16, 1, 'just nothing', 'hcekcing no photo update', 'swap', 'like_new', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-04-27 21:57:06', '2026-04-27 21:57:06', 1),
(44, 16, 1, 'fasldjfl;ajk', '213846128', 'lending', 'like_new', NULL, '/images/listings/1777327283136.jpg', NULL, NULL, NULL, 1, 0, 0, '2026-04-27 22:01:23', '2026-04-28 02:10:49', 0);

-- --------------------------------------------------------

--
-- Table structure for table `listing_tags`
--

CREATE TABLE `listing_tags` (
  `listing_id` int NOT NULL,
  `tag_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `listing_tags`
--

INSERT INTO `listing_tags` (`listing_id`, `tag_id`) VALUES
(1, 1),
(3, 1),
(6, 1),
(11, 1),
(14, 1),
(16, 1),
(21, 1),
(2, 2),
(5, 2),
(8, 2),
(10, 2),
(15, 2),
(17, 2),
(18, 2),
(22, 2),
(1, 3),
(9, 3),
(12, 3),
(24, 3),
(7, 5),
(13, 5),
(19, 5),
(26, 5),
(29, 5),
(16, 6),
(21, 6),
(26, 6),
(20, 7),
(28, 7),
(19, 8),
(24, 8),
(25, 8),
(27, 8),
(30, 8),
(17, 9),
(22, 9),
(23, 9),
(29, 9),
(18, 10),
(20, 10),
(23, 10),
(25, 10),
(27, 10),
(28, 10),
(30, 10);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int NOT NULL,
  `request_id` int DEFAULT NULL,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `message` text,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `request_id`, `sender_id`, `receiver_id`, `message`, `is_read`, `created_at`) VALUES
(37, 20, 16, 1, 'hello friend', 1, '2026-04-28 06:39:08'),
(38, 20, 1, 16, 'hello friend', 1, '2026-04-28 06:39:24'),
(39, 20, 16, 1, 'fasdfasd', 1, '2026-04-28 08:22:50'),
(40, 20, 1, 16, 'asdfsadfasd', 1, '2026-04-28 08:23:24'),
(41, 20, 16, 1, 'asdfsdafasdsadf', 1, '2026-04-28 08:23:59'),
(42, 20, 1, 16, 'asfsadfasd', 1, '2026-04-28 08:24:09');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `message` text,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `type`, `message`, `link`, `is_read`, `created_at`) VALUES
(66, 1, 'request', 'Someone requested your item', '/requests/received', 1, '2026-04-28 06:55:50'),
(67, 16, 'request', 'Your request was accepted', '/my-requests', 1, '2026-04-28 06:55:55'),
(68, 1, 'message', 'You have a new message', '/requests/20/messages', 1, '2026-04-28 08:22:50'),
(69, 16, 'message', 'You have a new message', '/requests/20/messages', 1, '2026-04-28 08:23:24'),
(70, 1, 'message', 'You have a new message', '/requests/20/messages', 0, '2026-04-28 08:23:59'),
(71, 16, 'message', 'You have a new message', '/requests/20/messages', 1, '2026-04-28 08:24:09');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `rating_id` int NOT NULL,
  `request_id` int NOT NULL,
  `rater_id` int NOT NULL,
  `rated_id` int NOT NULL,
  `score` int NOT NULL,
  `comment` text,
  `rating_type` enum('as_lender','as_borrower','as_swapper','as_giver','as_receiver') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`rating_id`, `request_id`, `rater_id`, `rated_id`, `score`, `comment`, `rating_type`, `created_at`) VALUES
(1, 7, 16, 1, 5, '', NULL, '2026-04-27 01:50:50'),
(2, 4, 16, 1, 2, 'good', NULL, '2026-04-27 01:51:00'),
(3, 6, 16, 1, 4, 'fsadfasfa', NULL, '2026-04-27 01:51:04'),
(4, 20, 1, 16, 5, '239472139084709fasdsaf', NULL, '2026-04-28 06:56:24'),
(5, 27, 1, 16, 5, 'nice expericne', NULL, '2026-04-28 06:58:12');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `request_id` int NOT NULL,
  `requester_id` int NOT NULL,
  `listing_id` int NOT NULL,
  `status` enum('pending','accepted','declined','completed','cancelled') DEFAULT 'pending',
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `requested_duration` varchar(255) DEFAULT NULL,
  `swap_offer_description` text,
  `requested_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `responded_date` timestamp NULL DEFAULT NULL,
  `completed_date` timestamp NULL DEFAULT NULL,
  `owner_notes` text,
  `is_inquiry` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`request_id`, `requester_id`, `listing_id`, `status`, `message`, `requested_duration`, `swap_offer_description`, `requested_date`, `responded_date`, `completed_date`, `owner_notes`, `is_inquiry`) VALUES
(20, 16, 1, 'completed', NULL, NULL, NULL, '2026-04-28 06:39:05', NULL, NULL, NULL, 0),
(21, 16, 23, 'pending', NULL, NULL, NULL, '2026-04-28 06:41:01', NULL, NULL, NULL, 0),
(22, 16, 35, 'pending', NULL, NULL, NULL, '2026-04-28 06:41:19', NULL, NULL, NULL, 0),
(23, 16, 21, 'cancelled', NULL, NULL, NULL, '2026-04-28 06:41:24', NULL, NULL, NULL, 0),
(24, 16, 21, 'pending', NULL, NULL, NULL, '2026-04-28 06:44:05', NULL, NULL, NULL, 0),
(25, 16, 16, 'accepted', NULL, NULL, NULL, '2026-04-28 06:46:59', NULL, NULL, NULL, 0),
(26, 16, 37, 'accepted', NULL, NULL, NULL, '2026-04-28 06:47:04', NULL, NULL, NULL, 0),
(27, 16, 38, 'completed', NULL, NULL, NULL, '2026-04-28 06:47:09', NULL, NULL, NULL, 0),
(28, 16, 1, 'accepted', NULL, NULL, NULL, '2026-04-28 06:55:50', NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag_id` int NOT NULL,
  `tag_name` varchar(255) NOT NULL,
  `usage_count` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`tag_id`, `tag_name`, `usage_count`) VALUES
(1, 'student', 0),
(2, 'shared-use', 0),
(3, 'like-new', 0),
(4, 'urgent', 0),
(5, 'exchange', 0),
(6, 'coursework', 0),
(7, 'moving-out', 0),
(8, 'compact', 0),
(9, 'pickup-only', 0),
(10, 'home-essential', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `bio` text,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `points` int DEFAULT '50',
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `total_ratings` int DEFAULT '0',
  `items_lent` int DEFAULT '0',
  `items_borrowed` int DEFAULT '0',
  `items_given` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `first_name`, `last_name`, `bio`, `location`, `latitude`, `longitude`, `points`, `average_rating`, `total_ratings`, `items_lent`, `items_borrowed`, `items_given`, `is_active`, `created_at`, `updated_at`, `profile_image`) VALUES
(1, 'alex.turner@roehampton.ac.uk', '$2b$10$LfSszi8yuKSH3Q0xuacgVOfM0PSSta6x97YN685ROgM2n6nmMDZHe', 'Alex', 'Turner', 'Computer science student who likes sharing useful study items. Usually available around campus on weekdays.', 'Roehampton, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:46', NULL),
(2, 'sarah.khan@roehampton.ac.uk', '$2b$10$XS976wXNYqCjoJcASD7JqeJsNnrB35bJkG1i5qkSfx2vrMMEGsGr6', 'Sarah', 'Khan', 'Postgraduate student based in Putney. Happy to pass on items that are still useful to others.', 'Putney, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(3, 'james.wilson@roehampton.ac.uk', '$2b$10$b4lHyhYiliVJImduM1oUm.WBHDQVFoNl9YzI0qeV/A4tZ3pN9UjIa', 'James', 'Wilson', 'Enjoys cooking and keeping things practical. Usually responds in the evening.', 'Wandsworth, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(4, 'emma.clarke@roehampton.ac.uk', '$2b$10$2U3J0uaCrck/ZmRZg7fTg.T0w8K6pSb5Se1.AhkRzfpVQt8pTi9k2', 'Emma', 'Clarke', 'Keeps active and likes simple item swaps. Prefers clear communication and arranged pickup times.', 'Barnes, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(5, 'daniel.lee@roehampton.ac.uk', '$2b$10$TxCde1B0UX570ghJWR9HCenPjAwKNwpUpC200Coi0HsK3Fjm1Nenm', 'Daniel', 'Lee', 'Final-year student clearing out spare home items. Mostly shares things that are still in solid condition.', 'Fulham, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(6, 'olivia.brown@roehampton.ac.uk', '$2b$10$zYQGYEzdDoOwF1gVn8R4huq.vV7VEjjoW3NjClOLgC98Y.VpbV3yO', 'Olivia', 'Brown', 'Often lends books and revision materials to other students. Based near Clapham.', 'Clapham, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(7, 'noah.davis@roehampton.ac.uk', '$2b$10$vLP6lTp7E7dMrgxWNksWmuXfeF3jaF5mt/awWvA2DOs1ONXXQj5kW', 'Noah', 'Davis', 'Tech-friendly student with a few spare accessories and home items. Open to swaps for useful essentials.', 'Tooting, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(8, 'mia.evans@roehampton.ac.uk', '$2b$10$NopsGh9iRi55vH880mEnceQQhk9T2ZqQnFEUh83GTW4sQmPgufrdS', 'Mia', 'Evans', 'Likes keeping things tidy and passing on items instead of wasting them. Usually free on weekends.', 'Richmond, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(9, 'liam.taylor@roehampton.ac.uk', '$2b$10$S7qjz1d/tTuRzI0kDCct4.4Hs9t1e9QdWaFGaxTmoGoplLppBxhUC', 'Liam', 'Taylor', 'Sports enthusiast who shares equipment when it is not being used. Quick to reply when available.', 'Kingston, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(10, 'ava.moore@roehampton.ac.uk', '$2b$10$zM6Q2TN8zQ29XdIAZBS4k.4R80ZChj7feBdLda92MOdPRaBaNjMoW', 'Ava', 'Moore', 'Moving between student places and trying to keep things simple. Happy to give away practical items.', 'Hammersmith, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(11, 'ethan.white@roehampton.ac.uk', '$2b$10$e1FryKPnxtISeQ3LodzZg.ppMP3Vt8gHZywM0t/AUopi5RavQ54RG', 'Ethan', 'White', 'Second-year student interested in databases and systems. Usually lends books and desk items.', 'Chelsea, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(12, 'sophia.martin@roehampton.ac.uk', '$2b$10$h2KYYw/X5zRppwbnv7ETq.iWtRMFj.yNA1GHNZ1c.DuiaMYmm8H9m', 'Sophia', 'Martin', 'Keeps spare accessories and kitchen items in good condition. Prefers local pickup.', 'Putney, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(13, 'lucas.hall@roehampton.ac.uk', '$2b$10$VSWt3Uox9g2LSLgPzxC35OFXBMtoZ.MDjTRgNWoSMmksyFknijDNa', 'Lucas', 'Hall', 'Enjoys cooking and sharing appliances that still have plenty of use left. Based in Wimbledon.', 'Wimbledon, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(14, 'amelia.young@roehampton.ac.uk', '$2b$10$LzVPVZMsM0Fg//fYLIgc5ejhCbtl3S3Q7wRNbA8iCrYmgVtLVWEV2', 'Amelia', 'Young', 'Fitness-focused student with a few sports items to lend or swap. Flexible with collection times.', 'Battersea, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(15, 'harry.king@roehampton.ac.uk', '$2b$10$Shn2umyt0PjnQ8qfrFkFBOVbBHIL18P/ulbP6H869WowT6Bwz6UIS', 'Harry', 'King', 'Trying to keep useful items in circulation instead of throwing them away. Mostly shares furniture and room essentials.', 'Southfields, London', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-03-19 00:25:51', '2026-04-07 17:39:47', NULL),
(16, 'mnorb@is.here', '$2b$10$.3NT58vNSEe3NYUmdgV1tOHoI/xkYoMOFCfeuXSwlre6TDz45Cbhm', 'Mukhammadsaiid', 'Norbaev', 'i am changing my bio again now better looking', 'Roehampton', NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-04-23 05:00:24', '2026-04-28 07:55:24', '/images/profiles/1777328206358-photo_2023-05-15_19-11-31.jpg'),
(17, 'mqueen@here.io', '$2b$10$a6ktfv2Wui.VMK9gcYWrkuXTiJXjvhsc0rzHEgM1xyHU.t5JkTSm.', 'McQueen', 'RedCar', NULL, NULL, NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-04-28 02:36:44', '2026-04-28 02:36:44', NULL),
(19, 'another@one.com', '$2b$10$RHC5En9.QAPXWEur597x6uSdNHhdp1eiUm21Zr6Wvka/F7axTvetG', 'Mukhammadsaiid', 'Norbaev', NULL, NULL, NULL, NULL, 50, 0.00, 0, 0, 0, 0, 1, '2026-04-28 08:03:32', '2026-04-28 08:03:32', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`listing_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `listing_tags`
--
ALTER TABLE `listing_tags`
  ADD PRIMARY KEY (`listing_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD UNIQUE KEY `request_id_2` (`request_id`,`rater_id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `rater_id` (`rater_id`),
  ADD KEY `rated_id` (`rated_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `requester_id` (`requester_id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `tag_name` (`tag_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `listing_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `rating_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `request_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `listings_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `listing_tags`
--
ALTER TABLE `listing_tags`
  ADD CONSTRAINT `listing_tags_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`listing_id`),
  ADD CONSTRAINT `listing_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requests` (`request_id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requests` (`request_id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`rater_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`rated_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`listing_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
