-- Insert Movies
INSERT INTO Movie VALUES
(1, 'Inception', 2010, '02:28:00', 'USA'),
(2, 'Interstellar', 2014, '02:49:00', 'USA'),
(3, 'The Dark Knight', 2008, '02:32:00', 'USA');

-- Insert Actors
INSERT INTO Actor VALUES
(1, 'Leonardo', 'DiCaprio', 'American', '1974-11-11'),
(2, 'Matthew', 'McConaughey', 'American', '1969-11-04'),
(3, 'Christian', 'Bale', 'British', '1974-01-30');

-- Insert Halls
INSERT INTO Hall VALUES
(1, 100),
(2, 150);

-- Insert Show Times
INSERT INTO Show_Time VALUES
(1, '2026-05-01', '18:00:00', 1, 1),
(2, '2026-05-01', '21:00:00', 2, 2),
(3, '2026-05-02', '20:00:00', 3, 1);

-- Insert Seats
INSERT INTO Seat VALUES
(1, 'A', 'Regular', 1),
(2, 'A', 'VIP', 1),
(1, 'B', 'Regular', 2),
(2, 'B', 'VIP', 2);

-- Insert Supervisors
INSERT INTO Supervisor VALUES
(1, 'Ahmed', 'Ali', 5000, 1),
(2, 'Sara', 'Hassan', 5500, 2);

-- Insert Customers
INSERT INTO Customer VALUES
(1, 'Omar', 'Khaled', '2000-05-10'),
(2, 'Mona', 'Youssef', '1998-08-15');

-- Insert Customer Phone Numbers
INSERT INTO Customer_Phone_Number VALUES
(1, '01012345678'),
(1, '01198765432'),
(2, '01234567890');

-- Insert Tickets
INSERT INTO Ticket VALUES
(1, 100, '17:30:00', 1, 1, 'A', 1, 1),
(2, 120, '20:30:00', 2, 2, 'B', 2, 2);

-- Insert Stars_In (Actor-Movie relationship)
INSERT INTO Stars_In VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insert Genre
INSERT INTO Genre_Of_Movie VALUES
(1, 'Sci-Fi'),
(2, 'Sci-Fi'),
(3, 'Action'),
(3, 'Drama');