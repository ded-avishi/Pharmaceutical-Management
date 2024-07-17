-- Relational Schema/Model:

DROP database if exists Pharmacy;
CREATE DATABASE Pharmacy;
USE Pharmacy;

CREATE TABLE Admin_ (
    Username VARCHAR(40) PRIMARY KEY,
    Password_ VARCHAR(40)
);

CREATE TABLE Warehouse (
    Warehouse_ID INT AUTO_INCREMENT,
    Revenue INT DEFAULT 0 CHECK(Revenue >= 0),
    No_of_Orders INT DEFAULT 0 CHECK(No_of_Orders >= 0),
    District VARCHAR(40) NOT NULL,
    City VARCHAR(20) NOT NULL,
    Pincode INT NOT NULL CHECK (Pincode >= 0),
    Admin_Username VARCHAR(40) NOT NULL,
    PRIMARY KEY (Warehouse_ID),
    FOREIGN KEY (Admin_Username) REFERENCES Admin_(Username)
);

CREATE TABLE Product (
    Product_ID INT PRIMARY KEY AUTO_INCREMENT,
    Batch_No INT,
    Prod_Name VARCHAR(40) NOT NULL,
    Brand VARCHAR(40) NOT NULL,
	Feedback VARCHAR(150),
    Price INT NOT NULL CHECK (Price >= 0),
    Prod_Description VARCHAR(150),
    Prod_Type varchar(50),
    Admin_Username VARCHAR(40) NOT NULL,
    FOREIGN KEY (Admin_Username) REFERENCES Admin_(Username)
);

