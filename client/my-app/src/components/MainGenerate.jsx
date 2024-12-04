import PropTypes from "prop-types";
import { NavLink, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const MainGenerate = ({
  handleSizeChange,
  handleColorChange,
  handleQuantityChange,
  products,
  isPending,
  onSubmit,
  isHome,
}) => {
  const { id } = useParams("id");
  const cap = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="px-10 py-5">
      <h1 className="text-x font-bold px-10 py-5 mb-10 text-center text-yellow-700 bg-stone-100 rounded-2xl md:rounded-full 
      ">
        {!isHome
          ? "Order us and we'll bring it to where you are in the speed of light!"
          : "This Website is Dedicated to Offering an Incredible E-Commerce Service for Apparel. Whether you're on the hunt for the latest trends, timeless classics, or comfortable everyday wear, our platform offers an intuitive and efficient way to discover the perfect pieces to elevate your wardrobe."}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:-mx-7 sm:-mx gap-5 ">
        {isPending ? (
          <div className="text-center col-span-3">
            <ClipLoader size={250} />
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-2 border-2 rounded-3xl relative"
            >
              <a
                href={`/assets/images/${product.for}/${product.type}/${product.selectedColor}-${product.type}.jpeg`}
              >
                <img
                  src={`/assets/images/${product.for}/${product.type}/${product.selectedColor}-${product.type}.jpeg`}
                  alt={`${product.for}-${product.selectedColor}-${product.type}.jpeg`}
                  className="w-full h-full max-h-52 brightness-95"
                />
              </a>
              <form
                onSubmit={() =>
                  onSubmit(
                    product.id,
                    product.selectedColor,
                    product.selectedSize,
                    product.selectedQuantity,
                    product.price
                  )
                }
                className="grid grid-row-4 w-full bg-yellow-400 rounded-e-3xl"
              >
                <div className="text-center pt-2">
                  {cap(product.for) + " " + cap(product.type)}
                </div>
                <div className="absolute left-[40%] -top-4 bg-black text-white px-2 rounded-lg">
                  Price: ${product.price}
                </div>

                <div className="row-span-3 grid grid-cols-3 px-2 sm:px-1 lg:px-2 gap-1 text-xs spacey border-white">
                  <div className="col-span-2 space-y-2">
                    {Object.entries(product.color).map(
                      ([index, colorValue]) => (
                        <div key={index}>
                          <input
                            key={index}
                            type="radio"
                            name={`color-${product.id}`}
                            value={colorValue}
                            checked={product.selectedColor === colorValue}
                            onChange={(e) => handleColorChange(e, product.id)}
                            className="mr-2 md:mr-2"
                          />
                          {cap(colorValue).replace("-", " ")} <br />
                        </div>
                      )
                    )}
                  </div>
                  <div className="justify-self-center space-y-2">
                    {["XS", "SM", "MD", "LG", "XL"].map((size) => (
                      <div key={size}>
                        <input
                          type="radio"
                          name={`size-${product.id}`}
                          value={size}
                          className="mr-2 sm:mr-1 md:mr2"
                          checked={product.selectedSize === size}
                          onChange={(e) => handleSizeChange(e, product.id)}
                        />
                        {size} <br />
                      </div>
                    ))}
                  </div>
                </div>
                <div className=" text-center border-t p-1">
                  Quantity:
                  <select
                    name={`quantity-${product.id}`}
                    id="qunantity"
                    className="rounded-lg ml-2"
                    onChange={(e) => handleQuantityChange(e, product.id)}
                  >
                    {[...Array(10).keys()].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-center">
                  {isHome ? (
                    ""
                  ) : (
                    <button
                      type="submit"
                      className="bg-white mb-1 w-1/2 rounded-xl"
                    >
                      add
                    </button>
                  )}
                </div>
              </form>
            </div>
          ))
        )}
        {isHome ? (
          <div className=" self-end text-sm font-bold">
            Please head to the
            <NavLink to={`/add-orders/${id}`} className="text-blue-800 mx-1 hover:text-blue-600">
              Add orders
            </NavLink>
            page to place orders...
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

MainGenerate.propTypes = {
  handleSizeChange: PropTypes.func.isRequired,
  handleColorChange: PropTypes.func.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  isPending: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isHome: PropTypes.bool.isRequired,
};

export default MainGenerate;
