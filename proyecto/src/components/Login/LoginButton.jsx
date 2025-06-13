import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import allowedUsers from './users.json'; // Import the JSON file

const LoginButton = () => {
  const { loginWithPopup, user, isAuthenticated, logout } = useAuth0();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const { t } = useTranslation('Start');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const allowedUser = allowedUsers.users.find(
        (allowedUser) => allowedUser.email === user.email
      );
      if (allowedUser) {
        setIsAllowed(true);
        navigate('/inicio');
      } else {
        logout();
        alert(t('You are not authorized to access this application.'));
      }
    }
  }, [isAuthenticated, navigate, user, logout, t]);

  const baseStyle = {
    backgroundColor: isHovered || isFocused ? '#3a4357' : '#0a152e',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: '"Roboto Mono", monospace',
  };

  return !isAuthenticated || !isAllowed ? (
    <button
      onClick={() => loginWithPopup()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={baseStyle}
    >
      {t('signIn')}
    </button>
  ) : null;
};

export default LoginButton;