CREATE TABLE Equipment (
    Product_ID INT NOT NULL,
    Model VARCHAR(40) ,
    Warranty VARCHAR(40),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

CREATE TABLE Medicine (
    Product_ID INT NOT NULL,
    Dosage VARCHAR(40) NOT NULL,
    Prescription_Requirement BOOLEAN DEFAULT 0,
    Expiry_Date DATE NOT NULL,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

CREATE TABLE Employee (
    Employee_ID INT AUTO_INCREMENT,
    Emp_Name VARCHAR(40) NOT NULL,
    District VARCHAR(40) NOT NULL,
    City VARCHAR(20) NOT NULL,
    Pincode INT NOT NULL CHECK (Pincode >= 0),
    Salary INT NOT NULL CHECK (Salary >= 0),
    DOB DATE,
    Email VARCHAR(40) NOT NULL UNIQUE,
    Warehouse_ID INT NOT NULL,
    Start_Date DATE,
    PRIMARY KEY (Employee_ID),
    FOREIGN KEY (Warehouse_ID) REFERENCES Warehouse(Warehouse_ID)
);

CREATE TABLE Manager (
    Employee_ID INT NOT NULL,
    Username VARCHAR(40) NOT NULL,
    Password_ VARCHAR(40) NOT NULL,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Discount (
    Discount_Code VARCHAR(10),
    Percentage INT NOT NULL CHECK (Percentage <= 100),
    CHECK (Percentage >= 0),
    Min_Purchase INT DEFAULT 0 CHECK (Min_Purchase >= 0),
    Admin_Username VARCHAR(40) NOT NULL,
    PRIMARY KEY (Discount_Code),
    FOREIGN KEY (Admin_Username) REFERENCES Admin_(Username)
);

CREATE TABLE Supplier (
    Supplier_ID INT AUTO_INCREMENT,
    Name_ VARCHAR(40) NOT NULL,
    PRIMARY KEY (Supplier_ID)
);

CREATE TABLE User_ (
    Username VARCHAR(40),
    Password_ VARCHAR(40),
    Phone VARCHAR(30) NOT NULL,
    Membership_Status VARCHAR(20) NOT NULL,
    District VARCHAR(40) NOT NULL,
    City VARCHAR(20) NOT NULL,
    Pincode INT NOT NULL CHECK (Pincode >= 0),
    PRIMARY KEY (Username, Password_)
);

CREATE TABLE Receives_Discount (
    Username VARCHAR(40),
    Discount_Code VARCHAR(10),
    PRIMARY KEY (Username, Discount_Code),
    FOREIGN KEY (Username) REFERENCES User_(Username),
    FOREIGN KEY (Discount_Code) REFERENCES Discount(Discount_Code)
);

CREATE TABLE Orders (
    Username VARCHAR(40),
    Product_ID INT,
    Quantity INT,
    Prescription VARCHAR(40),
    FOREIGN KEY (Username) REFERENCES User_(Username),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID),
    PRIMARY KEY (Username, Product_ID)
);

CREATE TABLE Restocks (
    Warehouse_ID INT,
    Product_ID INT,
    Quantity INT DEFAULT 1 CHECK (Quantity >= 1),
    FOREIGN KEY (Warehouse_ID) REFERENCES Warehouse(Warehouse_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

CREATE TABLE Supplies (
    Supplier_ID INT,
    Product_ID INT,
    PRIMARY KEY (Supplier_ID, Product_ID),
    FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

CREATE TABLE Stores (
    Warehouse_ID INT,
    Product_ID INT,
    Quantity INT DEFAULT 1 CHECK (Quantity >= 0),
    Minimum_Threshold INT DEFAULT 0 CHECK (Minimum_Threshold >= 0),
    PRIMARY KEY (Warehouse_ID, Product_ID),
    FOREIGN KEY (Warehouse_ID) REFERENCES Warehouse(Warehouse_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

CREATE TABLE employee_phone (
	Employee_ID INT NOT NULL,
    Phone_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE current_orders (
    Username VARCHAR(40) NOT NULL,
    Password_ VARCHAR(40) NOT NULL,
    Order_ VARCHAR(40) NOT NULL,
    Price INT NOT NULL CHECK (Price >= 0),
    Quantity INT NOT NULL CHECK (Quantity >= 0),
	FOREIGN KEY (Username,Password_) REFERENCES User_(Username,Password_)
);

CREATE TABLE past_orders (
    Username VARCHAR(40) NOT NULL,
    Product_ID INT NOT NULL,
    Price INT NOT NULL CHECK (Price >= 0),
    Quantity INT NOT NULL CHECK (Quantity >= 0),
    FOREIGN KEY (Username) REFERENCES User_(Username),
    FOREIGN KEY(Product_ID) REFERENCES Product(Product_ID)
);


INSERT INTO Admin_ (Username, Password_) VALUES('admin', 'admin');

INSERT INTO Warehouse (Warehouse_ID, Revenue, No_of_Orders, District, City, Pincode, Admin_Username) VALUES 
    (1, 123, 5, 'Rohini', 'Delhi', 110001, 'admin'),
    (2, 1, 10, 'Janakpuri', 'Delhi', 110002, 'admin'),
    (3, 98, 12, 'Saket', 'Delhi', 110003, 'admin'),
    (4, 1230, 21, 'Laxmi Nagar', 'Delhi', 110004, 'admin'),
    (5, 56, 521, 'Connaught Place', 'Delhi', 110021, 'admin'),
    (6, 12, 24, 'Vasant Kunj', 'Delhi', 111302, 'admin'),
    (7, 98, 111, 'Mayur Vihar', 'Delhi', 111303, 'admin'),
    (8, 36, 48, 'sector 28', 'Noida', 110005, 'admin'),
    (9, 100, 92, 'sector 17', 'Noida', 110006, 'admin'),
    (10, 59, 14, 'Karol Bagh', 'Delhi',  201304, 'admin');


INSERT INTO Product (Product_ID, Batch_No, Prod_Name, Brand,Feedback, Price, Prod_Description, Prod_Type, Admin_Username) VALUES
(1, 111, 'Ibuprofen Tablets', 'MediRelief','Good product', 7, 'Pain and fever reducer','Medicine', 'admin'),
(2, 112, 'Amoxicillin Capsules', 'HealthCure','Discomfort felt after consumption', 10, 'Antibiotic','Medicine', 'admin'),
(3, 113, 'Aspirin Tablets', 'PainAway','N/A', 6, 'Pain reliever','Medicine', 'admin'),
(4, 114, 'Hydrocortisone Cream', 'SkinCare','N/A', 12, 'Anti-inflammatory','Medicine', 'admin'),
(5, 115, 'Loratadine Tablets', 'AllerClear','N/A', 9, 'Antihistamine','Medicine', 'admin'),
(6, 116, 'Omeprazole Capsules', 'GastroGuard','No after effects', 11, 'Acid reducer','Medicine', 'admin'),
(7, 117, 'Diphenhydramine Syrup', 'SleepEase','Immediate relief', 8, 'Antihistamine and sleep aid','Medicine', 'admin'),
(8, 118, 'Loperamide Tablets', 'Imodium','No after effects', 7, 'Antidiarrheal','Medicine', 'admin'),
(9, 119, 'Epsom Salt', 'WellnessPlus','N/A', 5, 'Relaxing bath soak','Medicine', 'admin'),
(10, 120, 'Vitamin C Tablets', 'NutriCare','Cheap and reliable', 6, 'Immune support','Medicine', 'admin'),
(11, 121, 'Stethoscope', 'MediCare','Cheap and reliable', 25, 'Dual-head design','Equipment' ,'admin'),
(12, 122, 'Digital Scale', 'WeighMaster', 'No after affects',35, 'High-precision measurement','Equipment' , 'admin'),
(13, 123, 'Oxygen Concentrator', 'OxyGenie','N/A', 200, 'Provides supplemental oxygen','Equipment' , 'admin'),
(14, 124, 'ECG Machine', 'HeartCare','Good product', 150, 'Electrocardiogram monitoring','Equipment' , 'admin'),
(15, 125, 'Sphygmomanometer', 'PressurePro','Discomfort after consumption', 20, 'Manual blood pressure measurement','Equipment' , 'admin'),
(16, 126, 'Wheelchair', 'MobilityAid','Immediate relief', 120, 'Foldable and lightweight','Equipment' , 'admin'),
(17, 127, 'Pulse Oximeter', 'OxyCheck','N/A', 30, 'Measures oxygen saturation','Equipment' , 'admin'),
(18, 128, 'Inhaler Spacer', 'AeroFlow', 'Horrible product',15, 'For improved medication delivery','Equipment' , 'admin'),
(19, 129, 'Glucometer', 'SugarCheck', 'Made the condition worse', 40, 'Blood glucose monitoring','Equipment' , 'admin'),
(20, 130, 'Hot/Cold Pack', 'ThermaRelief', 'I died', 10, 'Reusable therapy pack','Equipment' , 'admin');



INSERT INTO Equipment (Product_ID, Model, Warranty) VALUES
	(11, 'DS-100', '1 year'),
	(12, 'WS-2000', '2 years'),
	(13, 'OC-5000', '3 years'),
	(14, 'ECG-300', '2 years'),
	(15, 'SPH-100', '1 year'),
	(16, 'WC-400', '2 years'),
	(17, 'PO-200', '1 year'),
	(18, 'IS-50', '1 year'),
	(19, 'GM-300', '2 years'),
	(20, 'HCP-10', '1 year');



INSERT INTO Medicine (Product_ID, Dosage, Prescription_Requirement, Expiry_Date) VALUES 
    (1, '200mg', 1, '2024-11-30'),
	(2, '500mg', 1, '2023-09-15'),
	(3, '300mg', 1, '2025-03-20'),
	(4, 'N/A', 0, '2024-07-10'),
	(5, '10mg', 1, '2023-12-31'),
	(6, '20mg', 1, '2025-02-28'),
	(7, 'N/A', 0, '2024-10-15'),
	(8, '2mg', 1, '2024-08-20'),
	(9, 'N/A', 0, '2025-01-10'),
	(10, '1000mg', 0, '2024-06-30');


INSERT INTO Employee (Employee_ID, Emp_Name, District, City, Pincode, Salary, DOB, Email, Warehouse_ID, Start_Date) VALUES 
    (1001, 'Noel Tiju', 'Janakpuri', 'Delhi', 110058, 50000, '1990-05-15', 'noel@example.com', 1, '2023-01-15'),
    (1040, 'Haraf Tiju', 'Sector-24', 'Noida', 110010, 60000, '1991-09-12', 'ac@example.com', 1, '2022-01-10'),
    (1002, 'Mehul Goel', 'Saket', 'Delhi', 110017, 55000, '1992-08-21', 'mehul@example.com', 2, '2023-03-10'),
    (1003, 'Rahul Goel', 'Rohini', 'Delhi', 110085, 48000, '1988-11-07', 'rahul@example.com', 3, '2022-12-05'),
    (1004, 'Vimal Raj', 'Laxmi Nagar', 'Delhi', 110092, 52000, '1991-04-30', 'vimal@example.com', 4, '2023-02-20'),
    (1005, 'Hemanth Das', 'Connaught Place', 'Delhi', 110001, 60000, '1987-09-12', 'hemanth@example.com', 5, '2023-04-18'),
    (1006, 'Uday Das', 'Vasant Kunj', 'Delhi', 110070, 58000, '1993-03-25', 'uday@example.com', 6, '2023-06-22'),
    (1007, 'Vivan Rangra', 'Mayur Vihar', 'Delhi', 110091, 53000, '1989-07-19', 'vivan@example.com', 7, '2023-08-12'),
    (1008, 'Vishwa Raj', 'sector 28', 'Noida', 110034, 57000, '1990-12-03', 'vishwa@example.com', 8, '2023-10-05'),
    (1009, 'Armaan Singh', 'sector 17', 'Noida', 110075, 54000, '1994-02-28', 'armaan@example.com', 9, '2023-12-20'),
    (1010, 'Bhargav Raman', 'Karol Bagh', 'Delhi', 110005, 62000, '1995-06-17', 'bhargav@example.com', 10, '2024-01-30'),
    (1011, 'Raj Kumar', 'Sector 32', 'Noida', 210301, 100000, '1995-01-12', 'raj0921@example.com', 10, '2024-01-01'),
    (1012, 'Sanga Karra', 'Sector 129', 'Noida', 210301, 81100, '1995-01-11', 'sanga0921@example.com', 10, '2024-01-11');
    
    
INSERT INTO Manager (Employee_ID, Username, Password_) VALUES 
    (1001, 'manager1', 'pass1'),
    (1002, 'manager2', 'pass2'),
    (1003, 'manager3', 'pass3'),
    (1004, 'manager4', 'pass4'),
    (1005, 'manager5', 'pass5'),
    (1006, 'manager6', 'pass6'),
    (1007, 'manager7', 'pass7'),
    (1008, 'manager8', 'pass8'),
    (1009, 'manager9', 'pass9'),
    (1010, 'manager10', 'pass10');


INSERT INTO Discount (Discount_Code, Percentage, Min_Purchase, Admin_Username) VALUES 
    ('DISC10', 10, 100, 'admin'),
    ('SAVE20', 20, 150, 'admin'),
    ('GET30', 30, 200, 'admin'),
    ('HALFOFF', 50, 250, 'admin'),
    ('SALE60', 60, 300, 'admin'),
    ('BIGSALE70', 70, 350, 'admin'),
    ('MEGA80', 80, 400, 'admin'),
    ('HUGE90', 90, 450, 'admin'),
    ('SUPER100', 100, 500, 'admin'),
    ('FREESHIP', 0, 200, 'admin');


INSERT INTO Supplier (Supplier_ID, Name_) VALUES 
    (1, 'ABC Pharmaceuticals'),
    (2, 'XYZ Medical Supplies'),
    (3, 'MediCo Enterprises'),
    (4, 'HealthCare Solutions Inc.'),
    (5, 'MediPlus Pvt. Ltd.'),
    (6, 'Sunrise Pharma Distributors'),
    (7, 'Global Medical Suppliers'),
    (8, 'CareWell Pharma'),
    (9, 'LifeLine Healthcare'),
    (10, 'MediSource');

INSERT INTO User_ (Username, Password_,Phone, Membership_Status, District, City, Pincode) VALUES 
    ('user1', 'pass1','9900213332', 'Premium', 'Janakpuri', 'Delhi', 110058),
    ('user2', 'pass2','9900213331', 'Basic', 'Saket', 'Delhi', 110017),
    ('user3', 'pass3','9900213333', 'Premium', 'Rohini', 'Delhi', 110085),
    ('user4', 'pass4','9900213334', 'Basic', 'Laxmi Nagar', 'Delhi', 110092),
    ('user5', 'pass5','9900213335', 'Premium', 'Connaught Place', 'Delhi', 110001),
    ('user6', 'pass6','9900213336', 'Basic', 'Vasant Kunj', 'Delhi', 110070),
    ('user7', 'pass7','9900213337', 'Premium', 'Mayur Vihar', 'Delhi', 110091),
    ('user8', 'pass8','9900213338', 'Basic', 'Sector 27', 'Noida', 110034),
    ('user9', 'pass9','9900213339', 'Premium', 'Dwarka', 'Delhi', 110075),
    ('user10', 'pass10','9900213323', 'Basic', 'Sector 11', 'Noida', 110005);

INSERT INTO Receives_Discount (Username, Discount_Code) VALUES 
    ('user1', 'DISC10'),
    ('user1', 'SAVE20'),
    ('user2', 'DISC10'),
    ('user3', 'GET30'),
    ('user4', 'HALFOFF'),
    ('user5', 'SALE60'),
    ('user6', 'HALFOFF'),
    ('user7', 'BIGSALE70'),
    ('user8', 'MEGA80'),
    ('user9', 'HUGE90');
    
INSERT INTO Orders (Username, Product_ID, Quantity, Prescription) VALUES
    ('user1', 1, 2,'200mg (as needed)'),
    ('user2', 3, 1, '300mg (twice a day)'),
    ('user3', 5, 4, '10mg (once a day)'),
    ('user4',  7, 6, 'N/A'),
    ('user5',  10, 1,'1000mg (once a day)'),
    ('user6', 11, 4,'N/A'),
    ('user7',  13, 2,'N/A'),
    ('user8',  15, 3, 'N/A'),
    ('user9',  17, 4, 'N/A'),
    ('user10', 19,1, 'N/A');

INSERT INTO Supplies (Supplier_ID, Product_ID) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
    (4, 11),
    (4, 12),
    (1, 13),
    (2, 14),
    (7, 15),
    (2, 16),
    (3, 17),
    (10, 18),
    (9, 19),
    (8, 20);

INSERT INTO Stores (Warehouse_ID, Product_ID, Quantity, Minimum_Threshold) VALUES
    (1, 1, 50, 20),
    (1, 2, 30, 15),
    (2, 2, 40, 15),
    (3, 3, 30, 10),
    (4, 4, 25, 8),
    (5, 5, 20, 5),
    (6, 6, 30, 12),
    (7, 7, 25, 10),
    (8, 8, 40, 15),
    (9, 9, 35, 12),
    (10, 10, 28, 10),
    (1,11,20,10),
    (2,12,50,35),
    (3,13,30,20),
    (4,14,40,25),
    (5,15,25,25),
    (6,16,35,25),
    (7,17,15,5),
    (8,18,25,15),
    (9,19,26,20),
    (10,20,28,20);

    
INSERT INTO employee_phone (Employee_ID, Phone_number) VALUES
    (1001, '9876543210'),
    (1001, '9900213332'),
    (1001, '7371921234'),
    (1002, '9876543211'),
    (1003, '9876543212'),
    (1004, '9876543213'),
    (1004, '8448192532'),
    (1004, '9242487872'),
    (1005, '9876543214'),
    (1006, '9876543215'),
    (1007, '9876543216'),
    (1008, '9876543217'),
    (1008, '9821924212'),
    (1009, '9876543218'),
    (1010, '9876543219');

INSERT INTO current_orders (Username, Password_, Order_, Price, Quantity) VALUES
    ('user1', 'pass1', 'Product ID-1', 7,1 ),
    ('user2', 'pass2', 'Product ID-2',20,2),
    ('user3', 'pass3', 'Product ID-3',18,3),
    ('user4', 'pass4', 'Product ID-4',48,4),
    ('user5', 'pass5', 'Product ID-5',27,3),
    ('user6', 'pass6', 'Product ID-5', 9,1),
    ('user7', 'pass7', 'Product ID-4',24,2),
    ('user8', 'pass8', 'Product ID-3',18,3),
    ('user9', 'pass9', 'Product ID-2',40,4),
    ('user10', 'pass10', 'Product ID-1',27,3);
    

INSERT INTO past_orders (Username, Product_ID, Price, Quantity) VALUES
    ('user1',  1, 7,1 ),
    ('user2',  2,20,2),
    ('user3',  3,18,3),
    ('user4', 4,48,4),
    ('user5',  5,27,3),
    ('user6', 5, 9,1),
    ('user7', 4,24,2),
    ('user8', 3,18,3),
    ('user9', 2,40,4),
    ('user10', 1,27,3);

    


SELECT* from equipment;
SELECT* from manager;
SELECT* from medicine;
SELECT* from employee;
SELECT* from discount;
SELECT* from orders;
SELECT* from product;
SELECT* from admin_;
SELECT* from receives_discount;
SELECT* from restocks;
SELECT* from orders;
SELECT* from stores;
SELECT* from supplier;
SELECT* from supplies;
SELECT* from user_;
SELECT* from warehouse;
SELECT* from employee_phone;
SELECT* from current_orders;
SELECT* from past_orders;


-- Triggers:


-- 1) Creating a trigger which adds the items that need to be restocked to the table ‘Restocks’. The trigger is set on any update or insert to the table ‘Stores’.

	delimiter |
CREATE TRIGGER Restock_Trigger
AFTER UPDATE ON Stores
FOR EACH ROW
BEGIN
  IF New.Minimum_Threshold > New.Quantity THEN
    INSERT INTO Restocks(Warehouse_ID, Product_ID, Quantity)
    VALUES (New.Warehouse_ID, New.Product_ID, New.Minimum_Threshold + 20);
  END IF;
END |

CREATE TRIGGER Restock_Trigger2
AFTER INSERT ON Stores
FOR EACH ROW
BEGIN
  IF New.Minimum_Threshold > New.Quantity THEN
    INSERT INTO Restocks(Warehouse_ID, Product_ID, Quantity)
    VALUES (New.Warehouse_ID, New.Product_ID, New.Minimum_Threshold + 20);
  END IF;
END |
delimiter ;
-- 2) Creating a trigger which detects when a new product has been registered into the system and automatically adds 5 items of that product to every warehouse as sort of a PR scheme.

delimiter |
CREATE TRIGGER Add_new_Prods
AFTER INSERT ON Product
FOR EACH ROW
BEGIN
	INSERT INTO Stores(Warehouse_ID, Product_ID, Quantity, Minimum_Threshold)
    (SELECT Warehouse_ID, new.Product_ID, 5, 0 FROM Warehouse);
END |
delimiter ;





-- SQL Queries:

-- Related to Retrieving/Updates Products from DB

-- 1) Retrieves the max amount a particular product is stored in any warehouse in a particular city
-- SELECT Id, Total_Quantity, Quantity FROM Orders, (SELECT product.Product_ID AS Id, Prod_Name, Brand, Feedback, Price, Prod_Description, MAX(quantity) AS Total_Quantity FROM product, stores, warehouse WHERE (product.Product_ID = stores.Product_ID) AND (stores.Warehouse_ID = warehouse.Warehouse_ID) AND warehouse.city = %s GROUP BY product.Product_ID) AS Table2 WHERE Id = Product_ID AND Username = %s;


--  2) Updates the cart of the user
-- UPDATE Orders SET Quantity = %s WHERE Product_ID = %s AND Username = %s;


-- 3) Retrieves all products that are currently available for purchase
-- SELECT product.Product_ID, Prod_Name, Brand, Feedback, Price, Prod_Description, MAX(quantity) AS Quantity FROM product, stores, warehouse WHERE (product.Product_ID = stores.Product_ID) AND (stores.Warehouse_ID = warehouse.Warehouse_ID) AND warehouse.city = %s GROUP BY Product_ID;


-- 4) Retrieves Details from the user cart.
-- SELECT Id, Quantity FROM Orders, (SELECT product.Product_ID AS Id FROM product, stores, warehouse WHERE (product.Product_ID = stores.Product_ID) AND (stores.Warehouse_ID = warehouse.Warehouse_ID) AND warehouse.city = %s GROUP BY product.Product_ID) AS Table2 WHERE Id = Product_ID AND Username = %s;


-- 5) Retrieves cart of the user
-- SELECT Id, Prod_Name, Brand, Quantity, Price, Max_Quant FROM Orders, (SELECT product.Product_ID AS Id, Prod_Name, Brand, Feedback, Price, MAX(Quantity) AS Max_Quant FROM product, stores, warehouse WHERE (product.Product_ID = stores.Product_ID) AND (stores.Warehouse_ID = warehouse.Warehouse_ID) AND warehouse.city = %s GROUP BY Product.Product_ID) AS Table2 WHERE Username = %s AND Orders.Product_Id = Table2.Id;

-- 6) Checks whether a certain item is in the cart of the user
-- SELECT * FROM Orders WHERE Username = %s AND Product_ID = %s;

