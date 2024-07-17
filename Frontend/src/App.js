import React from 'react';
import ProductList2 from './Methods/Insert_ID_Prod.js';
import { BrowserRouter as Router, Route,Routes, Link, useNavigate } from 'react-router-dom';
import Cart from './Methods/Cart';
import LoginComponent from './Methods/Login.js';
import SignUpComponent from './Methods/Signup.js';
import LoginEmpComponent from './Methods/LoginEmp.js';
import AdminhomePage from './Methods/Admin_Home.js';
import MgrhomePage from './Methods/Mgr_Home.js';

const App = () => {
    
      //{/* {<h1>hey</h1>
        //<ul>{data.data}</ul>} */}

  return (
    // <div>{ProductList()}</div>
    // <div>
    //     <Router>
    //         <Routes>
    //             <Route path="/" element={<ProductList2 />} />
    //             <Route path="/user_cart" element={<Cart />} />
    //         </Routes>
    //     </Router>
    // </div>
    //<LoginComponent />

        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginComponent />} />
                    <Route path="/login_emp" element={<LoginEmpComponent />} />
                    <Route path="/sign_up" element={<SignUpComponent />} />
                    <Route path="/admin_home" element={<AdminhomePage />} />
                    <Route path="/mgr_home" element={<MgrhomePage />} />
                    <Route path="/prod_disp" element = {<ProductList2 />} />
                    <Route path="/user_cart" element={<Cart />} />
                </Routes>
            </Router>
        </div>

    );
  
};

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route,Routes, Link, useNavigate } from 'react-router-dom';

// // Component for the initial page
// const MainPage = () => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     // Navigate to a new page
//     navigate('/new-page');
//   };

//   return (
//     <div>
//       <h1>Main Page</h1>
//       <button onClick={handleClick}>Go to New Page</button>
//     </div>
//   );
// };

// // Component for the new page
// const NewPage = () => {
//   return (
//     <div>
//       <h1>New Page</h1>
//       <p>This is a new page. It's clear of all content from the previous one.</p>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <Router><Routes><Route path="/" element={<MainPage />} />
//     <Route path="/new-page" element={<NewPage />} /></Routes>
      
//     </Router>
//   );
// };

// export default App;
