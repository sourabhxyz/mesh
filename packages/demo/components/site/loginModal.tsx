import { XMarkIcon } from '@heroicons/react/24/solid';
import { CardanoWallet } from '@meshsdk/react';
import useAuth from '../../contexts/auth';

export default function LoginModal() {
  const { showLoginModal } = useAuth();

  return (
    <>
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen w-full bg-gray-200 dark:bg-gray-900">
          <LoginArea />
        </div>
      )}
    </>
  );
}

function LoginArea() {
  const { setShowLoginModal, frontendStartLoginProcess } = useAuth();

  return (
    <div className="relative p-4 w-full max-w-2xl h-auto">
      <div className="absolute top-8 right-8">
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => setShowLoginModal(false)}
        >
          <XMarkIcon className="w-5 h-5" />
          <span className="sr-only">Close modal</span>
        </button>
      </div>

      <div className="w-full bg-white rounded-lg shadow md:mt-0 xl:p-0 dark:bg-gray-800">
        <div className="p-6 space-y-4 md:space-y-6 lg:space-y-8 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white">
            Sign in to Mesh
          </h1>

          <div className="grid m-auto w-full text-gray-900 dark:text-white h-36">
            <div className="place-self-center">
              <CardanoWallet
                label="Sign In with Cardano"
                onConnected={() => frontendStartLoginProcess()}
              />
            </div>
          </div>
          {/* <form className="space-y-4 md:space-y-6" action="#">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="confirm-password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-gray-500 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Log in to your account
            </button>
            <p className="text-sm font-light text-center text-gray-500 dark:text-gray-300">
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Don't have an account?
              </a>
            </p>
          </form> */}
        </div>
      </div>
    </div>
  );
}
