import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'Smart Techies Service Kohima',
    heroTitle: 'Welcome to Our Official Website',
    heroSubtitle: 'Discover and connect with us',
    primaryColor: '#6366f1',
  });

  useEffect(() => {
    axios.get('/api/settings')
      .then(({ data }) => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;
