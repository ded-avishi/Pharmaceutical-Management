import { useState  , useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FrameComponent from '../Components/Header';
import styles from "./Signup.module.css";

function SignUpComponent() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState();
  const [m_stat, setm_stat] = useState('Basic');
  const [district, setdistrict] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const goLogin = () => {
    navigate('/');
  }

  const onNavItemTextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if(pincode < 0){
        setErrorMessage('Invalid Pincode. Try Again!')
    }
    else if(city.toLowerCase() !== 'delhi' && city.toLowerCase() !== 'noida'){
        setErrorMessage('Invalid City. We serve to only Delhi and Noida. Try Again!')
    }
    else{

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, password , m_stat, district, city, pincode, phone}),
            });
            if(response.ok){
                localStorage.setItem('curr_userID',user);
                localStorage.setItem('curr_city', city);
                navigate('/prod_disp');
            }
            if (!response.ok) {
                throw new Error('Sign up failed');
            }
            setUser('');
            setPassword('');
            setCity('');
            setPhone();
            setPincode(null);
            setdistrict('');
            setm_stat('');
            setErrorMessage(''); // Clear any previous errors
            } catch (error) {
            setErrorMessage('Sign Up failed.');
        }
    }
  };


  function resetOnClick(){
    setUser('');
    setPassword('');
    setCity('');
    setPhone();
    setPincode(null);
    setdistrict('');
    setm_stat('');
  }

  return (
    <>
      <FrameComponent onNavItemTextClick={onNavItemTextClick} />
      <div className={styles.body}>
        <div className={styles.signup}>
          <h1>SIGN UP!</h1>
          <form onSubmit={handleLogin}>
            <div className={styles.txt_field}>
              <label>UserID:</label>
              <input
                type="text"
                id="userID"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div className={styles.txt_field}>
              <label>Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.txt_field}>
              <label>Phone Number:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
            <label>Membership Type:</label>
            <label>
                <input
                type="radio"
                value="Premium"
                checked={m_stat === 'Premium'}
                onChange={(e) => setm_stat(e.target.value)}
                />
                Premium
            </label>
            <label>
                <input
                type="radio"
                value="Basic"
                checked={m_stat === 'Basic'}
                onChange={(e) => setm_stat(e.target.value)}
                />
                Basic
            </label>
            </div>
            <div className={styles.txt_field}>
              <label>District:</label>
              <input
                type="text"
                id="district"
                value={district}
                onChange={(e) => setdistrict(e.target.value)}
              />
            </div>
            <div className={styles.txt_field}>
              <label>City:</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className={styles.txt_field}>
              <label>Pincode:</label>
              <input
                type="number"
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <br></br>
            <button type="submit" className={styles.btn_signup}>Sign Up</button>
            <input className={styles.btn_signup} type="reset" value="Reset" onClick={resetOnClick}/>
            <div className={styles.doNotHaveContainer}>
              <p>Already have an account? <a href='/' className={styles.signup_link}>Login</a></p>
            </div>          
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </>
  );
}

export default SignUpComponent;