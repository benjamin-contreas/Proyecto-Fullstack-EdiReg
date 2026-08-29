import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react'; // Importar Sentry correctamente
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const { t } = useTranslation('Start');

  const handleLogout = () => {
    if (user && user.name) {
      Sentry.captureMessage(`User ${user.name} is logging out`, 'info'); // Log de nivel info
      Sentry.captureMessage(`Debug: User ${user.name} is attempting to log out`, 'debug'); // Log de nivel debug
      Sentry.captureException(new Error(`Error: User ${user.name} encountered an error during logout`)); // Log de nivel error
    }
    logout({ returnTo: window.location.origin });
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const baseStyle = {
    backgroundColor: isHovered || isFocused ? '#3a4357' : '#0a152e',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: '"Roboto Mono", monospace',
    marginTop: '5px',
  };

  useEffect(() => {
    if (isAuthenticated && user && user.name) {
      Sentry.captureMessage(`User ${user.name} has logged in`, 'info'); // Log de nivel info
      Sentry.captureMessage(`Debug: User ${user.name} has successfully logged in`, 'debug'); // Log de nivel debug
      // Para simular un error en el login, puedes descomentar la línea siguiente:
      // Sentry.captureException(new Error(`Error: User ${user.name} encountered an error during login`)); // Log de nivel error
    }
  }, [isAuthenticated, user]);

  return (
    isAuthenticated && (
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', alignContent: 'center' }}>
        <span style={{ color: 'rgb(148, 163, 184)' }}>{user.name}</span>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={baseStyle}
        >
        {t('Logout')}
        </button>
      </div>
    )
  );
};

export default Profile;
