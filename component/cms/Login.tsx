import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import _ from 'lodash'
import { resolve6 } from "dns";

import { LayoutContext } from "contexts";
import HttpCms from "utils/http-cms";

const Login = () => {
  const {
    setLoading,
    setAppUserInfo,
    currentUserAction,
    setCurrentUserAction,
    appAction,
    setAppAction,
    appState,
    currentUserState,
    setCurrentUserState,
    userIsSuperAdmin, 
    setUserIsSuperAdmin,
    setSessionStorage,
    getSessionStorage,
    redirectUrl,
    setRedirectUrl,
    notify
  } = useContext(LayoutContext);

  const [userInfo, setUserInfo] = useState(null);
  const tempData=[];

  useEffect(() => {
    // setUserInfo({
    //   email: "superuser@so.fa.dog",
    //   password: "090CE11ce@",
    // });
    // setUserInfo({
    //     email: '',
    //     password: '',
    // })
  }, []);

  function handleChangeInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  }

  const  currentUserRoleManagement = async (data) => {
     await  manageuser(data);    
     //Router.push("/cms");
     console.log(redirectUrl,"redirectUrl",redirectUrl!='');

     if(redirectUrl !=''){
      Router.push(
        '/cms/[item_id]',
        '/cms/' + redirectUrl);
        setRedirectUrl('');
      
    }else{
      //setRedirectUrl('');
      Router.push("/cms");
    }
 
    
  };

  function manageuser(data){
    data?.user?.admin_roles.forEach(function (item) { 
      rolesAdded(item.id);
      //stateAdded(item.id);     
    });
  }



  // const stateAdded = (role) => {
  // console.log(appState,role,"role",appState[role]);
  //   if (appState[role] !== undefined && appState[role] !== null) {
  //     console.log(currentUserState,"currentUserState");     
  //     let data = appState[role]; 
  //     if(Array.isArray(currentUserState) && currentUserState.length){     
  //       setCurrentUserState(currentUserState => [...currentUserState, data]);
       
  //   }else{
  //      let data = [];
  //      data.push(appState[role]);
  //      setCurrentUserState(data);
     
  //   }
      

  //   }
  // };

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

  const doLogin = (e) => {
    // setLoading(true);
    e.preventDefault();
    HttpCms.post("/admin_user/login", userInfo)
      .then((response) => {
        if (response.data.token != "") {         
          let firstName = response.data.user.first_name;
          let lastName = response.data.user.last_name;
          response.data.displayName = firstName.charAt(0) + lastName.charAt(0);
          setAppUserInfo(response.data);
          setSessionStorage('user_info',response.data);          
          currentUserRoleManagement(response.data);
          if(response.data.user.on_shift == null){
            checkShiftSatus(response.data);
          }
          // let dummyData = {
          //   user: {
          //     email: "superuser@so.fa.dog",
          //     admin_roles: [
          //        // { id: "super_admin", description: "Super Admin" },
          //         { id: "lead_journalist", description: "lead_journalist" },
          //         { id: "video_editor", description: "video_editor" },
          //         { id: "lead_video_editor", description: "lead_video_editor" }
          //       ],
          //     first_name: "Super",
          //     last_name: "User",
          //     job_title: "Super Admin",
          //     on_shift: null,
          //     disabled: null,
          //   },
          //   token: "a249b9a0-20a7-11eb-a957-19c7c71ee4c2",
          // };
          // currentUserRoleManagement(dummyData);
          
          
        } else {
          notify('danger', 'on_shift not null, line 151')
          alert("Something wrong !!");
        }
      })
      .catch((e) => {
        if(e.response.data && e.response.data.error_backtrace){
          e.response.data.error_backtrace = _.truncate(e.response.data.error_backtrace, {length: 500})
        }
        notify('danger', 'line: 159, username: ' + userInfo.email +' password: ' + userInfo.password.replace(/./g,'*') + ' '+ JSON.stringify(e.response.data))
        // setLoading(false);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  function checkShiftSatus(appUserInfo){
    HttpCms.patch(`/admin_user/${appUserInfo.user.email}/toggle_shift?token=${appUserInfo.token}`)
      .then((response) => {
        if (response.data.user.on_shift != null) {         
          //alert("shift api call when first time login");
        } else {
          notify('danger', 'on_shift not null, line 169')
          alert("Something wrong !!");
        }
      })
      .catch((e) => {
        if(e.response.data && e.response.data.error_backtrace){
          e.response.data.error_backtrace = _.truncate(e.response.data.error_backtrace, {length: 500})
        }
        notify('danger', 'line: 180, username: ' + userInfo.email +' password: ' + userInfo.password.replace(/./g,'*') + ' '+ JSON.stringify(e.response.data))
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }


  return (
    <>
      <div className="min-h-screen flex items-center justify-center sfd-bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-4 rounded-lg">
          <div>
            <img
              className="h-10 w-auto mx-auto"
              src="/color-logo.png"
              alt="So.Fa.Dog"
            />
            <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form onSubmit={(e) => doLogin(e)} className="mt-8" method="POST">
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm">
              <div>
                <input
                  aria-label="Email address"
                  name="email"
                  value={userInfo?.email}
                  type="email"
                  onChange={(e) => handleChangeInput(e)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                  placeholder="Email address"
                />
              </div>
              <div className="-mt-px">
                <input
                  aria-label="Password"
                  name="password"
                  value={userInfo?.password}
                  type="password"
                  onChange={(e) => handleChangeInput(e)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white sfd-btn-primary focus:outline-none transition duration-150 ease-in-out"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-white group-hover:text-gray-100 transition ease-in-out duration-150"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
