import React, { useState , useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import FrameComponent from '../Components/Header';

function LoginEmpComponent() {
  const [mgrID, setMgrID] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const onNavItemTextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch('/api/loginEmp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mgrID, password }),
      });

      const data = await response.json();
      const w_id = data['data'];

      if(response.ok){
        if(w_id === 'admin'){
            navigate('/admin_home');
        }
        else{
            localStorage.setItem('Warehouse_ID',w_id);
            navigate('/mgr_home');
        }
      }
      if (!response.ok) {
        throw new Error('Login failed');
      }
      setMgrID('');
      setPassword('');
      setErrorMessage(''); // Clear any previous errors
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };
  return (
    <>
    <FrameComponent onNavItemTextClick={onNavItemTextClick} />
    <div className={styles.body}>
      <div className={styles.login}>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className={styles.txt_field}>
            <FaUser className = {styles.icon}/>
            <input
              type="text"
              id="mgrID"
              value={mgrID}
              onChange={(e) => setMgrID(e.target.value)}
              placeholder='username'
            />
          </div>
          <div className={styles.txt_field}>
            <FaLock className = {styles.icon}/>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='password'
            />
          </div>
          <button type="submit" className={styles.btn_login}>Login</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
    </>
  );
}

export default LoginEmpComponent;