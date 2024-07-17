from flask import Flask, request, jsonify
from flask_mysqldb import MySQL

app = Flask(__name__)

# Here we are configuring the MySQL database
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Ad@210675'
app.config['MYSQL_DB'] = 'Pharmacy'

mysql = MySQL(app)


@app.route('/api/discountGet')
def get_discount():
    with app.app_context():
        cursor = mysql.connection.cursor()
        query = 'SELECT Discount_code, Percentage, Min_Purchase FROM Discount '
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return jsonify({'data':result})


@app.route('/api/retrieveP_byID')
def send_products2():
    curr_city = request.args.get('city')
    user = request.args.get('user')

    with app.app_context():
        cursor = mysql.connection.cursor()
        query = 'SELECT Id, Total_Quantity, Quantity FROM Orders, (SELECT product.Product_ID AS Id, Prod_Name, Brand, Feedback, Price, Prod_Description, MAX(quantity) AS Total_Quantity FROM product, stores, warehouse WHERE (product.Product_ID = stores.Product_ID) AND (stores.Warehouse_ID = warehouse.Warehouse_ID) AND warehouse.city = %s GROUP BY product.Product_ID) AS Table2 WHERE Id = Product_ID AND Username = %s'
        cursor.execute(query,(curr_city,user))
        result2 = cursor.fetchall()
        cursor.close()
        for i in result2:
            if i[1] < i[2]:
                conn = mysql.connection
                cursor = conn.cursor()
                query = 'UPDATE Orders SET Quantity = %s WHERE Product_ID = %s AND Username = %s'
                cursor.execute(query, (i[1], i[0], user))
                conn.commit()
                cursor.close()

        cursor = mysql.connection.cursor()
        query = 'SELECT product.Product_ID, Prod_Name, Brand, Feedback, Price, Prod_Description, MAX(quantity) AS Quantity FROM product, stores, warehouse WHERE (product.Product_ID = stores.Product_ID) AND (stores.Warehouse_ID = warehouse.Warehouse_ID) AND warehouse.city = %s GROUP BY Product_ID'
        cursor.execute(query,(curr_city,))
        result = cursor.fetchall()
        cursor.close()

        cursor = mysql.connection.cursor()
        query = 'SELECT Id, Quantity FROM Orders, (SELECT product.Product_ID AS Id FROM product, stores, warehouse WHERE (product.Product_ID = stores.Product_ID) AND (stores.Warehouse_ID = warehouse.Warehouse_ID) AND warehouse.city = %s GROUP BY product.Product_ID) AS Table2 WHERE Id = Product_ID AND Username = %s'
        cursor.execute(query, (curr_city, user))
        result2 = cursor.fetchall()
        cursor.close()


        return jsonify({'data': result, 'more_data' : result2})  # Return data as JSON
 
@app.route('/api/login', methods = ['POST'])
def handleLogin():
    data = request.get_json()
    if not data or not data.get('user') or not data.get('password'):
        return jsonify({'error': 'Missing userID or password'}), 400

    user = data['user']
    password = data['password']
    with app.app_context():
        cursor = mysql.connection.cursor()
        query = "SELECT City FROM User_ WHERE Username = %s AND Password_ = %s"
        cursor.execute(query, (user,password))
        result = cursor.fetchone()
        if result:
            cursor.close()
            return jsonify({'data': result[0]})
        else:
            cursor.close()
            return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/loginEmp', methods = ['POST'])
def handleLoginEmp():
    data = request.get_json()
    if not data or not data.get('mgrID') or not data.get('password'):
        return jsonify({'error': 'Missing mgrID or password'}), 400

    user = data['mgrID']
    password = data['password']
    if user == 'admin' and password == 'admin':
        return jsonify({'data' : 'admin'})
    
    elif user == 'admin':
        return jsonify({'error' : 'wrong password for admin'}), 401
    
    with app.app_context():
        cursor = mysql.connection.cursor()
        query = "SELECT Warehouse_ID FROM Manager NATURAL JOIN Employee WHERE Username = %s AND Password_ = %s"
        cursor.execute(query, (user,password))
        result = cursor.fetchone()
        if result:
            cursor.close()
            return jsonify({'data': result[0]})
        else:
            cursor.close()
            return jsonify({'error': 'Invalid credentials'}), 401
        
