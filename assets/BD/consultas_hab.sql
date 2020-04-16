use hab;

select * from user;
select * from feedback;
select * from location;
select * from type;

-- Feedback tipo De Para
select a.name as Es, b.name as De, c.name as Para, title as Titulo, text as Feedback, d.name as Categoria from feedback
inner join type a on a.id = type_id
inner join user b on b.id = from_user_id
inner join user c on c.id = to_user_id
inner join category d on d.id = category_id;


-- Usuarios y sus localidades
select user.name as Nombre, user.surname as Apellidos, location.name as Localidad from user
inner join location on location.id = location_id;