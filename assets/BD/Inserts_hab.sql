use hab;

-- Provincias Spain como location
insert into location (id, name)
values 
(2,'Albacete'),
	(3,'Alicante/Alacant'),
	(4,'Almería'),
	(1,'Araba/Álava'),
	(33,'Asturias'),
	(5,'Ávila'),
	(6,'Badajoz'),
	(7,'Balears, Illes'),
	(8,'Barcelona'),
	(48,'Bizkaia'),
	(9,'Burgos'),
	(10,'Cáceres'),
	(11,'Cádiz'),
	(39,'Cantabria'),
	(12,'Castellón/Castelló'),
	(51,'Ceuta'),
	(13,'Ciudad Real'),
	(14,'Córdoba'),
	(15,'Coruña, A'),
	(16,'Cuenca'),
	(20,'Gipuzkoa'),
	(17,'Girona'),
	(18,'Granada'),
	(19,'Guadalajara'),
	(21,'Huelva'),
	(22,'Huesca'),
	(23,'Jaén'),
	(24,'León'),
	(27,'Lugo'),
	(25,'Lleida'),
	(28,'Madrid'),
	(29,'Málaga'),
	(52,'Melilla'),
	(30,'Murcia'),
	(31,'Navarra'),
	(32,'Ourense'),
	(34,'Palencia'),
	(35,'Palmas, Las'),
	(36,'Pontevedra'),
	(26,'Rioja, La'),
	(37,'Salamanca'),
	(38,'Santa Cruz de Tenerife'),
	(40,'Segovia'),
	(41,'Sevilla'),
	(42,'Soria'),
	(43,'Tarragona'),
	(44,'Teruel'),
	(45,'Toledo'),
	(46,'Valencia/València'),
	(47,'Valladolid'),
	(49,'Zamora'),
	(50,'Zaragoza');
    
    -- Tipo de feedback
    insert into type (name) values ('Agradecimiento');
    insert into type (name) values ('Referencia');
    
    -- Categorias
    insert into category (name) values ('Personal');
    insert into category (name) values ('Profesional');
    
    -- Usuarios
    insert into user (name, surname, email, password, location_id) values ('Iago', 'Alvarez Uzal', 'iagouzal@gmail.com', '123456', 15);
    insert into user (name, surname, email, password, location_id) values ('Mario', 'Bros Two', 'mbros@gmail.com', '123456', 38);
    insert into user (name, surname, email, password, location_id) values ('Sam', 'Witwicky', 'wit@gmail.com', '123456', 31);
    insert into user (name, surname, email, password, location_id) values ('Indiana', 'Jones Five', 'jones@gmail.com', '123456', 37);
    
    -- Feedback
    insert into feedback (title, text, from_user_id, to_user_id, type_id, category_id)
    values ('Configurar WSL en Windows', 'Me ayudo a configurar mi pc personal para programar con Ubuntu en Windows', 1, 3, 1, 1);
    insert into feedback (title, text, from_user_id, to_user_id, type_id, category_id)
    values ('Proyecto de base de datos SQL', 'Trabaje con en el desarrollo de sistemas de bases de datos y fue de gran ayuda', 1, 3, 2, 2);
    insert into feedback (title, text, from_user_id, to_user_id, type_id, category_id)
    values ('Me ayudo en la adaptación a mi nueva ciudad', 'Fue de gran ayuda en mi traslado', 2, 3, 1, 1);
    insert into feedback (title, text, from_user_id, to_user_id, type_id, category_id)
    values ('UI UX', 'Trabaje con él en varios proyectos de UI UX y fue una gran referencia para mi', 3, 1, 2, 2);
    insert into feedback (title, text, from_user_id, to_user_id, type_id, category_id)
    values ('Formacion de sistemas', 'Me dio la formación interna de sistemas y aprendí muchísimo', 4, 1, 1, 1);
    