@app.route('/api/signup', methods = ['POST'])
def handleSignUp():
    data = request.get_json()
    if not data or not data.get('user'):
        return jsonify({'error': 'Missing user or password'}), 400

    if not data.get('password'):
        return jsonify({'error': 'Missing password'}), 400
    
    if not data.get('m_stat'):
        return jsonify({'error': 'Missing membership status'}), 400
    
    if not data.get('district'):
        return jsonify({'error': 'Missing district'}), 400
    
    if not data.get('city'):
        return jsonify({'error': 'Missing city'}), 400
    
    if not data.get('pincode'):
        return jsonify({'error': 'Missing pincode'}), 400

    if not data.get('phone'):
        return jsonify({'error': 'Missing phone'}), 400

    user = data['user']
    password = data['password']
    district = data['district']
    city = data['city']
    pincode = int(data['pincode'])
    m_stat = data['m_stat']
    phone = data['phone']

    with app.app_context():
        cursor = mysql.connection.cursor()
        query = "SELECT 1 FROM User_ WHERE Username = %s"
        cursor.execute(query, (user,))
        result = cursor.fetchone()
        if result:
            cursor.close()
            return jsonify({'error': 'User already exists'}), 401
        else:
            cursor = mysql.connection.cursor()
            query = "SELECT * FROM User_ WHERE Phone = %s"
            cursor.execute(query, (phone,))
            result = cursor.fetchone()
            cursor.close()

            if result:
                return jsonify({'error': 'Phone already exists'}), 401
            
            new_query = "INSERT INTO User_ (Username, Password_,Phone, Membership_Status, District, City, Pincode) VALUES (%s, %s,%s, %s, %s, %s, %s)"
            conn = mysql.connection
            cursor = conn.cursor()
            cursor.execute(new_query, (user, password,phone, m_stat, district, city, pincode))
            conn.commit()
            cursor.close()

            return jsonify({'message': 'Sign-Up Successful'})

@app.route('/api/cart')
def request_cart():
    curr_city = request.args.get('city')
    user = request.args.get('user')
    with app.app_context():
        cursor = mysql.connection.cursor()
        query = 'SELECT Id, Prod_Name, Brand, Quantity, Price, Max_Quant FROM Orders, (SELECT product.Product_ID AS Id, Prod_Name, Brand, Feedback, Price, MAX(Quantity) AS Max_Quant FROM product, stores, warehouse WHERE (product.Product_ID = stores.Product_ID) AND (stores.Warehouse_ID = warehouse.Warehouse_ID) AND warehouse.city = %s GROUP BY Product.Product_ID) AS Table2 WHERE Username = %s AND Orders.Product_Id = Table2.Id'
        cursor.execute(query,(curr_city,user))
        result = cursor.fetchall()
        cursor.close()

        return jsonify({'data': result})  # Return data as JSON
        
@app.route('/api/user_update', methods = ['POST'])
def userUpdate():
    data = request.get_json()
    dict1 = data['upd_list']
    user = data['user']
    with app.app_context():
        for i in dict1:
            cursor = mysql.connection.cursor()
            query = "SELECT * FROM Orders WHERE Username = %s AND Product_ID = %s"
            cursor.execute(query, (user, i))
            result = cursor.fetchone()
            cursor.close()
            conn = mysql.connection
            cursor = conn.cursor()
            if result:
                if dict1[i] == 0:
                    new_query = "DELETE FROM Orders WHERE Username = %s AND Product_ID = %s"
                    cursor.execute(new_query, (user,i))
                    conn.commit()
                    cursor.close()
                else:
                    new_query = "UPDATE Orders SET Quantity = %s WHERE Username = %s AND Product_ID = %s"
                    cursor.execute(new_query, (dict1[i],user, i))
                    conn.commit()
                    cursor.close()
            else:
                new_query = "INSERT INTO Orders(Username, Product_ID, Quantity, Prescription) VALUES (%s, %s, %s, %s)"
                cursor.execute(new_query, (user, i, dict1[i], 'N/A'))
                conn.commit()
                cursor.close()

        return jsonify({'message': 'Sign-Up Successful'})






