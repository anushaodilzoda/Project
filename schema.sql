-- Drops the todolist if it exists currently --
DROP DATABASE IF EXISTS toxicsushi;
-- Creates the "todolist" database --
CREATE DATABASE toxicsushi;

USE toxicsushi;

-- Create table for reviews, add ability to leave a score for stars our of 5 --
CREATE TABLE website_reviews (
  id int NOT NULL AUTO_INCREMENT,
  review_title varchar(50) NOT NULL,
  review_author varchar(50) NOT NULL,
  review_content varchar(300) NOT NULL,
  PRIMARY KEY (id)
);
-- Create table for users information, saves password incase user forgets and will email them.
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  user_name varchar(50) NOT NULL,
  user_email varchar(50) NOT NULL,
  user_password varchar(50) NOT NULL,
  user_city varchar(50) NOT NULL,
  user_state varchar(50) NOT NULL,
  user_preferances varchar(500),
  user_favorites varchar(500),
  PRIMARY KEY (id)
);

-- Creates database for specialities of restaurants --
CREATE TABLE speciality (
  id int NOT NULL AUTO_INCREMENT,
  speciality_name varchar(50) NOT NULL,
  speciality_location varchar(50) NOT NULL,
  speciality_author varchar(50) NOT NULL,
  speciality_description varchar(300) NOT NULL,
  speciality_food_type varchar(50) NOT NULL,
  PRIMARY KEY (id)
);