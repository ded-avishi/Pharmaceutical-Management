import { useState  , useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import FrameComponent from '../Components/Header';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onNavItemTextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
      });

      const data = await response.json();
      const curr_city = data['data'];

      if(response.ok){
        localStorage.setItem('curr_userID',user);
        localStorage.setItem('curr_city',curr_city)
        navigate('/prod_disp');
      }
      if (!response.ok) {
        throw new Error('Login failed');
      }
      setUser('');
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
        <form action ='#' onSubmit={handleLogin}>
          <div className={styles.txt_field}>
            <FaUser className = {styles.icon}/>
              <input
              id="userID"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              type="text"
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
          <button type='submit' className={styles.btn_login} onClick={handleLogin}>
            Login
          </button>
          <div className={styles.doNotHaveContainer}>
            <p>Don't have an account? <a href='/sign_up' className={styles.signup_link}>Register</a></p>
          </div>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
    </>
  );
}


export default Login;