-- 7) Removes product from cart
-- DELETE FROM Orders WHERE Username = %s AND Product_ID = %s;

-- 8) Adds to cart
-- INSERT INTO Orders(Username, Product_ID, Quantity, Prescription) VALUES (%s, %s, %s, %s);

-- 9) Updates revenue generated by a particular warehouse
-- UPDATE Warehouse SET Revenue = Revenue + %s, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = %s;

-- 10) Updates past purchases by the user.
-- INSERT INTO past_orders(Username, Product_ID, Price, Quantity) VALUES (%s, %s, %s, %s);




-- Login/Sign up of both User or Admin

-- Checks which city the user belongs to.
-- 1) SELECT City FROM User_ WHERE Username = %s AND Password_ = %s;

-- Returns the warehouse where the manager works
-- 2)  "SELECT Warehouse_ID FROM Manager NATURAL JOIN Employee WHERE Username = %s AND Password_ = %s;

-- Checks whether a user with a certain username exists in the system.
-- 3) SELECT 1 FROM User_ WHERE Username = %s;

-- Checks whether a user with a certain phone no. exists in the system.
-- 4) SELECT * FROM User_ WHERE Phone = %s;

-- Registers new user into db
-- 5) INSERT INTO User_ (Username, Password_,Phone, Membership_Status, District, City, Pincode) VALUES (%s, %s,%s, %s, %s, %s, %s);



