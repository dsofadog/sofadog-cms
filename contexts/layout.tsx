import React, { useState, createContext } from 'react';
import Notification from '../component/common/Notification';
import ProgressSpinner from '../component/common/ProgressSpinner';
import CmsConstant from '../utils/cms-constant';
const LayoutContext = createContext(null);
import Router from 'next/router';


function LayoutProvider({ children }) {
  const actionbyRoles = CmsConstant.actionbyRoles;
  const stateByRoleOnLoad = CmsConstant.stateByRoleOnLoad;
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
  const [redirectUrl, setRedirectUrl] = useState('');
  
  const currentUserPermission = (permission,user_type) => {
   // console.log(currentUserAction);
    let superAdmin   = currentUserAction.includes('super_admin');
    let classValue='';
       if(superAdmin){
        classValue="hidden";      
            return true;
       }else{
        let info  = currentUserAction.includes(permission);
        //let info  = checkPermission(permission);
        if(info){      
           return true ;
        }else{         
          return false;
        }
       }  

}

const checkPermission = (permission) => {
//  console.log(currentUserAction,"currentUserAction");
  let status =false;
  currentUserAction.forEach(function(value) {   
    //console.log(value,permission,"value");  
      value.forEach(function(data) {    
      //  console.log(data,"data");  
         if(data==permission){         
          status =  true;
         }
    });
  });

  return status;
 
}

const setSessionStorage = (STATE_KEY,value) => {
   value = JSON.stringify(value);
  sessionStorage.setItem(STATE_KEY, value);
}

const getSessionStorage = (STATE_KEY) => {
  sessionStorage.getItem(STATE_KEY);
}

const  currentUserRoleManagement = async (data) => {
  await  manageuser(data);
 
};

function manageuser(data){
 data?.user?.admin_roles.forEach(function (item) { 
   rolesAdded(item.id);
   //stateAdded(item.id);     
 });
}

const rolesAdded = (role) => {
  if(role=="super_admin"){         
    setUserIsSuperAdmin(1);
  }
for (const [key, value] of Object.entries(appAction)) {   
   // console.log(key, value,role);    
    if(key==role){   
        appAction[key].forEach(function(value) {
          setCurrentUserAction(currentUserAction => [...currentUserAction, value]);  
          
      });

    }
  }
};


const  logoutUserCheck =(redirectCallback=false) => {
 
  if (appUserInfo == null) {      
       let user_info = sessionStorage.getItem("user_info");
        user_info =JSON.parse(user_info);
       if( user_info == null  || user_info==''){
          setLoading(false);
          clearAPPData();          
          Router.push('/');        
          return false;

       }else{
          setAppUserInfo(user_info);
          currentUserRoleManagement(user_info);
       }
      
  }
}




const clearAPPData =() =>{
  setLoading(false);
  setAppUserInfo(null);
  setUserIsSuperAdmin(0);  
  setCurrentUserAction([]);
  setCurrentUserState([]);
  setSessionStorage('user_info','');
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
    setUserIsSuperAdmin,
    setSessionStorage,
    getSessionStorage,
    logoutUserCheck,
    setRedirectUrl,
    redirectUrl

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