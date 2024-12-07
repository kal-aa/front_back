import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogOrSignPage from "./page/LogOrSignPage";
import SignUpPage from "./page/SignUpPage";
import LogInPage from "./page/LogInPage";
import HomePage from "./page/HomePage";
import AddOrdersPage from "./page/AddOrdersPage";
import YourOrdersPage from "./page/YourOrdersPage";
import ManageYourAccPage from "./page/ManageYourAccPage";
import AboutUsPage from "./page/AbouUsPage";
import ContactUsPage from "./page/ContactUsPage";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();

  const noFooterRoutes = ["/", "/sign-up", "/log-in"];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LogOrSignPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/log-in" element={<LogInPage />} />
          <Route path="/home/:id" element={<HomePage />} />
          <Route path="/add-orders/:id" element={<AddOrdersPage />} />
          <Route path="/your-orders/:id" element={<YourOrdersPage />} />
          <Route path="/manage-your-acc/:id" element={<ManageYourAccPage />} />
          <Route path="/About-us/:id" element={<AboutUsPage />} />
          <Route path="/contact-us/:id" element={<ContactUsPage />} />
        </Routes>
      </div>
      {!noFooterRoutes.includes(location.pathname) && <Footer />}
      <ToastContainer />
    </div>
  );
};

export default App;