-- Admin Management

-- 1) Updating minimum threshold of a particular product in a warehouse
-- UPDATE Stores SET Minimum_Threshold = %s WHERE Warehouse_ID = %s AND Product_ID = %s;

-- 2) Updating quantity to be 20 more than that of the minimum threshold if the current quantity is lesser than the threshold.
-- UPDATE Stores SET Quantity = Minimum_Threshold + 20 WHERE Quantity < Minimum_Threshold;

-- 3)Viewing User data.
-- SELECT Username,  Membership_Status, District, City, Pincode, SUM(Price) AS Expenditure FROM User_ NATURAL JOIN Past_Orders GROUP BY Username, Membership_Status, District, City, Pincode ORDER BY Expenditure DESC;

-- 4) Viewing Warehouse data.
-- SELECT Warehouse_ID, Revenue, No_of_Orders, District, City, Pincode FROM Warehouse;

-- 5)Viewing data of a particular warehouse.
-- SELECT Warehouse_ID, Revenue, No_of_Orders, District, City, Pincode FROM Warehouse WHERE Warehouse_ID = %s;

-- 6) SELECT * FROM Restocks; 
-- SELECT * FROM Restocks WHERE Warehouse_ID = %s;

-- 7) Fulfilling restock request and subsequently discarding it either generally or for a particular warehouse.
-- DELETE FROM Restocks;
-- DELETE FROM Restocks WHERE Warehouse_ID = %s;


