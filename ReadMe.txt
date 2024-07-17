INSTRUCTIONS TO RUN :

1. Once you have opened the folder, open the command prompt
2. "cd Backend" : Navigates to the backend folder
3. "flask run": Starts the backend server 
4. "cd ..": Navigates back to the main folder
5. "cd frontend": Navigates to the frontend folder
6. "npm install": Installs the node dependencies
7. "npm start": Opens up the webpage 
8. The first page is for the login/signup of a user
9. Incase you want to login in as a manager or the admin, append "/login_emp" 
to the home page address



FEATURES OF THE WEBSITE:

USER SIDE

1. The user can sign up or login into the website
2. Upon logging in, the user can add the products they want to buy to the cart
3. Once the user has added all the products, they can checkout to go to the cart
4. If the price of their order is high enough, the user can apply various discount coupons 
to decrease the price of the order
5. After this, they can purchase the products they wanted using the "Confirm Purchase" button

ADMIN SIDE

1. The admin can login from the portal for login of employees
2. The admin has various features using which they can monitor the performance of the users,
warehouses and the various products : 

a) Analyse User Data: The admin can view various attributes of the users such as the type of membership of each user (basic or premium) or 
the total expenditure the user has done in the lifetime of their account
b) Analyse Warehouse Performance: The admin can view various attributes of the warehouses such as the number of orders or the revenue generated 
by a particular warehouse
c) Restock Item in All Warehouses: Just by clicking this button, the admin can increase the amount of all items
whose quantity have fallen below a certain threshold to 20 more than that threshold
d) View Inventory: The admin can see the different types of products stored in all the warehouses
e) Modify Inventory: The admin can change the quantity or change the minimum threshold for any product in any warehouse
f) View All Products: Lists all the products currently supplied by a supplier which can be added to any warehouse
g) Register or Delete Products: The admin can either register a new product or delete an existing product

MANAGER SIDE

1. The manager can login from the portal for login of employees
2. The manager has various features using which they can monitor the performance of their warehouse and 
the users : 

a) Analyse User Data: The manager can view various attributes of the users such as the type of membership of each user (basic or premium) or 
the total expenditure the user has done in the lifetime of their account
b) Analyse Warehouse Performance: The manager can view various attributes of their warehouses such as the number of orders or the revenue generated 
by it
c) Restock Items in Your Warehouse: Just by clicking this button, the manager can increase the amount of all items in their warehouse
whose quantity have fallen below a certain threshold to 20 more than that threshold 
d) View Inventory: Allows the manager to view the different types of products and their quantities in their warehouse
e) Modify Inventory: Allows the manager to change quantity or change the minimum threshold for any product in their warehouse. They can also add a new product to their warehouse
f) View All Products: Lists all the products currently supplied by a supplier which can added to their warehouse



TRIGGERS: 

The code has 2 triggers : 

1. As soon as there is any update to the STORES table, any item whose quantity has fallen below the minimum threshold is automatically restocked

Code for the trigger: 

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

2. Whenever a new product is registered, 5 of that product is automatically added to each warehouse

Code for the trigger:

delimiter |
CREATE TRIGGER Add_new_Prods
AFTER INSERT ON Product
FOR EACH ROW
BEGIN
	INSERT INTO Stores(Warehouse_ID, Product_ID, Quantity, Minimum_Threshold)
    (SELECT Warehouse_ID, new.Product_ID, 5, 0 FROM Warehouse);
END |
delimiter ;



TRANSACTIONS:

The code has 2 conflicting transactions and 4 non-conflicting transactions

CONFLICTING TRANSACTIONS

1. If 2 users are buying the same product and one of them goes out of stock

Code:

-- User 4
USE Pharmacy;
SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Stores;
SELECT * FROM Past_Orders;
SELECT SLEEP(5);

INSERT INTO Past_Orders VALUES
('user4',6,6,15);

UPDATE Stores SET Quantity = Quantity - 15 WHERE Warehouse_ID = 6 AND Product_Id = 6;
UPDATE Warehouse SET Revenue = Revenue + 165, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = 6;

COMMIT;
SELECT * FROM Stores;
SELECT * FROM Past_Orders;

-- User 3
USE Pharmacy;
SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Stores;
SELECT * FROM Past_Orders;
SELECT * FROM Warehouse;
SELECT SLEEP(5);

UPDATE Stores SET Quantity = Quantity - 17 WHERE Warehouse_ID = 6 AND Product_Id = 6;
UPDATE Warehouse SET Revenue = Revenue + 187, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = 6;
INSERT INTO Past_Orders VALUES
('user3',6,6,17);

COMMIT;
SELECT * FROM Stores;
SELECT * FROM Past_Orders;
SELECT * FROM Warehouse;

2. Admin is giving or removing a discount and at the same time the user purchases something

Code: 

-- Giving Discount

USE Pharmacy;
SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Product;
SELECT SLEEP(5);

UPDATE Product SET Price = Price * 0.9 WHERE Product_ID <> -1;

COMMIT;
SELECT * FROM Product;

-- Purchasing Product

USE Pharmacy;
SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Warehouse;
SELECT SLEEP(5);

UPDATE Stores SET Quantity = Quantity - 7 WHERE Warehouse_ID = 10 AND Product_Id = 20;
UPDATE Warehouse SET Revenue = Revenue + 7 * (SELECT Price FROM Product WHERE Product_ID = 20), No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID =10;
INSERT INTO Past_Orders VALUES
('user3',10,20,7);

