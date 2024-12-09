import { FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";
import { useState } from "react";

const ManageYourAcc = ({
  formData,
  passwordProps,
  manageProps,
  isFullName,
  fullNameRef,
}) => {
  const {
    password,
    setPassword,
    reEnteredPassword,
    setReEnteredPassword,
    isPasssworMatched,
    isPasswordConfirmed,
  } = passwordProps;

  const {
    isUpdating,
    isDeleting,
    badManageRequest,
    badPasswordRequest,
    handleChange,
    handlePasswordSubmit,
    handleManageSubmit,
  } = manageProps;
  
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnteredPassword, setShowReEnteredPassword] = useState(false);
  const faStyle = "absolute top-[74px] right-14 md:top-[51px]";
  const btnStyle =
    "bg-blue-600 p-1 w-56 md:w-44 rounded-xl text-white hover:bg-blue-500";

    const passwordEye = () => {
    if (!showPassword) {
      setShowPassword(true);
      setTimeout(() => {
        setShowPassword(false);
      }, 3000);
    }
  };

  const reEntersPasswordEye = () => {
    if (!showReEnteredPassword) {
      setShowReEnteredPassword(true);
      setTimeout(() => {
        setShowReEnteredPassword(false);
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center mt-24 relative">
      <form
        onSubmit={handlePasswordSubmit}
        className={isPasswordConfirmed ? "hidden" : " absolute z-10"}
      >
        <div className="relative bg-blue-500 p-10 shadow-black drop-shadow-xl rounded-xl -mt-32">
          <label htmlFor="password-confirm" className="font-bold">
            Password:{" "}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password-confirm"
            name="password-confirm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-input md:ml-14"
          />
          {showPassword ? (
            <FaEyeSlash
              onClick={() => {
                setShowPassword(false);
              }}
              className={faStyle}
            />
          ) : (
            <FaEye onClick={passwordEye} className={faStyle} />
          )}
          <div className="text-center">
            <div className="-mb-2 text-yellow-400 text-center max-w-52 break-words leading-5 md:ml-32">
              {badPasswordRequest || "\u00A0"}
            </div>
            <button
              type="submit"
              className="bg-blue-400 px-3 py-1 mt-2 rounded-lg md:ml-32"
            >
              Go
            </button>
          </div>
        </div>
      </form>
      <form
        onSubmit={handleManageSubmit}
        className={
          isPasswordConfirmed
            ? "mt-5 max-w-xl signup-form bg-stone-50 p-10 rounded-md drop-shadow-2xl"
            : "mt-5 max-w-xl signup-form bg-stone-50 p-10 rounded-md drop-shadow-2xl filter blur-sm"
        }
      >
        <fieldset disabled={!isPasswordConfirmed}>
          <div>
            <label htmlFor="full_name" ref={fullNameRef}>
              Full Name:
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="signup-input md:ml-[54px]"
            />
          </div>
          {isFullName ? (
            ""
          ) : (
            <p className="ml-2 md:ml-32 text-xs text-red-600">
              Please add your full name: &apos;John Doe&apos;
            </p>
          )}
          <div>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="signup-input md:ml-20"
            />
          </div>
          <div className="relative">
            <label htmlFor="password">Password: </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="signup-input md:ml-[57px]"
            />
            {showPassword ? (
              <FaEyeSlash
                onClick={() => {
                  setShowPassword(false);
                }}
                className="show-password md:mr-8"
              />
            ) : (
              <FaEye onClick={passwordEye} className="show-password md:mr-8" />
            )}
          </div>
          <div className="relative">
            <label htmlFor="re-password">Re-Enter Password: </label>
            <input
              type={showReEnteredPassword ? "text" : "password"}
              id="re-password"
              name="re-password"
              value={reEnteredPassword}
              onChange={(e) => setReEnteredPassword(e.target.value)}
              required
              className="signup-input md:-ml-[6px]"
            />
            {showReEnteredPassword ? (
              <FaEyeSlash
                onClick={() => {
                  setShowReEnteredPassword(false);
                }}
                className="show-password md:mr-8"
              />
            ) : (
              <FaEye
                onClick={reEntersPasswordEye}
                className="show-password md:mr-8"
              />
            )}
          </div>
          <p className="text-xs text-red-500 md:ml-32">
            {isPasssworMatched ? "" : <span>Password does not match!!!</span>}
          </p>
          <div className="my-2">
            <label htmlFor="gender">
              SeX: <span className="opacity-30">(optional)</span>
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="block md:inline-block border-y-2 md:border-l-2 md:ml-6 py-1 px-2 rounded-md opacity-60 bg-stone-300"
            >
              <option value="">Prefer not to answer</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Ambigous">Not know yet!</option>
            </select>
          </div>
          <div>
            <label htmlFor="age">
              Age: <span className="opacity-30">(optional)</span>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="signup-input md:ml-6"
            />
          </div>
          <p className="text-red-600 max-w-60 break-words text-center leading-4 mt-2 -mb-1 md:max-w-80 md:px-2 md:ml-10">
            {badManageRequest || "\u00A0"}
          </p>
          <div className=" flex flex-col items-center justify-center space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <button
              type="submit"
              name="update"
              className={btnStyle}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
            <button
              type="submit"
              name="delete"
              className={btnStyle}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

ManageYourAcc.propTypes = {
  formData: PropTypes.object.isRequired,
  passwordProps: PropTypes.shape({
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    reEnteredPassword: PropTypes.string.isRequired,
    setReEnteredPassword: PropTypes.func.isRequired,
    isPasssworMatched: PropTypes.bool.isRequired,
    isPasswordConfirmed: PropTypes.bool.isRequired,
  }).isRequired,
  manageProps: PropTypes.shape({
    isUpdating: PropTypes.bool.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    badManageRequest: PropTypes.string,
    badPasswordRequest: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handlePasswordSubmit: PropTypes.func.isRequired,
    handleManageSubmit: PropTypes.func.isRequired,
  }).isRequired,
  isFullName: PropTypes.bool.isRequired,
  fullNameRef: PropTypes.any,
};

export default ManageYourAcc;
