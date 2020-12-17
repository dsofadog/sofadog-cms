import React from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "rootReducer";
import { login } from 'features/auth/slices/auth.slice'
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

  const { error, isLoading } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const { register, handleSubmit, errors } = useForm<Inputs>({
    resolver: yupResolver(schema)
  })


  const submit = (data: Inputs) => {
    const { email, password } = schema.cast(data)

    dispatch(login(email, password))

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

          <form onSubmit={handleSubmit(submit)} className="mt-6" method="POST">
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