COMMIT;
SELECT * FROM Warehouse;


NON-CONFLICTING TRANSACTIONS

1. 2 managers are restocking their warehouses

Code: 

-- Warehouse 1
USE Pharmacy;
SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Stores;
SELECT SLEEP(5);

UPDATE Stores 
SET Quantity = Quantity + 20 
WHERE Quantity < Minimum_Threshold AND Warehouse_ID = 1;

INSERT INTO Stores VALUES 
(1,3,20,10),
(1,4,5,1);

COMMIT;
SELECT * FROM Stores;

-- Warehouse 6
USE Pharmacy;
SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Stores;

SELECT SLEEP(5);

UPDATE Stores 
SET Quantity = Quantity + 20 
WHERE Quantity < Minimum_Threshold AND Warehouse_ID = 6;

INSERT INTO Stores VALUES 
(6, 1 , 20,15),
(6, 2, 10, 5);

COMMIT;
SELECT * FROM Stores;

2. Admin is adding some products to a warehouse and the warehouse gets them but then the admin aborts the operation so displaying that the process has been aborted

Code: 

USE Pharmacy;

SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Product;

INSERT INTO Product(Product_ID, Batch_No, Prod_Name, Brand,Feedback, Price, Prod_Description, Admin_Username) VALUES
(21, 131, 'Crocin Tablets', 'MediRelief', 'N/A', 47, 'Instant headache relief', 'admin');

SAVEPOINT First_Addition;

INSERT INTO Product(Product_ID, Batch_No, Prod_Name, Brand,Feedback, Price, Prod_Description, Admin_Username) VALUES
(22, 132, 'Insulation Blankets', 'MediRelief', 'N/A', 25, 'Blankets for the Winter', 'admin');

ROLLBACK TO First_Addition;

COMMIT;

SELECT * FROM Product;

3. A new warehouse is added and the employees are assigned

Code: 

-- Warehouse 11
USE Pharmacy;
SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Warehouse;
SELECT * FROM Employee;
SELECT * FROM Manager;
SELECT SLEEP(5);

INSERT INTO Warehouse(District, City, Pincode, Admin_Username) VALUES 
('Sector 52', 'Noida', 202110, 'admin');

INSERT INTO Employee(Employee_ID, Emp_Name, District, City, Pincode, Salary, DOB, Email, Warehouse_ID, Start_Date) VALUES 
(1041, 'Vincent Rao', 'Vaishali', 'Ghaziabad', 201014, 50000, '1990-05-15', 'vince@example.com', 11, '2024-04-17'),
(1042, 'Harsh Patel', 'Sector 63', 'Noida', 201301, 40000, '1993-02-05', 'harsh@example.com', 11, '2024-04-17'),
(1043, 'Vedant Ashwin', 'Sector 50', 'Noida', 201301, 40000, '1991-12-29', 'vedant@example.com', 11, '2024-04-17');

INSERT INTO Manager(Employee_ID, Username, Password_) VALUES 
(1041, 'manager11', 'pass11');

COMMIT;
SELECT * FROM Warehouse;
SELECT * FROM Employee;
SELECT * FROM Manager;

-- Warehouse 12
USE Pharmacy;
SET AUTOCOMMIT = 0;
START TRANSACTION;
SELECT * FROM Warehouse;
SELECT * FROM Employee;
SELECT * FROM Manager;
SELECT SLEEP(5);

INSERT INTO Warehouse(District, City, Pincode, Admin_Username) VALUES 
('Govindpuri', 'Delhi', 1011101, 'admin');

INSERT INTO Employee(Employee_ID, Emp_Name, District, City, Pincode, Salary, DOB, Email, Warehouse_ID, Start_Date) VALUES 
(1044, 'Aditya Rao', 'Vaishali', 'Ghaziabad', 201014, 50000, '1990-05-15', 'aditya@example.com', 12, '2024-04-17'),
(1045, 'Kumar Patel', 'Sector 63', 'Noida', 201301, 40000, '1993-02-05', 'kumar@example.com', 12, '2024-04-17'),
(1046, 'Sam Ashwin', 'Sector 50', 'Noida', 201301, 40000, '1991-12-29', 'ashwin@example.com', 12, '2024-04-17');

INSERT INTO Manager(Employee_ID, Username, Password_) VALUES 
(1044, 'manager12', 'pass12');

COMMIT;
SELECT * FROM Warehouse;
SELECT * FROM Employee;
SELECT * FROM Manager;

4. User purchased something but there was an error so returning to the original state 

Code: 

USE Pharmacy;
SET AUTOCOMMIT = 0;
SELECT * FROM Past_Orders;
SELECT * FROM Warehouse;
SELECT * FROM Stores;
START TRANSACTION;

INSERT INTO Past_Orders VALUES
('user4',3,3,18),
('user4',1,1,7);

UPDATE Stores SET Quantity = Quantity - 3 WHERE Warehouse_ID = 3 AND Product_Id = 3;
UPDATE Stores SET Quantity = Quantity - 1 WHERE Warehouse_ID = 1 AND Product_Id = 1;
UPDATE Warehouse SET Revenue = Revenue + 18, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = 3;
UPDATE Warehouse SET Revenue = Revenue + 7, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = 1;

ROLLBACK;

COMMIT;

SELECT * FROM Past_Orders;
SELECT * FROM Warehouse;
SELECT * FROM Stores;








