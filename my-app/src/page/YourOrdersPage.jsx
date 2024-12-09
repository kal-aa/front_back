import Header from "../components/Header";
import YourOrders from "../components/YourOrders";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const YourOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { id } = useParams();
  const address_id = id;

  useEffect(() => {
    fetch(`http://localhost:5000/fb/select-order?address_id=${address_id}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            if (error.error === "No order!") {
              toast.warning("No order Added");
              return [];
            }
            throw new Error("Error fetching Orders");
          });
        }

        return res.json();
      })
      .then((data) => {
        setOrders(data);
        console.log("Order Fetched successfully", data);
      })
      .catch((err) => {
        console.error("Error Fetching ordes", err);
      });
  }, [address_id]);

  const handleDelete = (e, order_id) => {
    e.preventDefault();

    const url = `http://localhost:5000/fb/delete-order?order_id=${order_id}`;
    fetch(url, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error deleting order");
        }
        
        setOrders(orders.filter((order) => order.order_id !== order_id));
        return res.json();
      })
      .then((data) => {
        console.error("Order deleted successfully", data);
      })
      .catch((error) => {
        console.error("Error deleting order", error);
      });
  };
  return (
    <div>
      <Header />
      <YourOrders handleDelete={handleDelete} orders={orders} />
    </div>
  );
};

export default YourOrdersPage;
