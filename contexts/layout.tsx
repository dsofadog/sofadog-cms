import React, { useState, createContext } from 'react';
import {ProgressSpinner} from '../component/common/ProgressSpinner'

const LayoutContext = createContext(null);

function LayoutProvider({ children }) {
  const [sideBarCollapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successNotification, setSuccessNotification] = useState(false);
  const [headerComponent, setHeaderComponent] = useState(null);

  const initialState = {
    sideBarCollapsed,
    setCollapsed,
    theme,
    setTheme,
    loading,
    setLoading,
    error,
    setError,
    successNotification,
    setSuccessNotification,
    setHeaderComponent,
    headerComponent,
  };

  return (
    <LayoutContext.Provider value={initialState}>

    {loading && (<ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s"/>
      )}

      {children}
    </LayoutContext.Provider>
  );
}

export { LayoutContext, LayoutProvider};