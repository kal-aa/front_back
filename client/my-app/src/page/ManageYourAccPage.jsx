import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import ManageYourAcc from "../components/ManageYourAcc";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ManageYourAccPage = () => {
  const [data, setData] = useState({});
  const [formData, setFormdata] = useState({
    full_name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
  });
  const [password, setPassword] = useState(""); // the mini authentication's password
  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnteredPassword, setShowReEnteredPassword] = useState(false);
  const [isFullName, setIsFullName] = useState(true);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false); // The mini authentication's confirm
  const [isPasssworMatched, setIsPasswordMatched] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [badManageRequest, setBadManageRequest] = useState("");
  const [badPasswordRequest, setBadPasswordRequest] = useState("");
  const navigate = useNavigate();

  const fullNameRef = useRef(null);
  const { id } = useParams();
  const address_id = id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    const url = `http://localhost:5000/fb/manage-account-password/${address_id}?password=${encodeURIComponent(
      password
    )}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            setBadPasswordRequest(error.error || "An unknown error occured");
            setTimeout(() => {
              setBadPasswordRequest("");
            }, 3000);
            throw new Error("Error Checking password");
          });
        }

        setIsPasswordConfirmed(true);
        console.log("Password checked successfully");
      })
      .catch((error) => {
        console.error("Error comparing password", error);
      });
  };

  useEffect(() => {
    if (!isPasswordConfirmed) {
      return;
    }

    const fillUrl = `http://localhost:5000/fb/select-to-manage/${address_id}?password=${encodeURIComponent(
      password
    )}`;

    fetch(fillUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching client data");
        }

        return res.json();
      })
      .then((data) => {
        setData(data);
        console.log("Client data fethced successfully");
      })
      .catch((error) => {
        console.error("Error fetching client data", error);
      });
  }, [address_id, password, isPasswordConfirmed, setData]);

  useEffect(() => {
    if (data) {
      setFormdata({
        full_name: data.full_name || "",
        email: data.email || "",
        password: data.password || "",
        gender: data.gender || "",
        age: data.age || "",
      });
      setReEnteredPassword(data.password || "");
    }
  }, [data]);

  const handleManageSubmit = (e) => {
    e.preventDefault();

    const actionType = e.nativeEvent.submitter.name;
    if (actionType === "delete") {
      const confirm = window.confirm(
        "Are you sure you want to delete All your data?"
      );

      const url = `http://localhost:5000/fb/manage-account-delete/${address_id}`;
      if (confirm) {
        setIsDeleting(true);
        fetch(url, { method: "DELETE" })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((error) => {
                setBadManageRequest(error.error);
                setTimeout(() => {
                  setBadManageRequest("");
                }, 3000);
                throw new Error("Error deleting client", error.error);
              });
            }

            setIsDeleting(false);
            toast.success("Account deleted successfully");
            navigate("/");
            console.log("Client deleted successfully");
          })
          .catch((error) => {
            setIsDeleting(false);
            console.error("Error deleting client", error);
          });
      }
    }

    const checkFullName = formData.full_name.trim().split(" ");
    if (checkFullName.length !== 2) {
      setIsFullName(false);
      setTimeout(() => {
        setIsFullName(true);
      }, 3000);
      fullNameRef.current.click();
      return;
    }

    if (formData.password !== reEnteredPassword) {
      setIsPasswordMatched(false);
      setTimeout(() => {
        setIsPasswordMatched(true);
      }, 3000);
      return;
    }

    if (actionType === "update") {
      const updateUrl = `http://localhost:5000/fb/manage-account-update/${address_id}`;
      const updateData = {
        full_name: formData.full_name,
        new_age: formData.age,
        new_gender: formData.gender,
        email: formData.email,
        password: formData.password,
      };

      setIsUpdating(true);
      fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((error) => {
              setBadManageRequest(error.error);
              setTimeout(() => {
                setBadManageRequest("");
              }, 3000);
              throw new Error("Error updating client data", error.error);
            });
          }

          setIsUpdating(false);
          toast.success("Updated successfully!");
          console.log("Client data updated successfully");
        })
        .catch((error) => {
          setIsUpdating(false);
          console.error("Error updating client data", error);
        });
    }
  };

  return (
    <>
      <Header />
      <ManageYourAcc
        formData={formData}
        passwordProps={{
          password,
          setPassword,
          reEnteredPassword,
          setReEnteredPassword,
          isPasssworMatched,
          isPasswordConfirmed,
          passwordEye,
          reEntersPasswordEye,
        }}
        manageProps={{
          isUpdating,
          isDeleting,
          badManageRequest,
          badPasswordRequest,
          handleChange,
          handlePasswordSubmit,
          handleManageSubmit,
        }}
        isFullName={isFullName}
        fullNameRef={fullNameRef}
      />
    </>
  );
};

export default ManageYourAccPage;