-- 8) Viewing all the products currently being sold in all the warehouses in both cities.
-- SELECT Stores.Warehouse_ID, Product.Prod_Name, Product.Product_ID, Stores.Quantity, Warehouse.City, Warehouse.District, Minimum_Threshold FROM Stores, Warehouse, Product WHERE Stores.Product_ID = Product.Product_ID AND Warehouse.Warehouse_ID = Stores.Warehouse_ID;

-- 9) Viewing all the products currently being sold in a particular warehouse.
-- SELECT Stores.Warehouse_ID, Product.Prod_Name, Product.Product_ID, Stores.Quantity, Warehouse.City, Warehouse.District, Minimum_Threshold FROM Stores, Warehouse, Product WHERE (Stores.Product_ID = Product.Product_ID) AND (Warehouse.Warehouse_ID = Stores.Warehouse_ID) AND Warehouse.Warehouse_ID = %s;

-- 10) Viewing all the products that have been provided by the supplier and can be distributed to any store at any time.
--  SELECT Product.Product_ID, Product.Price, Product.Prod_Name, SUM(Past_Orders.Price) AS Revenue, SUM(Quantity) AS Total_Orders FROM Product, Past_Orders WHERE (Product.Product_ID = Past_Orders.Product_ID) GROUP BY Product.Prod_Name, Product.Product_ID UNION SELECT Product_ID, Price, Prod_Name, 0, 0 FROM Product WHERE Product_ID NOT IN (SELECT Product_ID FROM Past_Orders);

