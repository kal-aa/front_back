import { useRef, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import PropTypes from "prop-types";

const SignUp = ({ toSignup }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordconfirmed, setPasswordConfirmed] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isFullName, setIsFullName] = useState(true);
  const [badRequestText, setBadRequestText] = useState();
  const timeoutRef = useRef(null);
  const fullNameRef = useRef(null);

  const passwordEye = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowPassword(true);
    timeoutRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 3000);
  };

  const confirmPasswordEye = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowConfirmPassword(true);
    timeoutRef.current = setTimeout(() => {
      setShowConfirmPassword(false);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const fullNameArray = formData.full_name.trim().split(" ");
    if (fullNameArray.length !== 2) {
      fullNameRef.current ? fullNameRef.current.click() : "";
      setIsFullName(false);
      return;
    }
    setIsFullName(true);
    if (formData.password !== confirmPassword) {
      setPasswordConfirmed(false);
      return;
    }
    setPasswordConfirmed(true);
    setIsSending(true);
    toSignup(formData, setIsSending, setBadRequestText);
  };
  
  return (
    <>
      <h1 className="text-center text-blue-500 text-4xl font-bold mt-5">
        Sign up
      </h1>
      <div className="flex items-center justify-center">
        <form
          onSubmit={submit}
          className="mt-5 max-w-xl signup-form bg-stone-50 p-10 rounded-md drop-shadow-2xl"
        >
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
              placeholder="Sample: John Doe"
              required
              className="signup-input md:ml-[54px]"
            />
          </div>
          {isFullName ? (
            ""
          ) : (
            <p className="ml-2 md:ml-32 text-xs text-red-600">
              Please add your full name
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
              placeholder="Sample: John@email.com"
              required
              className="signup-input md:ml-20"
            />
          </div>
          <p className="text-xs text-blue-500 -mt-1 ml-1 md:ml-32">
            note! this email address is valid only in this <br /> Website.
          </p>
          <div className="relative">
            <label htmlFor="password">Password: </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="signup-input md:ml-[58px]"
            />
            {showPassword ? (
              <FaEyeSlash
                onClick={() => {
                  setShowPassword(false);
                }}
                className="show-password"
              />
            ) : (
              <FaEye onClick={passwordEye} className="show-password" />
            )}
          </div>
          <div className="relative">
            <label htmlFor="confirm-password">Re-Enter Password:</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="signup-input"
            />
            {showConfirmPassword ? (
              <FaEyeSlash
                onClick={() => {
                  setShowConfirmPassword(false);
                }}
                className="show-confirm-password"
              />
            ) : (
              <FaEye
                onClick={confirmPasswordEye}
                className="show-confirm-password"
              />
            )}
          </div>
          <p className="text-xs text-red-500 md:ml-32">
            {passwordconfirmed ? "" : <span>Password does not match!!!</span>}
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
          <p className="md:max-w-80 md:px-2 md:pl-5 text-red-600 max-w-60 px-4 break-words text-center leading-4 mt-2 -mb-2">
            {badRequestText || '\u00A0'}
          </p>
          <div className="justify-self-center">
            <button
              type="submit"
              className="bg-blue-600 p-1 w-56 md:w-80 rounded-xl text-white hover:bg-blue-500"
              disabled={isSending}
            >
              {isSending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

SignUp.propTypes = {
  toSignup: PropTypes.func.isRequired,
};

export default SignUp;
