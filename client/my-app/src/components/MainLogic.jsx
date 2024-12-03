import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MainGenerate from "./MainGenerate";

const MainLogic = ({ isHome = true }) => {
  const [products, setProducts] = useState([]);
  const [isPending, setIsPending] = useState(false);

  const handleColorChange = (event, productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedColor: event.target.value }
          : product
      )
    );
  };

  const handleSizeChange = (event, productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedSize: event.target.value }
          : product
      )
    );
  };

  const handleQuantityChange = (event, productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedQuantity: event.target.value }
          : product
      )
    );
  };

  const onSubmit = (id, color, size, quantity, price) => {
    alert(
      `Id: ${id}\n Color: ${color}\n Size: ${size}\n Quantity: ${quantity}\n price: ${price}`
    );
  };

  useEffect(() => {
    setIsPending(true);
    fetch("/assets/products.json")
      .then((res) => res.json())
      .then((json) => {
        setIsPending(false);
        const productsWithDefaults = json.products.map((product) => ({
          ...product,
          selectedColor: "black",
          selectedSize: "MD",
          selectedQuantity: 1,
        }));
        isHome
          ? setProducts(productsWithDefaults.slice(0, 2))
          : setProducts(productsWithDefaults);
      })
      .catch((error) => {
        console.error("Error fetching the JSON", error);
      });
  }, [isHome]);

  return (
    <MainGenerate
      handleSizeChange={handleSizeChange}
      handleColorChange={handleColorChange}
      handleQuantityChange={handleQuantityChange}
      products={products}
      isPending={isPending}
      onSubmit={onSubmit}
      isHome={isHome}
    />
  );
};

MainLogic.propTypes = {
  isHome: PropTypes.bool,
};

export default MainLogic;