-- 11) Updating inventory.
-- UPDATE Stores SET Quantity = %s, Minimum_Threshold = %s WHERE Warehouse_ID = %s AND Product_ID = %s;

-- 12) Inserting Products into a Warehouse.
-- INSERT Stores (Warehouse_ID, Product_ID, Quantity, Minimum_Threshold) VALUES (%s,%s,%s,%s);

-- 13) Registering New Supplier.
-- INSERT INTO Supplier(Name_) VALUES (%s);

-- 14) Registering New Product.
-- INSERT INTO Product(Batch_No, Prod_Name, Brand, Feedback, Price, Prod_Description, Admin_Username) VALUES (%s,%s,%s,'N/A',%s,%s,'admin');

-- 15) Removing Products from Inventory.
-- DELETE FROM Stores WHERE Product_ID = %s;

-- TRANSACTIONS:

-- The code has 2 conflicting transactions and 4 non-conflicting transactions

-- CONFLICTING TRANSACTIONS

-- 1. If 2 users are buying the same product and one of them goes out of stock

-- Code:

-- -- User 4
-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Stores;
-- SELECT * FROM Past_Orders;
-- SELECT SLEEP(5);

-- INSERT INTO Past_Orders VALUES
-- ('user4',6,6,15);

-- UPDATE Stores SET Quantity = Quantity - 15 WHERE Warehouse_ID = 6 AND Product_Id = 6;
-- UPDATE Warehouse SET Revenue = Revenue + 165, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = 6;

