import { useRef, useState } from "react";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import PropTypes from "prop-types";

const Header = ({ setElipsis = true, showMiddleSection = false, search }) => {
  const [elipsisClicked, setElipsisClicked] = useState(setElipsis);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);
  const { id } = useParams();

  const isActive = ({ isActive }) =>
    isActive ? "header-hover bg-blue-300 py-1 px-2" : "header-hover py-1 px-2";

  const handlekeyDown = (e) => {
    if (e.key === "Enter") {
      search(searchValue);
    }
  };

  const searchClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      search(searchValue);
    }
  };
  return (
    <>
      <header className="fixed bg-blue-200 top-0 left-0 right-0 h-24 flex justify-around items-center text-sm md:text-base font-bold z-20">
        {/* Lef section of the header */}
        <div className="flex items-center ml-1">
          <img
            src="/assets/images/cart.jpeg"
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
                ? "space-y-1 sm:flex sm:flex-row sm:space-x-4 sm:items-center sm:ml-2"
                : "space-y-1 sm:flex sm:flex-row sm:space-x-4 sm:items-center sm:ml-2 hidden"
            }
          >
            <div>
              <NavLink to={`/home/${id}`} className={isActive}>
                Home
              </NavLink>
            </div>
            <div>
              <NavLink to={`/add-orders/${id}`} className={isActive}>
                Add orders
              </NavLink>
            </div>
            <div>
              <NavLink to={`/your-orders/${id}`} className={isActive}>
                Your orders
              </NavLink>
            </div>
          </div>
        </div>

        {/* Middle section of the header */}
        {showMiddleSection && (
          <div className="w-1/4 flex items-center">
            <input
              ref={inputRef}
              type="text"
              name="search"
              id="search"
              value={searchValue}
              onKeyDown={handlekeyDown}
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
      </header>
    </>
  );
};

Header.propTypes = {
  setElipsis: PropTypes.bool,
  showMiddleSection: PropTypes.bool,
  search: PropTypes.func,
};

export default Header;
