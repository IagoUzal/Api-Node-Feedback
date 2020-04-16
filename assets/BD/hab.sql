-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hab
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `create_category` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_category` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Personal','2020-04-16 15:10:02','2020-04-16 15:10:02'),(2,'Profesional','2020-04-16 15:10:02','2020-04-16 15:10:02');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(60) NOT NULL,
  `text` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT 'sin imagen',
  `tag` varchar(30) DEFAULT 'sin etiqueta',
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `create_feedback` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_feedback` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_from_user_id` (`from_user_id`),
  KEY `fk_to_user_id` (`to_user_id`),
  KEY `fk_type_id` (`type_id`),
  KEY `fk_category_id` (`category_id`),
  CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `fk_from_user_id` FOREIGN KEY (`from_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_to_user_id` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_type_id` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'Configurar WSL en Windows','Me ayudo a configurar mi pc personal para programar con Ubuntu en Windows','sin imagen','sin etiqueta',1,3,1,1,'2020-04-16 15:10:02','2020-04-16 15:10:02'),(2,'Proyecto de base de datos SQL','Trabaje con en el desarrollo de sistemas de bases de datos y fue de gran ayuda','sin imagen','sin etiqueta',1,3,2,2,'2020-04-16 15:10:02','2020-04-16 15:10:02'),(3,'Me ayudo en la adaptación a mi nueva ciudad','Fue de gran ayuda en mi traslado','sin imagen','sin etiqueta',2,3,1,1,'2020-04-16 15:10:02','2020-04-16 15:10:02'),(4,'UI UX','Trabaje con él en varios proyectos de UI UX y fue una gran referencia para mi','sin imagen','sin etiqueta',3,1,2,2,'2020-04-16 15:10:02','2020-04-16 15:10:02'),(5,'Formacion de sistemas','Me dio la formación interna de sistemas y aprendí muchísimo','sin imagen','sin etiqueta',4,1,1,1,'2020-04-16 15:10:02','2020-04-16 15:10:02');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `create_location` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_location` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Araba/Álava','2020-04-16 15:10:02','2020-04-16 15:10:02'),(2,'Albacete','2020-04-16 15:10:02','2020-04-16 15:10:02'),(3,'Alicante/Alacant','2020-04-16 15:10:02','2020-04-16 15:10:02'),(4,'Almería','2020-04-16 15:10:02','2020-04-16 15:10:02'),(5,'Ávila','2020-04-16 15:10:02','2020-04-16 15:10:02'),(6,'Badajoz','2020-04-16 15:10:02','2020-04-16 15:10:02'),(7,'Balears, Illes','2020-04-16 15:10:02','2020-04-16 15:10:02'),(8,'Barcelona','2020-04-16 15:10:02','2020-04-16 15:10:02'),(9,'Burgos','2020-04-16 15:10:02','2020-04-16 15:10:02'),(10,'Cáceres','2020-04-16 15:10:02','2020-04-16 15:10:02'),(11,'Cádiz','2020-04-16 15:10:02','2020-04-16 15:10:02'),(12,'Castellón/Castelló','2020-04-16 15:10:02','2020-04-16 15:10:02'),(13,'Ciudad Real','2020-04-16 15:10:02','2020-04-16 15:10:02'),(14,'Córdoba','2020-04-16 15:10:02','2020-04-16 15:10:02'),(15,'Coruña, A','2020-04-16 15:10:02','2020-04-16 15:10:02'),(16,'Cuenca','2020-04-16 15:10:02','2020-04-16 15:10:02'),(17,'Girona','2020-04-16 15:10:02','2020-04-16 15:10:02'),(18,'Granada','2020-04-16 15:10:02','2020-04-16 15:10:02'),(19,'Guadalajara','2020-04-16 15:10:02','2020-04-16 15:10:02'),(20,'Gipuzkoa','2020-04-16 15:10:02','2020-04-16 15:10:02'),(21,'Huelva','2020-04-16 15:10:02','2020-04-16 15:10:02'),(22,'Huesca','2020-04-16 15:10:02','2020-04-16 15:10:02'),(23,'Jaén','2020-04-16 15:10:02','2020-04-16 15:10:02'),(24,'León','2020-04-16 15:10:02','2020-04-16 15:10:02'),(25,'Lleida','2020-04-16 15:10:02','2020-04-16 15:10:02'),(26,'Rioja, La','2020-04-16 15:10:02','2020-04-16 15:10:02'),(27,'Lugo','2020-04-16 15:10:02','2020-04-16 15:10:02'),(28,'Madrid','2020-04-16 15:10:02','2020-04-16 15:10:02'),(29,'Málaga','2020-04-16 15:10:02','2020-04-16 15:10:02'),(30,'Murcia','2020-04-16 15:10:02','2020-04-16 15:10:02'),(31,'Navarra','2020-04-16 15:10:02','2020-04-16 15:10:02'),(32,'Ourense','2020-04-16 15:10:02','2020-04-16 15:10:02'),(33,'Asturias','2020-04-16 15:10:02','2020-04-16 15:10:02'),(34,'Palencia','2020-04-16 15:10:02','2020-04-16 15:10:02'),(35,'Palmas, Las','2020-04-16 15:10:02','2020-04-16 15:10:02'),(36,'Pontevedra','2020-04-16 15:10:02','2020-04-16 15:10:02'),(37,'Salamanca','2020-04-16 15:10:02','2020-04-16 15:10:02'),(38,'Santa Cruz de Tenerife','2020-04-16 15:10:02','2020-04-16 15:10:02'),(39,'Cantabria','2020-04-16 15:10:02','2020-04-16 15:10:02'),(40,'Segovia','2020-04-16 15:10:02','2020-04-16 15:10:02'),(41,'Sevilla','2020-04-16 15:10:02','2020-04-16 15:10:02'),(42,'Soria','2020-04-16 15:10:02','2020-04-16 15:10:02'),(43,'Tarragona','2020-04-16 15:10:02','2020-04-16 15:10:02'),(44,'Teruel','2020-04-16 15:10:02','2020-04-16 15:10:02'),(45,'Toledo','2020-04-16 15:10:02','2020-04-16 15:10:02'),(46,'Valencia/València','2020-04-16 15:10:02','2020-04-16 15:10:02'),(47,'Valladolid','2020-04-16 15:10:02','2020-04-16 15:10:02'),(48,'Bizkaia','2020-04-16 15:10:02','2020-04-16 15:10:02'),(49,'Zamora','2020-04-16 15:10:02','2020-04-16 15:10:02'),(50,'Zaragoza','2020-04-16 15:10:02','2020-04-16 15:10:02'),(51,'Ceuta','2020-04-16 15:10:02','2020-04-16 15:10:02'),(52,'Melilla','2020-04-16 15:10:02','2020-04-16 15:10:02');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `create_type` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_type` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--

LOCK TABLES `type` WRITE;
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` VALUES (1,'Agradecimiento','2020-04-16 15:10:02','2020-04-16 15:10:02'),(2,'Referencia','2020-04-16 15:10:02','2020-04-16 15:10:02');
/*!40000 ALTER TABLE `type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `surname` varchar(60) NOT NULL,
  `profile_picture` varchar(255) DEFAULT 'sin imagen',
  `email` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `location_id` int(11) NOT NULL,
  `create_user` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_user` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_location_id` (`location_id`),
  CONSTRAINT `fk_location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Iago','Alvarez Uzal','sin imagen','iagouzal@gmail.com','123456',15,'2020-04-16 15:10:02','2020-04-16 15:10:02'),(2,'Mario','Bros Two','sin imagen','mbros@gmail.com','123456',38,'2020-04-16 15:10:02','2020-04-16 15:10:02'),(3,'Sam','Witwicky','sin imagen','wit@gmail.com','123456',31,'2020-04-16 15:10:02','2020-04-16 15:10:02'),(4,'Indiana','Jones Five','sin imagen','jones@gmail.com','123456',37,'2020-04-16 15:10:02','2020-04-16 15:10:02');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-16 17:10:44
