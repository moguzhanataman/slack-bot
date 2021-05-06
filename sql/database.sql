-- Create necessary tables. Refer to [design.md] document for design decisions.

-- drop table if exists users;
-- drop table if exists commands;
-- drop table if exists tasks;

create table users(
    id varchar primary key,
    name varchar(255)
);
create table commands(
    id serial primary key,
    name varchar(255),
    factor numeric(6, 2)
);

insert into commands (name, factor) values ('running', 1.25);
insert into commands (name, factor) values ('biking', 1.5);

create table tasks(
    id serial primary key,
    command_id integer references commands(id),
    user_id varchar(255) references users(id),
    value integer
);