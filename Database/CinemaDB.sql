CREATE DATABASE CinemaManagementDB;
GO
USE CinemaManagementDB;

CREATE TABLE Movie(
Movie_ID INT IDENTITY(1,1) Primary key,
Title VARCHAR(100),
Release_Year INT,
Duration TIME,
Country VARCHAR(50)
)

create table Actor(
Actor_ID INT IDENTITY(1,1) primary key,
First_Name VARCHAR(50),
Last_Name VARCHAR(50),
Nationality VARCHAR(50),
DOB DATE,
)

create table Hall(
Hall_No INT primary key,
Max_Capacity INT
)

create table Show_Time(
Show_No Int IDENTITY(1,1) primary key,
Date DATE,
Start_Time Time,
Movie_ID INT,
Hall_No INT,
FOREIGN KEY (Movie_ID)
REFERENCES Movie(Movie_ID),
FOREIGN KEY (Hall_No)
REFERENCES Hall(Hall_No)
)

create table Seat(
Seat_No INT,
Row_Letter CHAR(1),
PRIMARY KEY (Seat_No, Row_Letter),
Seat_Type VARCHAR(50),
Hall_No INT,
Foreign KEY (Hall_No)
REFERENCES Hall(Hall_No)
)
create table Supervisor(
Supervisor_ID INT IDENTITY(1,1) Primary Key,
First_Name VARCHAR(50),
Last_Name VARCHAR(50),
Salary INT,
Hall_No INT,
Foreign KEY (Hall_No)
REFERENCES Hall(Hall_No)
)
create table Customer(
Customer_ID INT IDENTITY(1,1) PRIMARY KEY,
First_Name VARCHAR(50),
Last_Name VARCHAR(50),
DOB DATE,
)
Create table Ticket(
Ticket_ID INT IDENTITY(1,1) PRIMARY KEY,
Price INT,
Purchase_TS Time,
Show_No INT,
Foreign key (Show_No)
References Show_Time(Show_No),
Seat_No INT,
Row_Letter CHAR(1),
Foreign key (Seat_No,Row_Letter)
References Seat(Seat_No,Row_Letter),
Hall_No INT,
Foreign KEY (Hall_No)
REFERENCES Hall(Hall_No),
Customer_ID INT,
Foreign KEY (Customer_ID)
REFERENCES Customer(Customer_ID),
Constraint UQ_Ticket UNIQUE (Show_No,Seat_No,Row_Letter,Hall_No)
)
Create Table Customer_Phone_Number(
Customer_ID INT,
Phone_No VarChar(20)
Primary KEY(Customer_ID,Phone_No)
Foreign KEY (Customer_ID)
REFERENCES Customer(Customer_ID)
)
Create Table Stars_In(
Actor_ID INT,
Movie_ID INT,
Primary KEY(Actor_ID,Movie_ID),
Foreign KEY (Actor_ID)
REFERENCES Actor(Actor_ID),
Foreign KEY (Movie_ID)
REFERENCES Movie(Movie_ID)
)
create table Genre_Of_Movie(
Movie_ID INT,
Genre VARCHAR(50),
Primary key(Movie_ID,Genre),
Foreign KEY (Movie_ID)
REFERENCES Movie(Movie_ID)
)
