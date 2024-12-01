import { FaPlusCircle, FaSmileWink } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const LogOrSign = () => {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('../assets/images/images.jpeg')] bg-cover bg-center filter blur-sm brightness-75"></div>
      <div className="relative text-center bg-stone-200 px-3 py-5 md:px-5 md:py-8 rounded-2xl">
        <h1 className="text-2xl font-bold">
          Welcome to <span className="text-blue-700">My</span>/
          <span className="text-pink-700">Your</span> Website
          <FaSmileWink className="inline ml-1 mb-1" />
        </h1>
        <p className="font-medium md:inline-block">
          Create a new account
          <FaPlusCircle className="inline text-blue-500 ml-1 mb-1" />:
        </p>
        <NavLink
          to="sign-up"
          className="inline-block px-2 py-3 rounded-xl mb-5 md:ml-3 text-white bg-blue-700 hover:bg-blue-600"
        >
          Sign up
        </NavLink>
        <br />
        <p className="font-medium md:inline-block">No! I have one:</p>
        <NavLink
          to="log-in"
          className="inline-block px-2 py-3 rounded-xl  md:ml-3 text-white bg-pink-700 hover:bg-pink-600"
        >
          Log in
        </NavLink>
      </div>
    </div>
  );
};

export default LogOrSign;
