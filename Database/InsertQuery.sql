-- ═══════════════════════════════════════
-- INSERT MOVIES (15 movies with posters)
-- ═══════════════════════════════════════
INSERT INTO Movie (Title, Release_Year, Duration, Country, Poster_URL) VALUES
('Inception', 2010, '02:28:00', 'USA', 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'),
('Interstellar', 2014, '02:49:00', 'USA', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
('The Dark Knight', 2008, '02:32:00', 'USA', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1nF13v.jpg'),
('Pulp Fiction', 1994, '02:34:00', 'USA', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'),
('The Shawshank Redemption', 1994, '02:22:00', 'USA', 'https://image.tmdb.org/t/p/w500/9cjIGRSQL4bAMWS0HMjXOiJWRtL.jpg'),
('The Matrix', 1999, '02:16:00', 'USA', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'),
('Parasite', 2019, '02:12:00', 'South Korea', 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
('Dune', 2021, '02:35:00', 'USA', 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg'),
('Oppenheimer', 2023, '03:00:00', 'USA', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),
('Spider-Man: Across the Spider-Verse', 2023, '02:20:00', 'USA', 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy7Of61Lnj5Xj704m8.jpg'),
('The Godfather', 1972, '02:55:00', 'USA', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'),
('Fight Club', 1999, '02:19:00', 'USA', 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QI4S2t0POsFj.jpg'),
('Gladiator', 2000, '02:35:00', 'USA', 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgCGkW.jpg'),
('The Lion King', 1994, '01:29:00', 'USA', 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg'),
('Avengers: Endgame', 2019, '03:01:00', 'USA', 'https://image.tmdb.org/t/p/w500/or06FN3Dber5HObMbdc17GGuWA.jpg');

-- ═══════════════════════════════
-- INSERT ACTORS (15 actors)
-- ═══════════════════════════════
INSERT INTO Actor VALUES
('Leonardo', 'DiCaprio', 'American', '1974-11-11'),
('Matthew', 'McConaughey', 'American', '1969-11-04'),
('Christian', 'Bale', 'British', '1974-01-30'),
('John', 'Travolta', 'American', '1954-02-18'),
('Tim', 'Robbins', 'American', '1958-10-16'),
('Keanu', 'Reeves', 'Canadian', '1964-09-02'),
('Song', 'Kang-ho', 'South Korean', '1967-01-17'),
('Timothee', 'Chalamet', 'American', '1995-12-27'),
('Cillian', 'Murphy', 'Irish', '1976-05-25'),
('Shameik', 'Moore', 'American', '1995-05-04'),
('Al', 'Pacino', 'American', '1940-04-25'),
('Brad', 'Pitt', 'American', '1963-12-18'),
('Russell', 'Crowe', 'New Zealander', '1964-04-07'),
('James', 'Earl Jones', 'American', '1931-01-17'),
('Robert', 'Downey Jr.', 'American', '1965-04-04');

-- ═══════════════════════════════
-- INSERT HALLS (5 halls)
-- ═══════════════════════════════
INSERT INTO Hall VALUES
(1, 40),
(2, 40),
(3, 30),
(4, 40),
(5, 30);

-- ═══════════════════════════════════════════════════════════════
-- INSERT SEATS — each hall uses rows A-E, same seat numbers per hall
-- Hall 1: 8 seats/row = 40 seats
-- ═══════════════════════════════════════════════════════════════
INSERT INTO Seat VALUES
(1,'A','Regular',1),(2,'A','Regular',1),(3,'A','Regular',1),(4,'A','Regular',1),
(5,'A','Regular',1),(6,'A','Regular',1),(7,'A','Regular',1),(8,'A','Regular',1),
(1,'B','Regular',1),(2,'B','Regular',1),(3,'B','Regular',1),(4,'B','Regular',1),
(5,'B','Regular',1),(6,'B','Regular',1),(7,'B','Regular',1),(8,'B','Regular',1),
(1,'C','Premium',1),(2,'C','Premium',1),(3,'C','Premium',1),(4,'C','Premium',1),
(5,'C','Premium',1),(6,'C','Premium',1),(7,'C','Premium',1),(8,'C','Premium',1),
(1,'D','Premium',1),(2,'D','Premium',1),(3,'D','Premium',1),(4,'D','Premium',1),
(5,'D','Premium',1),(6,'D','Premium',1),(7,'D','Premium',1),(8,'D','Premium',1),
(1,'E','VIP',1),(2,'E','VIP',1),(3,'E','VIP',1),(4,'E','VIP',1),
(5,'E','VIP',1),(6,'E','VIP',1),(7,'E','VIP',1),(8,'E','VIP',1);

-- Hall 2: 8 seats/row = 40 seats (rows F-J)
INSERT INTO Seat VALUES
(1,'F','Regular',2),(2,'F','Regular',2),(3,'F','Regular',2),(4,'F','Regular',2),
(5,'F','Regular',2),(6,'F','Regular',2),(7,'F','Regular',2),(8,'F','Regular',2),
(1,'G','Regular',2),(2,'G','Regular',2),(3,'G','Regular',2),(4,'G','Regular',2),
(5,'G','Regular',2),(6,'G','Regular',2),(7,'G','Regular',2),(8,'G','Regular',2),
(1,'H','Premium',2),(2,'H','Premium',2),(3,'H','Premium',2),(4,'H','Premium',2),
(5,'H','Premium',2),(6,'H','Premium',2),(7,'H','Premium',2),(8,'H','Premium',2),
(1,'I','Premium',2),(2,'I','Premium',2),(3,'I','Premium',2),(4,'I','Premium',2),
(5,'I','Premium',2),(6,'I','Premium',2),(7,'I','Premium',2),(8,'I','Premium',2),
(1,'J','VIP',2),(2,'J','VIP',2),(3,'J','VIP',2),(4,'J','VIP',2),
(5,'J','VIP',2),(6,'J','VIP',2),(7,'J','VIP',2),(8,'J','VIP',2);

-- Hall 3: 6 seats/row = 30 seats (rows K-O)
INSERT INTO Seat VALUES
(1,'K','Regular',3),(2,'K','Regular',3),(3,'K','Regular',3),
(4,'K','Regular',3),(5,'K','Regular',3),(6,'K','Regular',3),
(1,'L','Regular',3),(2,'L','Regular',3),(3,'L','Regular',3),
(4,'L','Regular',3),(5,'L','Regular',3),(6,'L','Regular',3),
(1,'M','Premium',3),(2,'M','Premium',3),(3,'M','Premium',3),
(4,'M','Premium',3),(5,'M','Premium',3),(6,'M','Premium',3),
(1,'N','Premium',3),(2,'N','Premium',3),(3,'N','Premium',3),
(4,'N','Premium',3),(5,'N','Premium',3),(6,'N','Premium',3),
(1,'O','VIP',3),(2,'O','VIP',3),(3,'O','VIP',3),
(4,'O','VIP',3),(5,'O','VIP',3),(6,'O','VIP',3);

-- Hall 4: 8 seats/row = 40 seats (rows P-T)
INSERT INTO Seat VALUES
(1,'P','Regular',4),(2,'P','Regular',4),(3,'P','Regular',4),(4,'P','Regular',4),
(5,'P','Regular',4),(6,'P','Regular',4),(7,'P','Regular',4),(8,'P','Regular',4),
(1,'Q','Regular',4),(2,'Q','Regular',4),(3,'Q','Regular',4),(4,'Q','Regular',4),
(5,'Q','Regular',4),(6,'Q','Regular',4),(7,'Q','Regular',4),(8,'Q','Regular',4),
(1,'R','Premium',4),(2,'R','Premium',4),(3,'R','Premium',4),(4,'R','Premium',4),
(5,'R','Premium',4),(6,'R','Premium',4),(7,'R','Premium',4),(8,'R','Premium',4),
(1,'S','Premium',4),(2,'S','Premium',4),(3,'S','Premium',4),(4,'S','Premium',4),
(5,'S','Premium',4),(6,'S','Premium',4),(7,'S','Premium',4),(8,'S','Premium',4),
(1,'T','VIP',4),(2,'T','VIP',4),(3,'T','VIP',4),(4,'T','VIP',4),
(5,'T','VIP',4),(6,'T','VIP',4),(7,'T','VIP',4),(8,'T','VIP',4);

-- Hall 5: 6 seats/row = 30 seats (rows U-Y)
INSERT INTO Seat VALUES
(1,'U','Regular',5),(2,'U','Regular',5),(3,'U','Regular',5),
(4,'U','Regular',5),(5,'U','Regular',5),(6,'U','Regular',5),
(1,'V','Regular',5),(2,'V','Regular',5),(3,'V','Regular',5),
(4,'V','Regular',5),(5,'V','Regular',5),(6,'V','Regular',5),
(1,'W','Premium',5),(2,'W','Premium',5),(3,'W','Premium',5),
(4,'W','Premium',5),(5,'W','Premium',5),(6,'W','Premium',5),
(1,'X','Premium',5),(2,'X','Premium',5),(3,'X','Premium',5),
(4,'X','Premium',5),(5,'X','Premium',5),(6,'X','Premium',5),
(1,'Y','VIP',5),(2,'Y','VIP',5),(3,'Y','VIP',5),
(4,'Y','VIP',5),(5,'Y','VIP',5),(6,'Y','VIP',5);

-- ═══════════════════════════════════════════
-- INSERT SHOW TIMES (30 showtimes)
-- ═══════════════════════════════════════════
INSERT INTO Show_Time VALUES
('2026-05-10','14:00:00',1,1),('2026-05-10','18:00:00',1,2),
('2026-05-10','21:00:00',2,1),('2026-05-10','15:30:00',3,3),
('2026-05-11','14:00:00',4,4),('2026-05-11','17:00:00',5,2),
('2026-05-11','19:30:00',6,3),('2026-05-11','21:00:00',7,1),
('2026-05-12','13:00:00',8,5),('2026-05-12','16:00:00',9,4),
('2026-05-12','19:00:00',10,2),('2026-05-12','21:30:00',11,1),
('2026-05-13','14:30:00',12,3),('2026-05-13','17:00:00',13,5),
('2026-05-13','20:00:00',14,4),('2026-05-13','22:00:00',15,1),
('2026-05-14','15:00:00',1,3),('2026-05-14','18:30:00',2,2),
('2026-05-14','21:00:00',5,1),('2026-05-14','16:00:00',8,4),
('2026-05-15','14:00:00',3,1),('2026-05-15','17:00:00',7,5),
('2026-05-15','19:30:00',10,3),('2026-05-15','22:00:00',15,2),
('2026-05-16','13:30:00',9,1),('2026-05-16','16:00:00',11,4),
('2026-05-16','18:30:00',12,5),('2026-05-16','21:00:00',4,2),
('2026-05-17','15:00:00',6,1),('2026-05-17','18:00:00',14,3);

-- ═══════════════════════════════
-- INSERT SUPERVISORS (5)
-- ═══════════════════════════════
INSERT INTO Supervisor VALUES
('Ahmed', 'Ali', 5000, 1),
('Sara', 'Hassan', 5500, 2),
('Mohamed', 'Ibrahim', 4800, 3),
('Layla', 'Farouk', 5200, 4),
('Karim', 'Nabil', 4900, 5);

-- ═══════════════════════════════
-- INSERT CUSTOMERS (10)
-- ═══════════════════════════════
INSERT INTO Customer VALUES
('Omar', 'Khaled', '2000-05-10'),
('Mona', 'Youssef', '1998-08-15'),
('Ali', 'Mahmoud', '1995-03-22'),
('Fatima', 'Nasser', '2001-12-01'),
('Youssef', 'Salem', '1997-07-14'),
('Nour', 'Adel', '1999-01-20'),
('Hana', 'Mostafa', '2002-06-30'),
('Tarek', 'Gamal', '1996-11-05'),
('Dina', 'Samir', '2000-09-18'),
('Hassan', 'Fathy', '1994-04-12');

-- ═══════════════════════════════════
-- INSERT CUSTOMER PHONE NUMBERS
-- ═══════════════════════════════════
INSERT INTO Customer_Phone_Number VALUES
(1,'01012345678'),(1,'01198765432'),
(2,'01234567890'),(3,'01055667788'),
(4,'01122334455'),(5,'01099887766'),
(6,'01011223344'),(7,'01566778899'),
(8,'01277889900'),(9,'01033445566'),
(10,'01144556677');

-- ═══════════════════════════════════
-- INSERT TICKETS (8 tickets)
-- ═══════════════════════════════════
INSERT INTO Ticket (Price, Show_No, Seat_No, Row_Letter, Hall_No, Customer_ID) VALUES
(50,1,1,'A',1,1),(50,1,2,'A',1,2),
(150,1,3,'E',1,3),(50,2,1,'F',2,4),
(100,3,1,'C',1,5),(50,5,1,'P',4,6),
(100,10,3,'R',4,7),(150,8,2,'T',1,8);

-- ═══════════════════════════════════
-- INSERT STARS_IN (actor-movie)
-- ═══════════════════════════════════
INSERT INTO Stars_In VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10),
(11,11),(12,12),(13,13),(14,14),(15,15);

-- ═══════════════════════════════════
-- INSERT GENRES
-- ═══════════════════════════════════
INSERT INTO Genre_Of_Movie VALUES
(1,'Sci-Fi'),(1,'Action'),(1,'Thriller'),
(2,'Sci-Fi'),(2,'Drama'),(2,'Adventure'),
(3,'Action'),(3,'Drama'),(3,'Crime'),
(4,'Crime'),(4,'Drama'),
(5,'Drama'),
(6,'Sci-Fi'),(6,'Action'),
(7,'Thriller'),(7,'Drama'),(7,'Comedy'),
(8,'Sci-Fi'),(8,'Adventure'),
(9,'Drama'),(9,'Thriller'),
(10,'Animation'),(10,'Action'),(10,'Adventure'),
(11,'Crime'),(11,'Drama'),
(12,'Drama'),(12,'Thriller'),
(13,'Action'),(13,'Drama'),(13,'Adventure'),
(14,'Animation'),(14,'Drama'),(14,'Family'),
(15,'Action'),(15,'Sci-Fi'),(15,'Adventure');