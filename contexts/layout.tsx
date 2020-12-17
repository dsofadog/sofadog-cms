import React, { createContext } from 'react';

import { store } from 'react-notifications-component';

const LayoutContext = createContext(null);

function LayoutProvider({ children }) {

  const notify = (type: 'success' | 'danger', message: string) => {

    store.addNotification({
      title: type === 'success' ? 'Success!' : 'Error!',
      message: message || (
        type === 'success'
          ? 'Operation succesfully completed.'
          : 'Operation failed, Please contact support for assistance.'
      ),
      type,
      insert: "top",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__bounceIn"],
      animationOut: ["animate__animated", "animate__fadeOutDown"],
      dismiss: {
        duration: 10000,
        onScreen: true,
        pauseOnHover: true
      },
    });
  }


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