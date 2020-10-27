import Head from 'next/head';
import React, { useState, createContext } from 'react';
import ProgressSpinner from '../component/common/ProgressSpinner'

const LayoutContext = createContext(null);

function LayoutProvider({ children }) {
  const [sideBarCollapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successNotification, setSuccessNotification] = useState(false);
  const [headerComponent, setHeaderComponent] = useState(null);
  const [appUserInfo, setAppUserInfo] = useState(null);

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
    setAppUserInfo,
    appUserInfo
  };

  return (
    <LayoutContext.Provider value={initialState}>
      <Head>
        <title>So.Fa.Dog-CMS</title>
        <link rel="icon" href="/color-logo.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>

      {loading && (<ProgressSpinner />
      )}

      {children}
    </LayoutContext.Provider>
  );
}

export { LayoutContext, LayoutProvider };