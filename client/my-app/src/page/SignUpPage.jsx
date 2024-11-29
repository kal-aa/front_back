import SignUp from "../components/SignUp";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const submit = (formData, setIsSending) => {
    const client = {
      full_name: formData.full_name,
      age: formData.age,
      gender: formData.gender,
    };
    const address = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
    };
    const clientUrl = "http://localhost:5000/fb/insert-client";
    const addressUrl = "http://localhost:5000/fb/insert-address";

    fetch(clientUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(client),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Network response was not ok while Posting a client: ${res.statusText}`
          );
        }
        if (res.status === 201) {
          return {};
        }
        return res.json();
      })
      .then(() => {
        return fetch(addressUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(address),
        });
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Network response was not ok while Posting an address: ${res.statusText}`
          );
        }

        return res.json();
      })
      .then((data) => {
        setIsSending(false);
        navigate(`/home/${data.client_id}`);
        console.log("Both client and address posts succedded:");
      })
      .catch((error) => {
        setIsSending(false);
        console.error("Error with posting client and address:", error);
      });
  };

  return <SignUp toSignup={submit} />;
};

export default SignUpPage;
