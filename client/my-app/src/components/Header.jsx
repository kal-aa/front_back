import { useRef, useState } from "react";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import PropTypes from "prop-types";

const Header = ({ setElipsis = true, showMiddleSection = false }) => {
  const [elipsisClicked, setElipsisClicked] = useState(setElipsis);
  const [searchValue, setSearchValue] = useState();
  const inputRef = useRef(null);
  const { id } = useParams();

  const isActive = ({ isActive }) =>
    isActive ? "header-hover bg-blue-300 py-1 px-2" : "header-hover py-1 px-2";

  const searchClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <>
      <div className="fixed bg-blue-200 top-0 left-0 right-0 h-24 flex justify-around items-center md:text-lg">
        {/* Lef section of the header */}
        <div className="flex items-center ml-1">
          <img
            src="../assets/cart.jpeg"
            alt="cart.jpeg"
            className="sm:w-20 w-16  h-10 rounded-full"
          />
          <FaEllipsisV
            onClick={() => {
              setElipsisClicked((prev) => !prev);
            }}
            className={
              elipsisClicked
                ? "h-5 mr-2 text-yellow-800 hover:text-yellow-600 sm:hidden"
                : "h-5 mr-2 text-yellow-800 hover:text-yellow-600 sm:hidden hover:"
            }
          />
          <div
            className={
              elipsisClicked
                ? "space-y-1 sm:flex sm:flex-row sm:space-x-4 sm:items-center"
                : "space-y-1 sm:flex sm:flex-row sm:space-x-4 sm:items-center hidden"
            }
          >
            <div>
              <NavLink to={`/home/${id}`} className={isActive}>
                Home
              </NavLink>
            </div>
            <div>
              <NavLink to={`/add-order/${id}`} className={isActive}>
                Add order
              </NavLink>
            </div>
            <div>
              <NavLink to={`/your-order/${id}`} className={isActive}>
                Your order
              </NavLink>
            </div>
          </div>
        </div>

        {/* Middle section of the header */}
        {showMiddleSection && (
          <div className="w-1/3 flex items-center">
            <input
              ref={inputRef}
              type="text"
              name="search"
              id="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="outline-none focus:border focus:border-red-400 w-full px-2 py-2 -mr-1 rounded-l-lg border-gray-300"
            />
            <button
              onClick={searchClick}
              className="bg-gray-200 py-2 pl-2 pr-3 rounded-r-xl"
            >
              <FaSearch className="inline-block" />
            </button>
          </div>
        )}

        {/* Right section of the header */}
        <div
          className={
            showMiddleSection
              ? "flex flex-col text-center justify-center space-y-1 mr-2"
              : "flex sm:flex sm:flex-col text-center justify-center space-y-1 mr-2"
          }
        >
          <div className="hidden md:inline">
            <NavLink to={`/manage-your-acc/${id}`} className={isActive}>
              manage your acc
            </NavLink>
          </div>
          <div className="">
            <NavLink to={`/about-us/${id}`} className={isActive}>
              About us
            </NavLink>
          </div>
          <div className="">
            <NavLink to={`/contact-us/${id}`} className={isActive}>
              Contact us
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

Header.propTypes = {
  setElipsis: PropTypes.bool,
  showMiddleSection: PropTypes.bool,
};

export default Header;