@app.route('/api/user_purchase', methods = ['POST'])
def userPurchased():
    data = request.get_json()
    dict1 = data['bill']
    user = data['user']
    city = data['city']
    
    with app.app_context():
        for i in dict1:
            conn = mysql.connection
            cursor = conn.cursor()
            query = "SELECT Stores.Warehouse_ID, Quantity, Price FROM Stores, Warehouse, Product WHERE Product.Product_ID = %s AND (Product.Product_ID = Stores.Product_ID) AND (Stores.Warehouse_ID = Warehouse.Warehouse_ID) AND Warehouse.City = %s ORDER BY Quantity DESC LIMIT 1"
            cursor.execute(query, (i, city))
            result = cursor.fetchone()
            cursor.close()

            conn = mysql.connection
            cursor = conn.cursor()
            query = "UPDATE Warehouse SET Revenue = Revenue + %s, No_of_Orders = No_of_Orders + 1 WHERE Warehouse_ID = %s"
            cursor.execute(query, (dict1[i] * result[2], result[0]))
            conn.commit()
            cursor.close()

            conn = mysql.connection
            cursor = conn.cursor()
            query = "DELETE FROM Orders WHERE Username = %s AND Product_ID = %s"
            cursor.execute(query, (user, i))
            conn.commit()
            cursor.close()

            conn = mysql.connection
            cursor = conn.cursor()
            query = "UPDATE Stores SET Quantity = %s WHERE Warehouse_ID = %s AND Product_ID = %s"
            cursor.execute(query, (result[1] - dict1[i], result[0], i))
            conn.commit()
            cursor.close()

            conn = mysql.connection
            cursor = conn.cursor()
            query = "INSERT INTO past_orders(Username, Product_ID, Price, Quantity) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (user, i, dict1[i] * result[2], dict1[i]))
            conn.commit()
            cursor.close()

    return jsonify({'message': 'Sign-Up Successful'})

@app.route('/api/invMod', methods = ['POST'])
def adminInvModify():
    data = request.get_json()
    dict1 = data['upd_list']
    dict2 = data['upd_thres_list']
    
    with app.app_context():
        for i in dict2:
            parts = i.split()
            result = [int(part) for part in parts]

            conn = mysql.connection
            cursor = conn.cursor()
            query = "UPDATE Stores SET Minimum_Threshold = %s WHERE Warehouse_ID = %s AND Product_ID = %s"
            cursor.execute(query, (dict2[i], result[0], result[1]))
            conn.commit()
            cursor.close()

        for i in dict1:
            parts = i.split()
            result = [int(part) for part in parts]

            if dict1[i] == 0:
                conn = mysql.connection
                cursor = conn.cursor()
                query = "DELETE FROM Stores WHERE Warehouse_ID = %s AND Product_ID = %s"
                cursor.execute(query, (result[0], result[1]))
                conn.commit()
                cursor.close()
            else:
                conn = mysql.connection
                cursor = conn.cursor()
                query = "UPDATE Stores SET Quantity = %s WHERE Warehouse_ID = %s AND Product_ID = %s"
                cursor.execute(query, (dict1[i], result[0], result[1]))
                conn.commit()
                cursor.close()

        conn = mysql.connection
        cursor = conn.cursor()
        query = "UPDATE Stores SET Quantity = Minimum_Threshold + 20 WHERE Quantity < Minimum_Threshold"
        cursor.execute(query)
        conn.commit()
        cursor.close()

    return jsonify({'message': 'successful'})

@app.route('/api/userAnalytics')
def AnalyzeUser():
    with app.app_context():
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT Username,  Membership_Status, District, City, Pincode, SUM(Price) AS Expenditure FROM User_ NATURAL JOIN Past_Orders GROUP BY Username, Membership_Status, District, City, Pincode ORDER BY Expenditure DESC')
        users = cursor.fetchall()
        cursor.close()
        return jsonify({'data': users})

@app.route('/api/WarehouseAnalytics')
def AnalyzeWarehouse():
    with app.app_context():
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT Warehouse_ID, Revenue, No_of_Orders, District, City, Pincode FROM Warehouse')
        users = cursor.fetchall()
        cursor.close()
        return jsonify({'data': users})
    
@app.route('/api/WAnalytics')
def AnalyzeSpecWarehouse():
    W_ID = request.args.get('W_ID')
    with app.app_context():
        cursor = mysql.connection.cursor()
        query = "SELECT Warehouse_ID, Revenue, No_of_Orders, District, City, Pincode FROM Warehouse WHERE Warehouse_ID = %s"
        cursor.execute(query, (W_ID,))
        users = cursor.fetchall()
        cursor.close()
        return jsonify({'data': users})  # Return data as JSON

