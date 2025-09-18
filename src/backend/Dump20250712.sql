-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ielts_ai_platform
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aichats`
--

DROP TABLE IF EXISTS `aichats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aichats` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `message` text NOT NULL,
  `role` enum('user','assistant') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `aichats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aichats`
--

LOCK TABLES `aichats` WRITE;
/*!40000 ALTER TABLE `aichats` DISABLE KEYS */;
INSERT INTO `aichats` VALUES ('02737c32-3bc6-48e6-9ffd-b36eac5d134a','489b8fa0-7d01-415c-9326-bd7f6ab050c5','\n\nYou tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.\n\nYou can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. \n\nAlternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`\n\nA detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742\n','assistant','2025-05-03 23:44:34'),('29249dcb-6ece-4170-8197-f6312748e611','489b8fa0-7d01-415c-9326-bd7f6ab050c5','tiếng anh là gì','user','2025-05-03 11:50:22'),('319d74a9-73c9-46d1-b837-940174ae7a88','489b8fa0-7d01-415c-9326-bd7f6ab050c5','tiếng anh là gì','user','2025-05-03 23:44:34'),('88d5b179-5231-4bd8-be24-906fd02d6500','489b8fa0-7d01-415c-9326-bd7f6ab050c5','\"Tiếng Anh\" là một ngôn ngữ phổ biến trên toàn thế giới, được sử dụng làm ngôn ngữ giao tiếp chính thức trong nhiều lĩnh vực như kinh doanh, giáo dục, du lịch và công nghệ. Đây cũng là một trong những ngôn ngữ chính thức của nhiều quốc gia trên thế giới như Anh, Mỹ, Canada, Úc và New Zealand. Tiếng Anh cũng là một trong những ngôn ngữ chính thức của Liên Hợp Quốc.','assistant','2025-05-03 11:50:25'),('bbd4157b-0356-4893-982c-b593f0579b11','1195acda-f091-4930-bcd7-da0161a8a316','hello Wiring có thể chấm theo mấy tiêu chí IELTS','user','2025-06-12 11:24:38'),('eb079cb8-1597-475c-a4ef-195cd11e3d5c','1195acda-f091-4930-bcd7-da0161a8a316','Chấm bài Writing trong phần thi IELTS theo 4 tiêu chí chính sau đây:\n\n1. Task Achievement (Đáp ứng yêu cầu của bài viết): Điểm này đánh giá khả năng của bạn trong việc hiểu và thực hiện đúng yêu cầu của đề bài. Bạn cần đảm bảo rằng bạn viết đúng loại bài được yêu cầu (ví dụ: viết một bài luận, một bức thư chính thức, một bài báo cáo, v.v.) và trả lời đầy đủ câu hỏi hoặc thảo luận được yêu cầu.\n\n2. Coherence and Cohesion (Tính mạch lạc và liên kết): Điểm này đánh giá khả năng của bạn trong việc sắp xếp ý tưởng một cách logic và hiệu quả. Bạn cần sử dụng cấu trúc văn phạm phù hợp, dùng liên từ, cụm từ nối và dấu câu để kết nối ý tưởng một cách rõ ràng và mạch lạc.\n\n3. Lexical Resource (Nguồn từ vựng): Điểm này đánh giá khả năng sử dụng từ vựng phong phú, chính xác và linh hoạt. Bạn cần sử dụng từ vựng phù hợp với chủ đề, tránh sử dụng từ vựng lặp lại và tránh sử dụng từ vựng không chính xác.\n\n4. Grammatical Range and Accuracy (Phạm vi và sự chính xác ngữ pháp): Điểm này đánh giá khả năng sử dụng ngữ pháp đúng và linh hoạt. Bạn cần sử dụng cấu trúc ngữ pháp phức tạp, tránh lặp lại cấu trúc ngữ pháp và tránh sử dụng ngữ pháp không chính xác.\n\nĐể đạt điểm cao trong phần Writing của bài thi IELTS, bạn cần luyện tập thường xuyên, sử dụng từ vựng và ngữ pháp chính xác, cũng như thực hành viết các loại bài khác nhau để cải thiện kỹ năng viết của mình.','assistant','2025-06-12 11:24:46');
/*!40000 ALTER TABLE `aichats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combinedwritingscores`
--

DROP TABLE IF EXISTS `combinedwritingscores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combinedwritingscores` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `task1_score_id` varchar(36) DEFAULT NULL,
  `task2_score_id` varchar(36) DEFAULT NULL,
  `combined_score` float NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_combined_user` (`user_id`),
  KEY `fk_task1` (`task1_score_id`),
  KEY `fk_task2` (`task2_score_id`),
  CONSTRAINT `fk_combined_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task1` FOREIGN KEY (`task1_score_id`) REFERENCES `writingscores` (`id`),
  CONSTRAINT `fk_task2` FOREIGN KEY (`task2_score_id`) REFERENCES `writingscores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combinedwritingscores`
--

LOCK TABLES `combinedwritingscores` WRITE;
/*!40000 ALTER TABLE `combinedwritingscores` DISABLE KEYS */;
INSERT INTO `combinedwritingscores` VALUES ('1efa7d62-3645-4d3c-8513-34d72ffe6dc0','1195acda-f091-4930-bcd7-da0161a8a316','b661db65-ba93-40b7-8650-34ae7df6c99e','841b3463-8bae-4acb-901f-5756e71ef985',8.3,'2025-06-01 01:18:26'),('22421003-dbe8-4252-a391-a5f4a8854095','1195acda-f091-4930-bcd7-da0161a8a316','a80dc48e-ed7f-4fd3-bc6d-6451a4aa276a','11743ee1-832c-44b8-8d43-c1e70f0f1e3f',7.3,'2025-06-01 01:50:35'),('98de1694-24af-4fde-b19d-38e24640ff17','489b8fa0-7d01-415c-9326-bd7f6ab050c5','6e24425c-4a6e-4ed3-ac4b-21e88187031b','08c43d35-9972-41cb-acc8-7b1719d47318',8.5,'2025-06-01 01:03:16'),('a135e9c7-49ce-4f3b-b3ea-31ce330a9a8b','1195acda-f091-4930-bcd7-da0161a8a316','a80dc48e-ed7f-4fd3-bc6d-6451a4aa276a','841b3463-8bae-4acb-901f-5756e71ef985',8.4,'2025-06-01 01:48:36');
/*!40000 ALTER TABLE `combinedwritingscores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `essays`
--

DROP TABLE IF EXISTS `essays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `essays` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `task_type` enum('task1','task2') NOT NULL,
  `input_text` text NOT NULL,
  `feedback_text` text DEFAULT NULL,
  `band_score_total` float DEFAULT NULL,
  `band_task_response` float DEFAULT NULL,
  `band_coherence` float DEFAULT NULL,
  `band_grammar` float DEFAULT NULL,
  `band_lexical` float DEFAULT NULL,
  `status` enum('pending','scored','exported') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `essays_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `essays`
--

LOCK TABLES `essays` WRITE;
/*!40000 ALTER TABLE `essays` DISABLE KEYS */;
/*!40000 ALTER TABLE `essays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `essaysuggestions`
--

DROP TABLE IF EXISTS `essaysuggestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `essaysuggestions` (
  `id` char(36) NOT NULL,
  `essay_id` char(36) DEFAULT NULL,
  `sentence_excerpt` text DEFAULT NULL,
  `issue_type` enum('grammar','vocabulary','coherence','task') DEFAULT NULL,
  `suggestion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `essay_id` (`essay_id`),
  CONSTRAINT `essaysuggestions_ibfk_1` FOREIGN KEY (`essay_id`) REFERENCES `essays` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `essaysuggestions`
--

LOCK TABLES `essaysuggestions` WRITE;
/*!40000 ALTER TABLE `essaysuggestions` DISABLE KEYS */;
/*!40000 ALTER TABLE `essaysuggestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exports`
--

DROP TABLE IF EXISTS `exports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exports` (
  `id` char(36) NOT NULL,
  `essay_id` char(36) DEFAULT NULL,
  `format` enum('pdf','docx') NOT NULL,
  `file_url` text NOT NULL,
  `exported_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `essay_id` (`essay_id`),
  CONSTRAINT `exports_ibfk_1` FOREIGN KEY (`essay_id`) REFERENCES `essays` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exports`
--

LOCK TABLES `exports` WRITE;
/*!40000 ALTER TABLE `exports` DISABLE KEYS */;
/*!40000 ALTER TABLE `exports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('credit_card','paypal','momo','vn_pay') NOT NULL,
  `payment_status` enum('success','failed','pending') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `plan` enum('free','student','pro','unlimited') NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES ('1ec57460-b82c-44b7-b890-9e4f3bf9ed90','e52beecc-677e-4984-9679-a4487191c8b1','free','active','2025-06-13','2025-07-13','2025-06-12 11:28:16'),('8c073bed-10ca-4c77-89fc-47f46846f20d','566954ae-d50b-4f4f-98c4-f0137223e46c','free','active','2025-05-22','2025-06-21','2025-05-21 16:30:46'),('af06189c-06c7-40c3-9407-fe92aff61982','44c25294-cd0a-4fc8-88a0-a085524be669','free','active','2025-05-11','2025-06-10','2025-05-10 13:19:37'),('c3d0003d-a2fd-4db3-903a-312176f42c1f','1195acda-f091-4930-bcd7-da0161a8a316','pro','active','2025-06-06','2025-07-06','2025-05-31 18:16:07'),('f30ab0c5-c773-4d0a-8657-00d4ec92ca15','489b8fa0-7d01-415c-9326-bd7f6ab050c5','unlimited','active','2025-05-04','2025-06-03','2025-05-03 13:59:41');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercredits`
--

DROP TABLE IF EXISTS `usercredits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usercredits` (
  `user_id` char(36) NOT NULL,
  `available_credits` int(11) DEFAULT 0,
  `last_updated` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `usercredits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercredits`
--

LOCK TABLES `usercredits` WRITE;
/*!40000 ALTER TABLE `usercredits` DISABLE KEYS */;
INSERT INTO `usercredits` VALUES ('1195acda-f091-4930-bcd7-da0161a8a316',200,'2025-06-05 15:48:32'),('44c25294-cd0a-4fc8-88a0-a085524be669',0,'2025-05-10 13:19:37'),('489b8fa0-7d01-415c-9326-bd7f6ab050c5',999996,'2025-05-03 14:15:48'),('566954ae-d50b-4f4f-98c4-f0137223e46c',2,'2025-05-21 16:30:46'),('e52beecc-677e-4984-9679-a4487191c8b1',2,'2025-06-12 11:28:16');
/*!40000 ALTER TABLE `usercredits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` text NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1195acda-f091-4930-bcd7-da0161a8a316','hd160320001@gmail.com','scrypt:32768:8:1$YkOhKZnJ7IUxGVjA$8306885563b205df224d7f94384272779a36c5515dc2fdebcf04bc1b953a1240c6aabebbb4b990a92fd8d400206e9682df46c52361922bf2fb929315f5e30ef1','trunghieu','user','2025-05-31 18:16:07'),('44c25294-cd0a-4fc8-88a0-a085524be669','tien@gmail.com','scrypt:32768:8:1$allgu8FM4H5GhTmA$d0979a15fc6692fae0d4246b65fbf2723628268872be41305a2fe7945ebdb4425a4c6227a256aefb9acd81ac525eaf8c2c5a9348acfd61aec67db3322ba8c262','tien','user','2025-05-10 13:19:37'),('489b8fa0-7d01-415c-9326-bd7f6ab050c5','hoang@gmail.com','scrypt:32768:8:1$jDjmlOqdjuDgzPex$2e6f8f596cf975935c46129ccd2273b1131e97abaa7a12b8c65b06b914bbb24830f9c2f4d1b21324ff7f27abdb9a3c68dcb59f325c6ce7ea18555a4f2361bb6b','hoang','user','2025-05-02 03:00:46'),('566954ae-d50b-4f4f-98c4-f0137223e46c','admin@gmail.com','scrypt:32768:8:1$uc0tuVOecR30PRtT$482a77caafc52531c37c49387ae0d43dcbb89a63ab5060a16187fc3fe59ab2a5b4d7c3596ba54ca275c77250734fd0465cbc156fa9184c27b60460b6334036e5','admin','admin','2025-05-21 16:30:46'),('7089670a-6f05-4479-88ad-f3b959069c38','nam@gmail.com','scrypt:32768:8:1$MMYwxdlwku7RBSMn$b5dd04ccc79564ba3b0895e8045c04f7992cb4533af4f916c6568f1503d1736f25eb1308438d36feb935de2c1522dc17fd44018399b26dcd88d87c36c02dabe4','nam','user','2025-05-10 13:18:02'),('c4190fcc-fce1-44e1-930f-e10ba8bab8cb','nghia@gmail.com','scrypt:32768:8:1$dPCcNS2dEzufURiY$a99a374c24d9da56b80c7b5a6985c2dd402d32c79c96e53642523475b8605bf19db63ec8a0d325528c15a41abb425c57fcb172db15552d886324ac2a241d4898','nghia','user','2025-05-10 13:12:39'),('e52beecc-677e-4984-9679-a4487191c8b1','admin2@gmail.com','scrypt:32768:8:1$lpJuVIEgktFMNVXE$ea71def37072beb6ebb3d778d3df5404f47de2c768e4b807786dcda794303971d93100bd9c62b439f84aa7a11383189483e3844b5606e26520f035c6cf0e3c23','admin2','user','2025-06-12 11:28:16');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writingscores`
--

DROP TABLE IF EXISTS `writingscores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `writingscores` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `task_type` varchar(20) NOT NULL,
  `essay_text` text NOT NULL,
  `task_achievement` float NOT NULL,
  `coherence_cohesion` float NOT NULL,
  `lexical_resource` float NOT NULL,
  `grammatical_range` float NOT NULL,
  `overall_score` float NOT NULL,
  `task_achievement_feedback` text DEFAULT NULL,
  `coherence_cohesion_feedback` text DEFAULT NULL,
  `lexical_resource_feedback` text DEFAULT NULL,
  `grammatical_range_feedback` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `corrections` text DEFAULT NULL,
  `word_count` int(11) NOT NULL DEFAULT 0,
  `time_spent` int(11) DEFAULT NULL,
  `word_count_penalty` float NOT NULL DEFAULT 0,
  `time_penalty` float NOT NULL DEFAULT 0,
  `adjusted_score` float NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `writingscores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writingscores`
--

LOCK TABLES `writingscores` WRITE;
/*!40000 ALTER TABLE `writingscores` DISABLE KEYS */;
INSERT INTO `writingscores` VALUES ('08c43d35-9972-41cb-acc8-7b1719d47318','489b8fa0-7d01-415c-9326-bd7f6ab050c5','task2','In many countries, young people are leaving rural areas to study and work in cities. What are the causes of this trend, and what effects does it have on rural communities?\n\nThe migration of young people from rural to urban areas is a growing phenomenon in many parts of the world. This essay will examine the primary reasons behind this trend and its significant impacts on rural communities.\n\nThere are several key factors driving young people to leave rural areas. Firstly, cities offer better educational opportunities, with prestigious universities and specialized training programs that are rarely available in rural regions. Secondly, urban areas provide more diverse employment prospects, particularly in modern sectors like technology, finance, and creative industries. Additionally, cities attract young people with their lifestyle benefits, including better entertainment options, cultural activities, and opportunities for social networking.\n\nHowever, this rural exodus has profound effects on rural communities. The most immediate impact is demographic imbalance, as villages and small towns are left with an aging population. This leads to a decrease in local workforce availability, affecting agricultural productivity and local businesses. Furthermore, the departure of young people often results in the closure of schools, shops, and other essential services due to reduced demand, creating a cycle of decline that makes these areas even less attractive to younger generations.\n\nThe social fabric of rural communities is also significantly affected. Traditional cultural practices and local customs may fade as fewer young people remain to carry on these traditions. Family structures are disrupted when children move away, leaving elderly parents without immediate support networks. This can lead to increased isolation and mental health challenges among the remaining rural population.\n\nTo address these issues, governments and local authorities need to implement targeted strategies. These could include developing rural education hubs, creating incentives for businesses to establish in rural areas, and improving infrastructure and connectivity. Additionally, promoting remote work opportunities could allow young people to access urban job markets while remaining in their rural communities.\n\nIn conclusion, while the movement of young people to cities is driven by understandable aspirations for better opportunities, its effects on rural communities are significant and concerning. A balanced approach to rural development is essential to ensure these areas remain viable and vibrant communities for future generations.',8.5,8.5,8.5,8.5,8.5,'Strengths: The essay addresses all parts of the task effectively. The causes and effects of the trend are clearly identified and discussed in detail. Areas for improvement: The essay could have included more specific examples to support the points made. Suggestions for improvement: Try to include specific examples or data to support your arguments.','Strengths: The essay is logically organized and each paragraph is well-structured with a clear focus. The use of linking words and phrases is excellent, ensuring a smooth flow of ideas. Areas for improvement: Some points could have been connected more effectively. Suggestions for improvement: Try to make connections between your points more explicit to guide your reader through your argument.','Strengths: The essay demonstrates a wide range of vocabulary, with appropriate use of synonyms and topic-specific vocabulary. Areas for improvement: There were a few instances of less natural word choice. Suggestions for improvement: Continue to expand your vocabulary but also ensure that you are using words in their correct context.','Strengths: The essay demonstrates a wide range of grammatical structures, used effectively and accurately. Areas for improvement: There were a few minor errors, but these did not significantly impact the clarity of the writing. Suggestions for improvement: Continue to practice using a variety of complex grammatical structures, and pay attention to minor errors.','2025-05-03 23:30:26',NULL,0,NULL,0,0,8.5),('11743ee1-832c-44b8-8d43-c1e70f0f1e3f','1195acda-f091-4930-bcd7-da0161a8a316','task2','In many places, young people are moving to cities to study and work. This is happening more now than before. This essay will talk about why this is happening and how it affects people in the countryside.\n\nOne reason is that cities have better schools and more kinds of jobs. Many young people want to get higher education and find good jobs, which are usually in cities. Also, life in cities is more exciting, with shopping malls, concerts, and many people to meet.\n\nThis trend is not good for rural areas. When young people go away, there are mostly old people left behind. This makes farming and other jobs harder because there are not enough workers. Sometimes schools and shops have to close, because there are not many people left to use them.\n\nAlso, traditions in villages can be lost. If young people don’t stay, they can’t continue local culture. Old people may feel lonely and sad because their children are far away. This can make life in the countryside more difficult.\n\nTo solve this, the government should help rural places more. Maybe they can build more schools or help people work online so they don’t have to leave home. This can make the countryside better.\n\nIn conclusion, young people move to cities for better chances, but this can cause problems in villages. We should do something to stop rural places from getting worse.\n\n',7.5,7,7,7.5,7.2,'The essay addresses the task well by discussing the reasons why young people are moving to cities and the effects of this trend on rural areas. There is a clear position throughout the essay. However, the solutions proposed could be developed in more detail.','The essay is logically organized with clear paragraphing and linking. However, the transitions between ideas could be smoother and more varied.','The essay uses a good range of vocabulary accurately. However, there is room for more varied and sophisticated word choices.','The essay demonstrates a good range of grammatical structures with a high level of accuracy. However, more complex sentence structures could be used to express ideas more precisely.','2025-05-31 18:50:35','{\"grammar\": [{\"original\": \"This essay will talk about why this is happening\", \"correction\": \"This essay will discuss why this is happening\", \"explanation\": \"The verb \'discuss\' is more appropriate in academic writing.\", \"positions\": [{\"start\": 109, \"end\": 157, \"text\": \"This essay will talk about why this is happening\"}]}], \"vocabulary\": [{\"original\": \"better chances\", \"suggestion\": \"better opportunities\", \"explanation\": \"The word \'opportunities\' is more specific and appropriate in this context.\", \"positions\": [{\"start\": 1224, \"end\": 1238, \"text\": \"better chances\"}]}], \"structure\": [{\"issue\": \"The solutions paragraph is underdeveloped.\", \"suggestion\": \"Expand on the solutions proposed and provide more specific examples.\", \"example\": \"To address this issue, the government could invest in rural education by building more schools and providing scholarships for rural students. Additionally, promoting remote work could help retain young talent in rural areas. For instance, the government could provide subsidies for companies that offer remote positions or invest in improving internet infrastructure in rural areas.\"}]}',234,7,0.32,0,6.88),('19a9a6ca-91d9-4160-b38a-1bbed96d0f6c','44c25294-cd0a-4fc8-88a0-a085524be669','task1','The graph shows the number of students from other countries studying in the USA, the UK and Australia from 2005 to 2015.\n\nIn general, the number of students increased. The USA had the highest number.\n\nIn 2005, the USA had 450,000 students, and by 2015, this became 750,000. The UK started with 300,000 and went up to 500,000. Australia had the lowest with 150,000, but it rose to 450,000.\n\nThe USA kept the highest number, and Australia went up a lot.\n\nTo sum up, more students came to study in these countries over time.',6.5,7,6,7,6.6,'You have managed to describe the general trend and provided specific data from the graph. However, you could have provided a more detailed comparison between the countries and discussed the changes over the years more thoroughly.','Your essay is logically organized, and the information is presented in a clear manner. However, you could have used a wider range of linking words and phrases to make your writing more cohesive.','You have used a sufficient range of vocabulary to describe the graph, but there is room for more varied and precise language.','Your sentences are generally well-structured and grammatically correct, but there is room for more complex sentence structures.','2025-05-31 18:10:33','{\"grammar\": [{\"original\": \"this became 750,000\", \"correction\": \"this number increased to 750,000\", \"explanation\": \"The phrase \'this became\' is not the most accurate way to describe an increase in numbers. Instead, use \'this number increased to\'.\", \"positions\": [{\"start\": 253, \"end\": 272, \"text\": \"this became 750,000\"}]}], \"vocabulary\": [{\"original\": \"went up a lot\", \"suggestion\": \"experienced a significant increase\", \"explanation\": \"The phrase \'went up a lot\' is too informal and vague for an academic essay. \'Experienced a significant increase\' is a more formal and precise way to describe this change.\", \"positions\": [{\"start\": 437, \"end\": 450, \"text\": \"went up a lot\"}]}], \"structure\": [{\"issue\": \"Lack of detailed comparison between the countries\", \"suggestion\": \"Include a paragraph that directly compares the countries\' student numbers and their changes over the years\", \"example\": \"While all three countries saw an increase in international students, the USA consistently had the highest numbers. However, Australia experienced the most significant increase, nearly tripling its number of international students over the decade.\"}]}',94,51,1.12,0,5.48),('45874734-8671-4849-a544-58deff3e198c','489b8fa0-7d01-415c-9326-bd7f6ab050c5','task1','The line graph shows changes in the number of international students studying at universities in the UK, USA and Australia between 2005 and 2015.\n\nOverall, all three countries experienced an increase in international student numbers over the decade, with the USA maintaining the highest numbers throughout the period. The most significant growth was seen in Australia.\n\nStarting with the USA, international student numbers rose steadily from approximately 450,000 in 2005 to around 750,000 in 2015. The UK also showed consistent growth, beginning at about 300,000 students and reaching roughly 500,000 by the end of the period.\n\nAustralia, despite having the lowest initial numbers at around 150,000 in 2005, demonstrated the most dramatic increase. Numbers grew rapidly between 2005 and 2010, nearly doubling to 300,000, and continued to rise sharply to reach approximately 450,000 by 2015, almost matching the UK\'s figures.\n\nIn conclusion, while all three countries attracted more international students over the decade, Australia\'s growth rate was particularly noteworthy, suggesting increasing popularity as a study destination.',8.5,8.5,8,8,8.2,'The essay does an excellent job of analyzing and reporting the data from the graph. The writer provides a clear overview of the main trends and supports this with specific data. However, the essay could be improved by including a more detailed comparison of the data between the three countries. For example, the writer could have compared the rate of increase between the countries.','The essay is logically organized and the information is presented in a clear, coherent manner. The writer uses a variety of cohesive devices effectively, such as \'starting with\', \'also\', \'despite\', and \'in conclusion\'. However, the writer could use a wider range of linking words and phrases to further improve coherence and cohesion.','The writer uses a good range of vocabulary to describe the trends and data, such as \'rose steadily\', \'consistent growth\', \'dramatic increase\', and \'rapidly\'. However, the writer could use more varied language to describe the numbers and trends. For example, instead of repeatedly using \'approximately\', the writer could use synonyms like \'roughly\' or \'about\'.','The essay demonstrates a good range of grammatical structures, with a mix of simple and complex sentences. The writer uses the past simple tense correctly to describe past trends. However, there are a few minor errors, such as the use of \'maintaining\' instead of \'maintained\'. The writer could also use more varied sentence structures to further improve the grammatical range.','2025-05-03 22:56:33',NULL,0,NULL,0,0,8.2),('6e24425c-4a6e-4ed3-ac4b-21e88187031b','489b8fa0-7d01-415c-9326-bd7f6ab050c5','task1','The line graph shows changes in the number of international students studying at universities in the UK, USA and Australia between 2005 and 2015.\n\nOverall, all three countries experienced an increase in international student numbers over the decade, with the USA maintaining the highest numbers throughout the period. The most significant growth was seen in Australia.\n\nStarting with the USA, international student numbers rose steadily from approximately 450,000 in 2005 to around 750,000 in 2015. The UK also showed consistent growth, beginning at about 300,000 students and reaching roughly 500,000 by the end of the period.\n\nAustralia, despite having the lowest initial numbers at around 150,000 in 2005, demonstrated the most dramatic increase. Numbers grew rapidly between 2005 and 2010, nearly doubling to 300,000, and continued to rise sharply to reach approximately 450,000 by 2015, almost matching the UK\'s figures.\n\nIn conclusion, while all three countries attracted more international students over the decade, Australia\'s growth rate was particularly noteworthy, suggesting increasing popularity as a study destination.',8.5,8.5,8,8.5,8.4,'The essay does an excellent job of describing the data presented in the graph. The writer has clearly understood the data and has reported it accurately, with a clear overview and specific details. However, the writer could have included more specific comparisons between the countries.','The essay is well-structured and logically organized. The writer uses a variety of linking words and cohesive devices effectively. However, the writer could have made better use of paragraphing to separate the description of each country\'s data.','The writer uses a good range of vocabulary and demonstrates an ability to use less common and idiomatic language. However, there is some repetition of words and phrases, such as \'increase\' and \'numbers\', which could have been avoided with a wider lexical range.','The writer demonstrates a good range of grammatical structures and uses them accurately. However, there are a few minor errors and inconsistencies in tense usage.','2025-05-31 18:03:16','{\"grammar\": [{\"original\": \"Numbers grew rapidly between 2005 and 2010, nearly doubling to 300,000, and continued to rise sharply to reach approximately 450,000 by 2015, almost matching the UK\'s figures.\", \"correction\": \"The number of students grew rapidly between 2005 and 2010, nearly doubling to 300,000, and continued to rise sharply to reach approximately 450,000 by 2015, almost matching the UK\'s figures.\", \"explanation\": \"The word \'numbers\' is too vague in this context. It\'s better to specify what these numbers represent, in this case, \'the number of students\'.\", \"positions\": [{\"start\": 750, \"end\": 925, \"text\": \"Numbers grew rapidly between 2005 and 2010, nearly doubling to 300,000, and continued to rise sharply to reach approximately 450,000 by 2015, almost matching the UK\'s figures.\"}]}], \"vocabulary\": [{\"original\": \"increase\", \"suggestion\": \"growth\", \"explanation\": \"To avoid repetition, it\'s better to use a variety of words to describe the same concept. \'Growth\' could be used as a synonym for \'increase\'.\", \"positions\": [{\"start\": 191, \"end\": 199, \"text\": \"increase\"}, {\"start\": 740, \"end\": 748, \"text\": \"increase\"}]}], \"structure\": [{\"issue\": \"The description of each country\'s data is not separated by paragraphs.\", \"suggestion\": \"Use a new paragraph for each country\'s data to improve readability and structure.\", \"example\": \"Starting with the USA, international student numbers rose steadily from approximately 450,000 in 2005 to around 750,000 in 2015.\\n\\nThe UK also showed consistent growth, beginning at about 300,000 students and reaching roughly 500,000 by the end of the period.\\n\\nAustralia, despite having the lowest initial numbers at around 150,000 in 2005, demonstrated the most dramatic increase.\"}]}',166,461,0,0,8.4),('841b3463-8bae-4acb-901f-5756e71ef985','1195acda-f091-4930-bcd7-da0161a8a316','task2','In many countries, young people are leaving rural areas to study and work in cities. What are the causes of this trend, and what effects does it have on rural communities?\n\nThe migration of young people from rural to urban areas is a growing phenomenon in many parts of the world. This essay will examine the primary reasons behind this trend and its significant impacts on rural communities.\n\nThere are several key factors driving young people to leave rural areas. Firstly, cities offer better educational opportunities, with prestigious universities and specialized training programs that are rarely available in rural regions. Secondly, urban areas provide more diverse employment prospects, particularly in modern sectors like technology, finance, and creative industries. Additionally, cities attract young people with their lifestyle benefits, including better entertainment options, cultural activities, and opportunities for social networking.\n\nHowever, this rural exodus has profound effects on rural communities. The most immediate impact is demographic imbalance, as villages and small towns are left with an aging population. This leads to a decrease in local workforce availability, affecting agricultural productivity and local businesses. Furthermore, the departure of young people often results in the closure of schools, shops, and other essential services due to reduced demand, creating a cycle of decline that makes these areas even less attractive to younger generations.\n\nThe social fabric of rural communities is also significantly affected. Traditional cultural practices and local customs may fade as fewer young people remain to carry on these traditions. Family structures are disrupted when children move away, leaving elderly parents without immediate support networks. This can lead to increased isolation and mental health challenges among the remaining rural population.\n\nTo address these issues, governments and local authorities need to implement targeted strategies. These could include developing rural education hubs, creating incentives for businesses to establish in rural areas, and improving infrastructure and connectivity. Additionally, promoting remote work opportunities could allow young people to access urban job markets while remaining in their rural communities.\n\nIn conclusion, while the movement of young people to cities is driven by understandable aspirations for better opportunities, its effects on rural communities are significant and concerning. A balanced approach to rural development is essential to ensure these areas remain viable and vibrant communities for future generations.',8.5,8.5,8.5,8.5,8.5,'The essay addresses all parts of the task effectively. The writer identifies the causes of the trend of young people moving from rural to urban areas and discusses its effects on rural communities. The conclusion summarizes the main points and provides a balanced view.','The essay is logically organized and well-structured, with clear paragraphing and effective use of linking words. The ideas flow smoothly from one to the next, making the argument easy to follow.','The writer demonstrates a wide range of vocabulary, with appropriate and accurate use of words and phrases. However, there is room for more varied and complex vocabulary.','The essay shows a good range of grammatical structures, used accurately. There are no significant errors, but there is potential for more complex sentence structures.','2025-05-31 18:18:26','{\"grammar\": [], \"vocabulary\": [{\"original\": \"better opportunities\", \"suggestion\": \"superior opportunities\", \"explanation\": \"The word \'superior\' is more formal and academic, and can add variety to the vocabulary used.\", \"positions\": [{\"start\": 2419, \"end\": 2439, \"text\": \"better opportunities\"}]}], \"structure\": [{\"issue\": \"The essay could benefit from more complex sentence structures.\", \"suggestion\": \"Try to use more complex sentence structures, such as conditionals, relative clauses, and passive voice.\", \"example\": \"If governments and local authorities were to implement targeted strategies, such as developing rural education hubs and promoting remote work opportunities, it could potentially allow young people to access urban job markets while still residing in their rural communities.\"}]}',377,2,0,0,8.5),('a80dc48e-ed7f-4fd3-bc6d-6451a4aa276a','1195acda-f091-4930-bcd7-da0161a8a316','task1','The graph illustrates the number of international students studying in the USA, the UK, and Australia between 2005 and 2015.\n\nOverall, the total number of students increased significantly in all three countries. The USA consistently had the highest number of students, while Australia experienced the fastest growth.\n\nIn 2005, the USA hosted about 450,000 students, and this figure steadily rose to 750,000 by 2015. The UK started with approximately 300,000 students, increasing gradually to reach 500,000 in 2015. Australia had the lowest number initially, at around 150,000, but saw a remarkable rise to 450,000 by the end of the period.\n\nDespite Australia starting with fewer students, its growth rate was substantial, closing the gap with the UK. The USA maintained its lead throughout the decade.\n\nIn conclusion, the number of international students in these three countries grew notably from 2005 to 2015, with Australia showing the most rapid increase. This trend reflects the growing appeal of these destinations for students worldwide.',8.5,8,8,8.5,8.2,'You have done a great job in analyzing and reporting the data from the graph. You have covered all the main features and trends, and your descriptions are accurate and detailed. However, you could have included a bit more specific data to support your points.','Your essay is logically organized, and your ideas are clearly connected. You have used a good range of linking words and phrases. However, you could have used a wider variety of cohesive devices to enhance the flow of your writing.','You have used a good range of vocabulary accurately and appropriately. However, there is room for more variety and precision in your word choice.','You have demonstrated a good range of grammatical structures, and your sentences are mostly error-free. However, there is room for more complex structures to enhance your writing.','2025-05-31 18:48:36','{\"grammar\": [], \"vocabulary\": [{\"original\": \"increased significantly\", \"suggestion\": \"saw a significant increase\", \"explanation\": \"This phrase is more precise and formal, which is suitable for academic writing.\", \"positions\": [{\"start\": 164, \"end\": 187, \"text\": \"increased significantly\"}]}, {\"original\": \"fastest growth\", \"suggestion\": \"most rapid growth\", \"explanation\": \"This phrase is more precise and formal, which is suitable for academic writing.\", \"positions\": [{\"start\": 301, \"end\": 315, \"text\": \"fastest growth\"}]}], \"structure\": [{\"issue\": \"The use of cohesive devices could be improved.\", \"suggestion\": \"Use a wider variety of cohesive devices to enhance the flow of your writing.\", \"example\": \"In 2005, the USA hosted about 450,000 students, a figure which steadily rose to 750,000 by 2015. Meanwhile, the UK started with approximately 300,000 students, a number that increased gradually to reach 500,000 in 2015. On the other hand, Australia had the lowest number initially, at around 150,000, but this saw a remarkable rise to 450,000 by the end of the period.\"}]}',161,30,0,0,8.2),('b661db65-ba93-40b7-8650-34ae7df6c99e','1195acda-f091-4930-bcd7-da0161a8a316','task1','The graph illustrates the number of international students studying in the USA, the UK, and Australia from 2005 to 2015.\n\nOverall, student numbers increased in all three countries. The USA consistently had the highest number, while Australia experienced the fastest growth.\n\nIn 2005, the USA had approximately 450,000 students, rising steadily to 750,000 in 2015. The UK began with 300,000 students and increased to about 500,000 by 2015. Australia started with the fewest students at 150,000 but saw a significant rise to 450,000.\n\nAlthough Australia initially had fewer students, its growth rate was notable, closing the gap with the UK. The USA maintained the lead throughout the period.\n\nIn conclusion, the number of international students increased significantly in these countries over the decade, with Australia showing the most rapid growth.\n',8.5,8.5,8,8.5,8.4,'The essay effectively addresses the task by providing an accurate summary of the data. The writer has included all the key features of the graph and made comparisons where relevant. However, the writer could have included more specific details from the graph.','The essay is well-organized and logically structured. The writer uses a variety of cohesive devices and paragraphing effectively. However, the writer could have used a wider range of linking words.','The writer uses a good range of vocabulary and there is some evidence of less common lexical items. However, the writer could have used a wider range of academic vocabulary.','The writer demonstrates a good range of grammatical structures and uses them with flexibility and accuracy. However, the writer could have used a wider range of complex structures.','2025-05-31 18:18:01','{\"grammar\": [], \"vocabulary\": [{\"original\": \"increased\", \"suggestion\": \"escalated\", \"explanation\": \"Using a variety of synonyms for common words like \'increase\' can demonstrate a wider lexical resource.\", \"positions\": [{\"start\": 147, \"end\": 156, \"text\": \"increased\"}, {\"start\": 403, \"end\": 412, \"text\": \"increased\"}, {\"start\": 744, \"end\": 753, \"text\": \"increased\"}]}, {\"original\": \"fastest growth\", \"suggestion\": \"most substantial growth\", \"explanation\": \"Using less common phrases can demonstrate a wider lexical resource.\", \"positions\": [{\"start\": 258, \"end\": 272, \"text\": \"fastest growth\"}]}], \"structure\": [{\"issue\": \"The essay could benefit from more complex sentence structures.\", \"suggestion\": \"Use a wider range of complex sentence structures to demonstrate grammatical range and accuracy.\", \"example\": \"While the USA consistently had the highest number of students, it was Australia that experienced the most substantial growth.\"}]}',130,3,0.4,0,8),('bea54dd9-19a4-4c1b-9e94-65041130abff','44c25294-cd0a-4fc8-88a0-a085524be669','task1','The line graph shows changes in the number of international students studying at universities in the UK, USA and Australia between 2005 and 2015.\n\nOverall, all three countries experienced an increase in international student numbers over the decade, with the USA maintaining the highest numbers throughout the period. The most significant growth was seen in Australia.\n\nStarting with the USA, international student numbers rose steadily from approximately 450,000 in 2005 to around 750,000 in 2015. The UK also showed consistent growth, beginning at about 300,000 students and reaching roughly 500,000 by the end of the period.\n\nAustralia, despite having the lowest initial numbers at around 150,000 in 2005, demonstrated the most dramatic increase. Numbers grew rapidly between 2005 and 2010, nearly doubling to 300,000, and continued to rise sharply to reach approximately 450,000 by 2015, almost matching the UK\'s figures.\n\nIn conclusion, while all three countries attracted more international students over the decade, Australia\'s growth rate was particularly noteworthy, suggesting increasing popularity as a study destination.',8.5,8.5,8,8.5,8.4,'The essay does an excellent job of describing the data from the graph. It covers all the main trends and provides specific data to support the descriptions. However, the writer could have included more detailed comparisons between the countries.','The essay is well-organized and logically structured. The writer uses a variety of cohesive devices and paragraphing effectively. However, the transitions between some sentences could be smoother.','The essay uses a good range of vocabulary, including words specific to the topic. However, there is room for more variety in the choice of words and phrases.','The essay displays a good range of grammatical structures and uses them accurately. However, the writer could use more complex sentences to demonstrate a higher level of grammatical range.','2025-05-10 13:32:49','{\"grammar\": [], \"vocabulary\": [{\"original\": \"most significant growth\", \"suggestion\": \"most substantial increase\", \"explanation\": \"Using synonyms like \'substantial increase\' instead of \'significant growth\' can demonstrate a wider vocabulary range.\"}, {\"original\": \"dramatic increase\", \"suggestion\": \"remarkable rise\", \"explanation\": \"Using synonyms like \'remarkable rise\' instead of \'dramatic increase\' can demonstrate a wider vocabulary range.\"}], \"structure\": [{\"issue\": \"Lack of complex sentences\", \"suggestion\": \"Use more complex sentences to demonstrate a higher level of grammatical range.\", \"example\": \"Despite having the lowest initial numbers at around 150,000 in 2005, Australia demonstrated the most remarkable rise, with numbers growing rapidly between 2005 and 2010, nearly doubling to 300,000, and continuing to rise sharply to reach approximately 450,000 by 2015, almost matching the UK\'s figures.\"}]}',0,NULL,0,0,8.4);
/*!40000 ALTER TABLE `writingscores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-12  1:47:17
