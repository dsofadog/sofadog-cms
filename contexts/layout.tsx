import React, { createContext } from 'react';

import notify from 'utils/notify'

const LayoutContext = createContext(null);

function LayoutProvider({ children }) {

  const initialState = {
    notify
  };


  return (
    <LayoutContext.Provider value={initialState}>
      {children}
    </LayoutContext.Provider>
  );
}

export { LayoutContext, LayoutProvider };