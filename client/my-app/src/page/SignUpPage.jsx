import SignUp from "../components/signUp";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const submit = (formData, setIsSending, setBadRequestText) => {
    const clientData = {
      full_name: formData.full_name,
      age: formData.age,
      gender: formData.gender,
      email: formData.email,
      password: formData.password,
    };
    const clientUrl = "http://localhost:5000/fb/insert-client";

    fetch(clientUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(clientData),
    })
      .then(async (res) => {
        if (!res.ok) {
          return await res.json().then((badRes) => {
            setBadRequestText(badRes.error || "An unknown error occured");
            setTimeout(() => {
              setBadRequestText("");
            }, 3000);
            throw new Error(
              `Network response was not ok while Posting a client: ${res.statusText}`
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsSending(false);
        navigate(`/home/${data.address_id}`);
        console.log("Both client and address posts succedded");
      })
      .catch((error) => {
        setIsSending(false);
        console.error("Error with posting client and address:", error);
      });
  };

  return <SignUp toSignup={submit} />;
};

export default SignUpPage;
