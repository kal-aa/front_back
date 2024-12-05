import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MainGenerate from "./MainGenerate";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const MainLogic = ({ isHome = true, isSearch, searchValue }) => {
  const [products, setProducts] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const { id } = useParams();

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

  const onSubmit = (e, json_id, who, type, color, size, quantity, price) => {
    e.preventDefault();
    const url = "http://localhost:5000/fb/insert-order";
    const order = {
      address_id: id,
      json_id,
      who,
      type,
      color,
      size,
      quantity,
      price,
    };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            toast.error(err.error);
            throw new Error("Error Posting an order");
          });
        }
        toast.success("Order added successfully");
      })
      .catch((error) => {
        console.error("Error with posting order", error);
        toast.error("An error occured");
      });
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

        let search;
        !isSearch
          ? ""
          : (search = productsWithDefaults.filter((product) => {
              const value = searchValue.trim().split(" ");

              if (value.length === 1 && value[0] !== "") {
                return product.type === searchValue;
              } else if (value.length === 2) {
                return product.for === value[0] && product.type === value[1];
              } else if (searchValue.length === 0) {
                return true;
              }
            }));

        isHome
          ? setProducts(productsWithDefaults.slice(0, 2))
          : isSearch
          ? setProducts(search)
          : setProducts(productsWithDefaults);
      })
      .catch((error) => {
        console.error("Error fetching the JSON", error);
      });
  }, [isHome, isSearch, searchValue]);

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
  isSearch: PropTypes.bool,
  searchValue: PropTypes.string,
};

export default MainLogic;
