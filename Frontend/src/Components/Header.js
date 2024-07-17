import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Header.css"

function Header(){
    return(
        <header className='nav'>
            <h1  className='title'>Pharmacy</h1>
            <nav className='navbar'>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Categories</a></li>
                    <li><a href="/">Login</a></li>
                    <li><a href="/sign_up">Sign up</a></li>
                </ul>
            </nav>
            <hr></hr>
        </header>
    );
}

export default Header;