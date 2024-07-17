
import React from 'react';
import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'
import NumberInput from '../Design Elements/NumberInput';
import AddProductsView from './AddProductsView';
import Table from '../Design Elements/ScrollAndSearch';
import ProductsView from './RegProduct';
import DelProductsView from './DelProduct';
import logo from './Group 1261155243.png'; // Import your image

function AdminhomePage(){
    const [content, SetContent] = useState();

    const [userData, SetUserData] = useState();
    const [userloading, SetUserLoading] = useState(true);
    const userList = [];

    const [WarehouseData, SetWData] = useState();
    const [WLoading, SetWLoading] = useState(true);
    const WList = [];

    const [ProdInvData, SetProdData] = useState();
    const [ProdLoading, SetProdLoading] = useState(true);
    const ProdList = [];
    let upd_list = {};
    let upd_thres_list = {}

    const [pData, SetPData] = useState();
    const [ploading, SetPLoading] = useState(true);
    const pList = [];

    const prodClick = (W_id, P_Id, quantity) => {
        upd_list[`${W_id} ${P_Id}`] = quantity;
    }

    const prodThresClick = (W_id, P_Id, quantity) => {
      upd_thres_list[`${W_id} ${P_Id}`] = quantity;
  }

    const navigate = useNavigate();

    const logout = () => {
          navigate('/login_emp');
      }

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("/api/userAnalytics");
          const fetchedData = await response.json();
          SetUserData(fetchedData);
          SetUserLoading(false);
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("/api/WarehouseAnalytics");
          const fetchedData = await response.json();
          SetWData(fetchedData);
          SetWLoading(false)
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("/api/ProductView");
          const fetchedData = await response.json();
          SetProdData(fetchedData);
          SetProdLoading(false);
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("/api/ProductDisplay");
          const fetchedData = await response.json();
          SetPData(fetchedData);
          SetPLoading(false);
        };
    
        fetchData();
      }, []);

      if(userloading === false){
        for(let i = 0; i < userData.data.length; i++){
            userList.push({id : userData.data[i][0], 'Mem' : userData.data[i][1], 'District' : userData.data[i][2],
        'City' : userData.data[i][3], 'Pincode' : userData.data[i][4], 'Expenditure' : userData.data[i][5]});
        }
      }

      if(WLoading === false){
        for(let i = 0; i < WarehouseData.data.length; i++){
            WList.push({id : WarehouseData.data[i][0], Revenue : WarehouseData.data[i][1], N_Orders : WarehouseData.data[i][2],
        District:WarehouseData.data[i][3], City : WarehouseData.data[i][4], Pincode : WarehouseData.data[i][5]});
        }
      }

      if(ProdLoading === false){
        for(let i = 0; i < ProdInvData.data.length; i++){
            ProdList.push({W_Id : ProdInvData.data[i][0], Name : ProdInvData.data[i][1], P_Id : ProdInvData.data[i][2],
            Quantity: ProdInvData.data[i][3], City : ProdInvData.data[i][4], District : ProdInvData.data[i][5], 
            minThres : ProdInvData.data[i][6]});
        }
      }

      if(ploading === false){
        for(let i = 0; i < pData.data.length; i++){
          pList.push({id : pData.data[i][0], Name : pData.data[i][2], Price: pData.data[i][1],
          Revenue: pData.data[i][3], n_Orders : pData.data[i][4]});
        }
      }

    function userAnalytics(){
      const columns = [
        {accessor: 'id', label: 'Username'},
        {accessor: 'Mem', label: 'Membership Status'},
        {accessor: 'Expenditure', label: 'Expenditure'},
        {accessor: 'District', label:'District'},
        {accessor: 'City', label: 'City'},
        {accessor: 'Pincode', label: 'Pincode'}
      ];

      SetContent(<Table data={userList} key = {3} columns={columns} sortableColumns={['Expenditure','id']} searchableColumns={['Mem','District','City','Pincode','id']}/>)
    }

    function WarehouseAnalytics(){
        const data = WList;
          
          const columns = [
            {accessor : 'id', label: 'Warehouse ID'},
            { accessor: 'Revenue', label: 'Revenue' },
            { accessor: 'N_Orders', label: 'No. of Orders' },
            {accessor : 'District', label: 'District'},
            {accessor : 'City', label: 'City'},
            {accessor : 'Pincode', label: 'Pincode'}
          ];
          
          SetContent(<Table data={data} key = {4} columns={columns} sortableColumns={['Revenue', 'N_Orders','id']} searchableColumns={['District', 'City','Pincode','id']} />)
    }

    function Restock(){
        const response = fetch("/api/RestockAll");

        SetContent(<h4>Restocking Successful!</h4>)

        window.location.reload();
    }

    const handleClick = async () => {
      const response = await fetch('/api/invMod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ upd_list, upd_thres_list}),
        });

      upd_list = {};
      upd_thres_list = {};
      window.location.reload();
  };

  function AddProducts(){
    const view = <AddProductsView />

    SetContent(view);
  }

    function Modification(){
      const table = (<div className = "table-container">
        <h2>Modify Inventory</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Warehouse ID</th>
              <th>Product Name</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Minimum Threshold</th>
              <th>District</th>
              <th>City</th>
              <th>Enter New Quantity</th>
              <th>Enter New Threshold</th>
            </tr>
          </thead>
          <tbody>
            {ProdList.map((product) => (
              <tr key={product.W_Id}>
                <td>{product.W_Id}</td>
                <td>{product.Name}</td>
                <td>{product.P_Id}</td>
                <td>{product.Quantity}</td>
                <td>{product.minThres}</td>
                <td>{product.District}</td>
                <td>{product.City}</td>
                <td><NumberInput initial = {product.Quantity} onClick={(count) => prodClick(product.W_Id, product.P_Id, count)} /></td>
                <td><NumberInput initial = {product.minThres} onClick={(count) => prodThresClick(product.W_Id, product.P_Id, count)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <button onClick = {handleClick}>Confirm Changes</button>
        <span> </span>
        <button onClick = {AddProducts}>Add More Products</button>
        </div>
      );

      SetContent(table);
    }

    function viewInventory(){
        const columns = [
            {accessor : 'W_Id', label: 'Warehouse ID'},
            {accessor: 'Name', label: 'Name' },
            {accessor: 'P_Id', label: 'Product ID' },
            {accessor : 'Quantity', label: 'Quantity'},
            {accessor: 'minThres', label: 'Minimum Threshold'},
            {accessor : 'City', label: 'City'},
            {accessor : 'District', label: 'District'}
        ];

        SetContent(<Table columns = {columns} data = {ProdList} searchableColumns={['W_Id', 'City', 'Name', 'District']} sortableColumns={['W_Id', 'P_Id', 'Quantity', 'minThres']} />);
    }

    function viewProducts(){
        const columns2 = [
          {accessor: 'id', label: 'Product ID'},
          {accessor: 'Name', label: 'Product Name'},
          {accessor: 'Price',label: 'Price'},
          {accessor: 'n_Orders', label: 'No. of Orders'},
          {accessor: 'Revenue', label: 'Revenue Generated'}
        ]

        SetContent(<Table columns = {columns2} data = {pList} searchableColumns={['Name']} sortableColumns={['Price', 'n_Orders', 'Revenue']}/>)
    }

    function regProducts(){
      SetContent(<div><button onClick={() => {SetContent(<ProductsView />)}}>Register</button>
                  <span> </span>
                  <button onClick={() => {SetContent(<DelProductsView />)}}>Delete</button>
                </div>);
    }

    return (
      <div style={{ textAlign: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '100vw', height: 'auto' }} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '-120px', left: '-50px' }}>
        <button className="top-right-button" onClick={logout} style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', gap: '10px', border: '2px solid #000000', borderRadius: '64px', backgroundColor: 'white', color: 'black', fontFamily: 'Exo', fontStyle: 'normal', fontWeight: '600', fontSize: '16px', lineHeight: '21px', cursor: 'pointer' }}>Logout</button>
      </div>
        <h1>Admin Analytics Hub</h1>
        <div className="button-container">
          <button onClick={userAnalytics}>Analyze User Data</button>
          <button onClick={WarehouseAnalytics}>Analyze Warehouse Performance</button>
          <button onClick={Restock}>Restock Items in All Warehouses</button>
          <button onClick={viewInventory}>View Inventory</button>
          <button onClick={Modification}>Modify Inventory</button>
          <button onClick={viewProducts}>View All Products</button>
          <button onClick={regProducts}>Register or Delete Products</button>
        </div>
        <div>{content}</div>
      </div>
    );
    
}

export default AdminhomePage;
