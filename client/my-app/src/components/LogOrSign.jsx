import { FaPlusCircle, FaSmileWink } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const LogOrSign = () => {
  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-[url('/assets/images.jpeg')] bg-cover bg-center filter blur-sm brightness-75"></div>
      <div className="relative text-center bg-stone-200 px-2 py-5 md:px-5 md:py-8 rounded-2xl">
        <h1 className="text-2xl font-bold">
          Welcome to <span className="text-blue-700">My</span>/
          <span className="text-pink-500">Your</span> Website
          <FaSmileWink className="inline ml-1 mb-1" />
        </h1>
        <p className="font-medium md:inline-block">
          Create a new account
          <FaPlusCircle className="inline text-blue-500 ml-1 mb-1" />:
        </p>
        <button>
          <NavLink
            className="bg-blue-700 px-2 py-3 rounded-xl mb-5 md:ml-3 text-white hover:bg-blue-600 inline-block"
            to="/sign-up"
          >
            Sign up
          </NavLink>
        </button>
        <br />
        <p className="font-medium md:inline-block">No! I have one:</p>
        <NavLink
        className=" inline-block bg-pink-500 text-white px-2 py-3 rounded-xl md:ml-3 hover:bg-pink-400"
          to="/log-in"
        >
          Log in
        </NavLink>
      </div>
    </div>
  );
};

export default LogOrSign;