-- COMMIT;
-- SELECT * FROM Stores;
-- SELECT * FROM Past_Orders;

-- -- User 3
-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Stores;
-- SELECT * FROM Past_Orders;
-- SELECT * FROM Warehouse;
-- SELECT SLEEP(5);

-- UPDATE Stores SET Quantity = Quantity - 17 WHERE Warehouse_ID = 6 AND Product_Id = 6;
-- UPDATE Warehouse SET Revenue = Revenue + 187, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = 6;
-- INSERT INTO Past_Orders VALUES
-- ('user3',6,6,17);

-- COMMIT;
-- SELECT * FROM Stores;
-- SELECT * FROM Past_Orders;
-- SELECT * FROM Warehouse;

-- 2. Admin is giving or removing a discount and at the same time the user purchases something

-- Code: 

-- -- Giving Discount

-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Product;
-- SELECT SLEEP(5);

-- UPDATE Product SET Price = Price * 0.9 WHERE Product_ID <> -1;

-- COMMIT;
-- SELECT * FROM Product;

-- -- Purchasing Product

-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Warehouse;
-- SELECT SLEEP(5);

-- UPDATE Stores SET Quantity = Quantity - 7 WHERE Warehouse_ID = 10 AND Product_Id = 20;
-- UPDATE Warehouse SET Revenue = Revenue + 7 * (SELECT Price FROM Product WHERE Product_ID = 20), No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID =10;
-- INSERT INTO Past_Orders VALUES
-- ('user3',10,20,7);

-- COMMIT;
-- SELECT * FROM Warehouse;


-- NON-CONFLICTING TRANSACTIONS

-- 1. 2 managers are restocking their warehouses

-- Code: 

-- -- Warehouse 1
-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Stores;
-- SELECT SLEEP(5);

-- UPDATE Stores 
-- SET Quantity = Quantity + 20 
-- WHERE Quantity < Minimum_Threshold AND Warehouse_ID = 1;

-- INSERT INTO Stores VALUES 
-- (1,3,20,10),
-- (1,4,5,1);

-- COMMIT;
-- SELECT * FROM Stores;

-- -- Warehouse 6
-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Stores;

-- SELECT SLEEP(5);

-- UPDATE Stores 
-- SET Quantity = Quantity + 20 
-- WHERE Quantity < Minimum_Threshold AND Warehouse_ID = 6;

