import React, { useState } from 'react';
import styles from './login.module.css';
import { useUser } from '../Hooks/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/Img/fotoLoginandRegister1.webp';
import img2 from '../assets/Img/fotoLoginandRegister2.webp';
import img3 from '../assets/Img/fotoLoginandRegister3.webp';
import img4 from '../assets/Img/fotoLoginandRegister4.webp';
import img5 from '../assets/Img/fotoLoginandRegister5.webp';
import img6 from '../assets/Img/fotoLoginandRegister6.webp';
import img7 from '../assets/Img/fotoLoginandRegister7.webp';

const Login = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const { setUsername, setAuthenticated } = useUser();
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const backgroundImages = [img1, img2, img3, img4, img5, img6, img7];

  const getRandomBackgroundImage = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  };

  const [backgroundImage, setBackgroundImage] = useState(getRandomBackgroundImage());

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        mode: 'cors',
      });
  
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setAuthenticated(true);

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
  
        localStorage.setItem('token', data.token);
        localStorage.setItem('tokenExpiration', expirationDate);
        localStorage.setItem('username', data.username);
  
        alert('Sign In successfully!');
  
        navigate('/');
      } else {
        alert('Failed to sign in. Please verify your details.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRegister = async () => {
    if (!registerUsername || !registerPassword || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    // Validar que el nombre de usuario tenga entre 6 y 12 caracteres
    if (registerUsername.length < 6 || registerUsername.length > 12) {
        alert('Username must be between 6 and 12 characters.');
        return;
    }

    // Validar que la contraseña tenga entre 6 y 12 caracteres
    if (registerPassword.length < 6 || registerPassword.length > 12) {
        alert('Password must be between 6 and 12 characters.');
        return;
    }

    // Validar que la contraseña contenga al menos una mayúscula y un número
    if (!/(?=.*[A-Z])/.test(registerPassword) || !/(?=.*\d)/.test(registerPassword)) {
        alert('Password must contain at least one uppercase letter and one number.');
        return;
    }

    // Validar que el nombre de usuario y la contraseña no contengan caracteres especiales
      if (/[_\-*[\]{}()<>]/.test(registerUsername) || /[_\-*[\]{}()<>]/.test(registerPassword)) {
        alert('Username and password cannot contain special characters.');
        return;
    }

    if (registerPassword !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: registerUsername, password: registerPassword }),
            mode: 'cors',
        });

        const data = await response.json();

        alert('Account created successfully! Please sign in');

        // Limpiar campos después de un registro exitoso
        setRegisterUsername('');
        setRegisterPassword('');
        setConfirmPassword('');

        navigate('/login');

    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <div className={styles.container}>
      <div className={styles.background} style={{ backgroundImage: `url(${backgroundImage})`, filter: 'brightness(0.3)' }}></div>
      <div className={styles.containerlogin}>
        <h2>Log in</h2>
        <input className={styles.inputs} type="text" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
        <input className={styles.inputs} type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        <button className={styles.button} onClick={handleLogin}>Login</button>
      </div>
      <div className={styles.containerRegister}>
        <h2>Register</h2>
        <input className={styles.inputs} type="text" placeholder="Username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
        <input className={styles.inputs} type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
        <input className={styles.inputs} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button className={styles.button} onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Login;