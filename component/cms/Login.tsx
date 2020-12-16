import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

import { LayoutContext } from "contexts";
import HttpCms from "utils/http-cms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Inputs = {
  email: string;
  password: string
}

const schema = yup.object().shape({
  email: yup.string().required().label('Email'),
  password: yup.string().required().label('Password')
})


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
    setRedirectUrl
  } = useContext(LayoutContext);

  const { register, handleSubmit, errors } = useForm<Inputs>({
    resolver: yupResolver(schema)
  })

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const tempData = [];

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

  const currentUserRoleManagement = async (data) => {
    await manageuser(data);
    //Router.push("/cms");
    console.log(redirectUrl, "redirectUrl", redirectUrl != '');

    if (redirectUrl != '') {
      Router.push(
        '/cms/[item_id]',
        '/cms/' + redirectUrl);
      setRedirectUrl('');

    } else {
      //setRedirectUrl('');
      Router.push("/cms");
    }


  };

  function manageuser(data) {
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
    if (role == "super_admin") {
      setUserIsSuperAdmin(1);
    }
    for (const [key, value] of Object.entries(appAction)) {
      // console.log(key, value,role);    
      if (key == role) {
        appAction[key].forEach(function (value) {
          setCurrentUserAction(currentUserAction => [...currentUserAction, value]);

        });

      }
    }
  };

  const submit = (data: Inputs) => {

    setIsLoading(true)

    const { email, password } = schema.cast(data)

    HttpCms.post("/admin_user/login", { email, password })
      .then((response) => {
        if (response.data.token != "") {
          let firstName = response.data.user.first_name;
          let lastName = response.data.user.last_name;
          response.data.displayName = firstName.charAt(0) + lastName.charAt(0);
          setAppUserInfo(response.data);
          setSessionStorage('user_info', response.data);
          currentUserRoleManagement(response.data);
          if (response.data.user.on_shift == null) {
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
          alert("Something wrong !!");
        }
        setError(null)
      })
      .catch((err) => {
        if (err.response?.data?.error_message) {
          const errorMessage = [
            'AuthenticationError',
            'Expected 1 results; got 0'
          ].includes(err.response.data.error_message) ? 'Wrong credentials' : 'Something went wrong'

          setError(errorMessage)
          // setLoading(false);
        }

      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  function checkShiftSatus(appUserInfo) {
    HttpCms.patch(`/admin_user/${appUserInfo.user.email}/toggle_shift?token=${appUserInfo.token}`)
      .then((response) => {
        if (response.data.user.on_shift != null) {
          //alert("shift api call when first time login");
        } else {
          alert("Something wrong !!");
        }
      })
      .catch((e) => {

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

          {(error || errors.email || errors.password) && <div className="rounded-md bg-red-50 p-4 mt-5">
            <div className="text-sm text-red-700">
              <ul className="list-disc pl-5 space-y-1">
                {errors.email && <li className="flex">
                  <span className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="ml-3">{errors.email.message}.</span></li>}
                {errors.password && <li className="flex">
                  <span className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="ml-3">{errors.password.message}.</span></li>}
                {error && <li className="flex">
                  <span className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="ml-3">{error}.</span></li>}
              </ul>
            </div>
          </div>}


          <form onSubmit={handleSubmit(submit)} className="mt-8" >
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm">

              <div>
                <input
                  disabled={isLoading}
                  ref={register}
                  aria-label="Email address"
                  name="email"
                  type="email"
                  className={(isLoading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'}
                  placeholder="Email address"
                />
              </div>
              <div className="-mt-px">
                <input
                  disabled={isLoading}
                  ref={register}
                  aria-label="Password"
                  name="password"
                  type="password"
                  className={(isLoading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'}
                  placeholder="Password"
                />
              </div>


            </div>

            <div className="mt-6">
              <button
                disabled={isLoading}
                type="submit"
                className={(isLoading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white sfd-btn-primary focus:outline-none transition duration-150 ease-in-out'}
              >
                {!isLoading && <span className="absolute left-0 inset-y-0 flex items-center pl-3">
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
                </span>}
                {isLoading && <FontAwesomeIcon className="animate-spin h-5 w-5 mr-3" icon={['fas', 'spinner']} />}

                {!isLoading && 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