-- INSERT INTO Stores VALUES 
-- (6, 1 , 20,15),
-- (6, 2, 10, 5);

-- COMMIT;
-- SELECT * FROM Stores;

-- 2. Admin is adding some products to a warehouse and the warehouse gets them but then the admin aborts the operation so displaying that the process has been aborted

-- Code: 

-- USE Pharmacy;

-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Product;

-- INSERT INTO Product(Product_ID, Batch_No, Prod_Name, Brand,Feedback, Price, Prod_Description, Admin_Username) VALUES
-- (21, 131, 'Crocin Tablets', 'MediRelief', 'N/A', 47, 'Instant headache relief', 'admin');

-- SAVEPOINT First_Addition;

-- INSERT INTO Product(Product_ID, Batch_No, Prod_Name, Brand,Feedback, Price, Prod_Description, Admin_Username) VALUES
-- (22, 132, 'Insulation Blankets', 'MediRelief', 'N/A', 25, 'Blankets for the Winter', 'admin');

-- ROLLBACK TO First_Addition;

-- COMMIT;

-- SELECT * FROM Product;

-- 3. A new warehouse is added and the employees are assigned

-- Code: 

-- -- Warehouse 11
-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Warehouse;
-- SELECT * FROM Employee;
-- SELECT * FROM Manager;
-- SELECT SLEEP(5);

-- INSERT INTO Warehouse(District, City, Pincode, Admin_Username) VALUES 
-- ('Sector 52', 'Noida', 202110, 'admin');

-- INSERT INTO Employee(Employee_ID, Emp_Name, District, City, Pincode, Salary, DOB, Email, Warehouse_ID, Start_Date) VALUES 
-- (1041, 'Vincent Rao', 'Vaishali', 'Ghaziabad', 201014, 50000, '1990-05-15', 'vince@example.com', 11, '2024-04-17'),
-- (1042, 'Harsh Patel', 'Sector 63', 'Noida', 201301, 40000, '1993-02-05', 'harsh@example.com', 11, '2024-04-17'),
-- (1043, 'Vedant Ashwin', 'Sector 50', 'Noida', 201301, 40000, '1991-12-29', 'vedant@example.com', 11, '2024-04-17');

-- INSERT INTO Manager(Employee_ID, Username, Password_) VALUES 
-- (1041, 'manager11', 'pass11');

-- COMMIT;
-- SELECT * FROM Warehouse;
-- SELECT * FROM Employee;
-- SELECT * FROM Manager;

-- -- Warehouse 12
-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SELECT * FROM Warehouse;
-- SELECT * FROM Employee;
-- SELECT * FROM Manager;
-- SELECT SLEEP(5);

-- INSERT INTO Warehouse(District, City, Pincode, Admin_Username) VALUES 
-- ('Govindpuri', 'Delhi', 1011101, 'admin');

-- INSERT INTO Employee(Employee_ID, Emp_Name, District, City, Pincode, Salary, DOB, Email, Warehouse_ID, Start_Date) VALUES 
-- (1044, 'Aditya Rao', 'Vaishali', 'Ghaziabad', 201014, 50000, '1990-05-15', 'aditya@example.com', 12, '2024-04-17'),
-- (1045, 'Kumar Patel', 'Sector 63', 'Noida', 201301, 40000, '1993-02-05', 'kumar@example.com', 12, '2024-04-17'),
-- (1046, 'Sam Ashwin', 'Sector 50', 'Noida', 201301, 40000, '1991-12-29', 'ashwin@example.com', 12, '2024-04-17');

-- INSERT INTO Manager(Employee_ID, Username, Password_) VALUES 
-- (1044, 'manager12', 'pass12');

-- COMMIT;
-- SELECT * FROM Warehouse;
-- SELECT * FROM Employee;
-- SELECT * FROM Manager;

-- 4. User purchased something but there was an error so returning to the original state 

-- Code: 

-- USE Pharmacy;
-- SET AUTOCOMMIT = 0;
-- SELECT * FROM Past_Orders;
-- SELECT * FROM Warehouse;
-- SELECT * FROM Stores;
-- START TRANSACTION;

-- INSERT INTO Past_Orders VALUES
-- ('user4',3,3,18),
-- ('user4',1,1,7);

-- UPDATE Stores SET Quantity = Quantity - 3 WHERE Warehouse_ID = 3 AND Product_Id = 3;
-- UPDATE Stores SET Quantity = Quantity - 1 WHERE Warehouse_ID = 1 AND Product_Id = 1;
-- UPDATE Warehouse SET Revenue = Revenue + 18, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = 3;
-- UPDATE Warehouse SET Revenue = Revenue + 7, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = 1;

-- ROLLBACK;

-- COMMIT;

-- SELECT * FROM Past_Orders;
-- SELECT * FROM Warehouse;
-- SELECT * FROM Stores;