@app.route('/api/RestockAll')
def RestockAll():
    with app.app_context():
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM Restocks')
        users = cursor.fetchall()
        cursor.close()

        if len(users) != 0:
            for i in users:
                conn = mysql.connection
                cursor = conn.cursor()
                query = 'UPDATE Stores SET Quantity = %s WHERE Warehouse_ID = %s AND Product_ID = %s'
                cursor.execute(query, (i[2], i[0], i[1]))
                conn.commit()
                cursor.close()

        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute('DELETE FROM Restocks')
        conn.commit()
        cursor.close()

        return jsonify({'data': users})
    
@app.route('/api/RestockW')
def RestockW():
    data = request.get_json()
    W_ID = data['W_ID']
    with app.app_context():
        cursor = mysql.connection.cursor()
        query = "SELECT * FROM Restocks WHERE Warehouse_ID = %s"
        cursor.execute(query, (W_ID,))
        users = cursor.fetchall()
        cursor.close()

        if len(users) != 0:
            for i in users:
                conn = mysql.connection
                cursor = conn.cursor()
                query = 'UPDATE Stores SET Quantity = %s WHERE Warehouse_ID = %s AND Product_ID = %s'
                cursor.execute(query, (i[2], i[0], i[1]))
                conn.commit()
                cursor.close()

        conn = mysql.connection
        cursor = conn.cursor()
        query = "DELETE FROM Restocks WHERE Warehouse_ID = %s"
        cursor.execute(query, (W_ID,))
        conn.commit()
        cursor.close()

        return jsonify({'data': users})

@app.route('/api/ProductView')
def viewAdminProducts():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT Stores.Warehouse_ID, Product.Prod_Name, Product.Product_ID, Stores.Quantity, Warehouse.City, Warehouse.District, Minimum_Threshold FROM Stores, Warehouse, Product WHERE Stores.Product_ID = Product.Product_ID AND Warehouse.Warehouse_ID = Stores.Warehouse_ID')
    users = cursor.fetchall()
    cursor.close()

    return jsonify({'data': users})

@app.route('/api/ProductWView')
def viewSpecWarehouseProducts():
    W_ID = request.args.get('W_ID')
    cursor = mysql.connection.cursor()
    query = "SELECT Stores.Warehouse_ID, Product.Prod_Name, Product.Product_ID, Stores.Quantity, Warehouse.City, Warehouse.District, Minimum_Threshold FROM Stores, Warehouse, Product WHERE (Stores.Product_ID = Product.Product_ID) AND (Warehouse.Warehouse_ID = Stores.Warehouse_ID) AND Warehouse.Warehouse_ID = %s"
    cursor.execute(query,(W_ID,))
    users = cursor.fetchall()
    cursor.close()

    return jsonify({'data': users})

@app.route('/api/ProductDisplay')
def viewAllProducts():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT Product.Product_ID, Product.Price, Product.Prod_Name, SUM(Past_Orders.Price) AS Revenue, SUM(Quantity) AS Total_Orders FROM Product, Past_Orders WHERE (Product.Product_ID = Past_Orders.Product_ID) GROUP BY Product.Prod_Name, Product.Product_ID UNION SELECT Product_ID, Price, Prod_Name, 0, 0 FROM Product WHERE Product_ID NOT IN (SELECT Product_ID FROM Past_Orders)')
    users = cursor.fetchall()
    cursor.close()

    return jsonify({'data': users})

