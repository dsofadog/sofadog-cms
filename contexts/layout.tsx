import React, { useState, createContext } from 'react';
import Notification from '../component/common/Notification';
import ProgressSpinner from '../component/common/ProgressSpinner'
const LayoutContext = createContext(null);

function LayoutProvider({ children }) {
  const stateByRoleOnLoad = {
    "journalist" :"",
    "lead_journalist" :"awaiting_approval_by_lead_journalist",
    "video_editor" :"awaiting_video_upload",
    "lead_video_editor" :"awaiting_approval_by_lead_video_editor",
    "feed_manager" :"awaiting_push",
    'super_admin':"all",
  }
  const actionbyRoles =  {
    'journalist' :['new'],
    'lead_journalis':['new','awaiting_review_by_lead_journalist'],
    'video_editor':['awaiting_video_upload'],
    'lead_video_editor':['awaiting_video_upload','awaiting_review_by_lead_video_editor'],
    'feed_manager':['pushed_to_feed','decrement_ordinal','increment_ordinal','removed_from_feed'],
    'user_manager':['user_manager'],
    'super_admin':['super_admin']
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
  const [appState, setAppState] = useState(stateByRoleOnLoad);
  const [currentUserAction, setCurrentUserAction] = useState([]);
  const [currentUserState, setCurrentUserState] = useState([]);
  const [userIsSuperAdmin, setUserIsSuperAdmin] = useState(0);
  
  const currentUserPermission = (permission,user_type) => {
    
    let classValue='';
       if(user_type=="1"){
        classValue="hidden";      
            return classValue;
       }else{
        //let info  = currentUserAction.includes(permission);
        let info  = checkPermission(permission);
        if(info){      
           return classValue ;
        }else{         
          return false;
        }
       }  

}

const checkPermission = (permission) => {
  let status =false;
  currentUserAction.forEach(function(value) {     
      value.forEach(function(data) {    
        console.log(data,"data");  
         if(data==permission){         
          status =  true;
         }
    });
  });

  return status;
 
}




const clearAPPData =() =>{
  setLoading(false);
  setAppUserInfo(null);
  setUserIsSuperAdmin(0);  
  setCurrentUserAction([]);
  setCurrentUserState([]);
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
    currentUserPermission,
    appState,
    setAppState,
    currentUserState,
    setCurrentUserState,
    clearAPPData,
    userIsSuperAdmin, 
    setUserIsSuperAdmin

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