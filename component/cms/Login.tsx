import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import HttpCms from "../../utils/http-cms";
import { LayoutContext } from "../../contexts/";
import { resolve6 } from "dns";

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
    setUserIsSuperAdmin
  } = useContext(LayoutContext);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setUserInfo({
      email: "superuser@so.fa.dog",
      password: "090CE11ce@",
    });
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

  const currentUserRoleManagement = (data) => {
    // console.log(data,"data");
    data?.user?.admin_roles.forEach(function (item) {
      rolesAdded(item.id);
      stateAdded(item.id);
    });
  };

  const stateAdded = (role) => {
    let arrayData = [];
    arrayData = currentUserState;
    if (appState[role] !== undefined && appState[role] !== null) {

      arrayData.push(appState[role]);
      setCurrentUserState(arrayData);
    }
  };

  const rolesAdded = (role) => {
      if(role=="super_admin"){
          console.log(role,"rolerolerole");
        setUserIsSuperAdmin(1);
      }
    for (const [key, value] of Object.entries(appAction)) {
        console.log(`${key}: ${role}`)
        if(key==role){
            //console.log(`${key}: ${value}`);
            let arrayData = [];
            arrayData = currentUserAction;
            arrayData.push(value);
            setCurrentUserAction(arrayData);
            console.log(currentUserAction);

        }
      }

    // if (appAction[role] !== undefined && appAction[role] != null) {
    //   //console.log(`${key}: ${value}`);
    //   let arrayData = [];
    //   arrayData = currentUserAction;
    //   let  arrayData2 =  arrayData.concat(appAction[role]);
    //   console.log(arrayData2);
    //   setCurrentUserAction(arrayData2);
    //   console.log(currentUserAction);
    // }
  };

  const doLogin = (e) => {
    setLoading(true);
    e.preventDefault();
    HttpCms.post("/admin_user/login", userInfo)
      .then((response) => {
        if (response.data.token != "") {
          Router.push("/cms");
          let firstName = response.data.user.first_name;
          let lastName = response.data.user.last_name;
          response.data.displayName = firstName.charAt(0) + lastName.charAt(0);
          setAppUserInfo(response.data);
          
          let dummyData = {
            user: {
              email: "superuser@so.fa.dog",
              admin_roles: [
                  { id: "super_admin", description: "Super Admin" },
                  { id: "video_editor", description: "lead_journalis" },
                //   { id: "user_manager", description: "user_manager" }
                ],
              first_name: "Super",
              last_name: "User",
              job_title: "Super Admin",
              on_shift: null,
              disabled: null,
            },
            token: "a249b9a0-20a7-11eb-a957-19c7c71ee4c2",
          };
          currentUserRoleManagement(dummyData);
        } else {
          alert("Something wrong !!");
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
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