@app.route('/api/AddProdInv', methods = ['POST'])
def handleAddingStores():
    data = request.get_json()
    if not data or not data.get('Warehouse_ID') or not data.get('Product_ID') or not data.get('quantity') or not data.get('minThreshold'):
        return jsonify({'error': 'Missing Data'}), 400
    
    W_ID = data['Warehouse_ID']
    P_ID = data['Product_ID']
    Quantity = data['quantity']
    Min_Thres = data['minThreshold']
    with app.app_context():
        cursor = mysql.connection.cursor()
        query = "SELECT * FROM Warehouse WHERE Warehouse_ID = %s"
        cursor.execute(query, (W_ID,))
        result = cursor.fetchone()
        cursor.close()
        if not result:
            return jsonify({'error': 'Warehouse Doesn''t Exist'}), 401
        
        cursor = mysql.connection.cursor()
        query = "SELECT * FROM Product WHERE Product_ID = %s"
        cursor.execute(query, (P_ID,))
        result = cursor.fetchone()
        cursor.close()
        if not result:
            return jsonify({'error': 'Product Doesn''t Exist'}), 401

        cursor = mysql.connection.cursor()
        query = "SELECT * FROM Stores WHERE Warehouse_ID = %s AND Product_ID = %s"
        cursor.execute(query, (W_ID, P_ID))
        result = cursor.fetchone()
        if result:
            conn = mysql.connection
            cursor = conn.cursor()
            query = "UPDATE Stores SET Quantity = %s, Minimum_Threshold = %s WHERE Warehouse_ID = %s AND Product_ID = %s"
            cursor.execute(query, (Quantity, Min_Thres,W_ID, P_ID))
            conn.commit()
            cursor.close()

            return jsonify({'message': 'successful'})
        
        conn = mysql.connection
        cursor = conn.cursor()
        query = "INSERT Stores (Warehouse_ID, Product_ID, Quantity, Minimum_Threshold) VALUES (%s,%s,%s,%s)"
        cursor.execute(query, (W_ID, P_ID, Quantity, Min_Thres))
        conn.commit()
        cursor.close()

        return jsonify({'message': 'successful'})
    
@app.route('/api/RegProd', methods = ['POST'])
def regProd():
    data = request.get_json()
    if not data or not data.get('BatchNo') or not data.get('Price') or not data.get('ProdDescr') or not data.get('ProdName') or not data.get('Brand') or not data.get('ProdType'):
        return jsonify({'error': 'Missing Data'}), 400
    
    B_No = data['BatchNo']
    Price = data['Price']
    ProdDescr = data['ProdDescr']
    ProdName = data['ProdName']
    ProdType = data['ProdType']
    Brand = data['Brand']

    with app.app_context():
        cursor = mysql.connection.cursor()
        query = "SELECT * FROM Product WHERE Prod_Name = %s"
        cursor.execute(query, (ProdName,))
        result = cursor.fetchone()
        cursor.close()
        if result:
            return jsonify({'error': 'Product Already exists.'}), 401
        
        cursor = mysql.connection.cursor()
        query = "SELECT * FROM Supplier WHERE Name_ = %s"
        cursor.execute(query, (Brand,))
        result = cursor.fetchone()
        cursor.close()

        if not result:
            conn = mysql.connection
            cursor = conn.cursor()
            query = "INSERT INTO Supplier(Name_) VALUES (%s)"
            cursor.execute(query, (Brand,))
            conn.commit()
            cursor.close()
        
        conn = mysql.connection
        cursor = conn.cursor()
        query = "INSERT INTO Product(Batch_No, Prod_Name, Brand, Feedback, Price, Prod_Description, Prod_Type, Admin_Username) VALUES (%s,%s,%s,'N/A',%s,%s,%s,'admin')"
        cursor.execute(query, (B_No, ProdName, Brand, Price, ProdDescr, ProdType))
        conn.commit()
        cursor.close()

        return jsonify({'message': 'successful'})
    
@app.route('/api/DelProd', methods = ['POST'])
def delProd():
    data = request.get_json()
    if not data or not data.get('ProdName') or not data.get('ProdID'):
        return jsonify({'error': 'Missing Data'}), 400
    
    P_ID = data['ProdID']
    Name = data['ProdName']

    with app.app_context():
        cursor = mysql.connection.cursor()
        query = "SELECT * FROM Product WHERE Prod_Name = %s AND Product_ID = %s"
        cursor.execute(query, (Name, P_ID))
        result = cursor.fetchone()
        cursor.close()
        if not result:
            return jsonify({'error': 'Product does not exist.'}), 401
        
        conn = mysql.connection
        cursor = conn.cursor()
        query = "DELETE FROM Stores WHERE Product_ID = %s"
        cursor.execute(query, (P_ID,))
        conn.commit()
        cursor.close()

        return jsonify({'message': 'successful'})

if __name__ == '__main__':
    app.run(debug=True)


