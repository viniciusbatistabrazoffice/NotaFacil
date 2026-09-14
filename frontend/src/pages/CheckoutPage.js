import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CheckoutProvider } from '../contexts/CheckoutContext';

export function CheckoutPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('checkout-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <CheckoutProvider>
      <div className={`checkout-page-wrapper ${isDarkMode ? 'dark' : ''}`}>
        <div className="checkout-theme-toggle">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <Outlet />
      </div>
    </CheckoutProvider>
  );
}
