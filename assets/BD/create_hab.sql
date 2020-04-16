create database hab;
use hab;

create table location(
	id int primary key not null,
    name varchar(30) not null,
    create_location timestamp default current_timestamp,
    update_location timestamp default current_timestamp on update current_timestamp
);

create table user(
	id int primary key auto_increment,
    name varchar(30) not null,
    surname varchar(60) not null,
    profile_picture varchar(255) default 'sin imagen',
    email varchar(30) not null unique,
    password varchar(32) not null,
    location_id int not null,
    create_user timestamp default current_timestamp,
    update_user timestamp default current_timestamp on update current_timestamp,
    constraint fk_location_id foreign key (location_id) references location(id)
);

create table type(
	id int primary key auto_increment,
    name varchar(30) not null,
    create_type timestamp default current_timestamp,
    update_type timestamp default current_timestamp on update current_timestamp
);

create table category(
	id int primary key auto_increment,
    name varchar(30) not null,
    create_category timestamp default current_timestamp,
    update_category timestamp default current_timestamp on update current_timestamp
);

create table feedback(
	id int primary key auto_increment,
    title varchar(60) not null,
    text varchar(255) not null,
    image varchar(255) default 'sin imagen',
    tag varchar(30) default 'sin etiqueta',
    from_user_id int not null,
    to_user_id int not null,
    type_id int not null,
    category_id int not null,
    create_feedback timestamp default current_timestamp,
    update_feedback timestamp default current_timestamp on update current_timestamp,
    constraint fk_from_user_id foreign key (from_user_id) references user(id),
    constraint fk_to_user_id foreign key (to_user_id) references user(id),
    constraint fk_type_id foreign key (type_id) references type(id),
    constraint fk_category_id foreign key (category_id) references category(id)
);