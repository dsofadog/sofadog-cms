import React, { useState, createContext } from 'react';
import Notification from '../component/common/Notification';
import ProgressSpinner from '../component/common/ProgressSpinner'
const LayoutContext = createContext(null);

function LayoutProvider({ children }) {
  const actionbyRoles =  {
    'journalist' :['new'],
    'lead_journalis':['new','awaiting_review_by_lead_journalist'],
    'video_editor':['awaiting_video_upload'],
    'lead_video_editor':['awaiting_video_upload','awaiting_review_by_lead_video_editor'],
    'feed_manager':['pushed_to_feed','decrement_ordinal','increment_ordinal','removed_from_feed'],
    'user_manager':['user_manager'],
    'super_admin':['super_admin','rolew']

  }

  const [sideBarCollapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successNotification, setSuccessNotification] = useState(false);
  const [headerComponent, setHeaderComponent] = useState(null);
  const [appUserInfo, setAppUserInfo] = useState(null);
  const [notification, setNotification] = useState({show: false,data: null});
  const [appAction, setAppAction] = useState(actionbyRoles);
  const [currentUserAction, setCurrentUserAction] = useState([]);
  
  const currentUserPermission = (permission,user_type) => {
       if(user_type=="super_admin"){
            return true;
       }else{
        let info  = currentUserAction.includes(permission);
        if(info){
           return true ;
        }
       }  

}

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
    appUserInfo,
    setNotification,
    currentUserAction, 
    setCurrentUserAction,
    appAction, 
    setAppAction,
    currentUserPermission
  };


  return (
    <LayoutContext.Provider value={initialState}>
      <Notification data={notification}/>
      <ProgressSpinner show={loading} />
      {children}
    </LayoutContext.Provider>
  );
}

export { LayoutContext, LayoutProvider };