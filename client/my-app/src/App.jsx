import LogOrSign from "./components/LogOrSign";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./page/SignUpPage";
import HomePage from "./page/HomePage";
import LogInPage from "./page/LogInPage";
import AddOrdersPage from "./page/AddOrdersPage";
import YourOrdersPage from "./page/YourOrdersPage";
import ManageYourAccPage from "./page/ManageYourAccPage";
import AboutUsPage from "./page/AbouUsPage";
import ContactUsPage from "./page/ContactUsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogOrSign />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/log-in" element={<LogInPage />} />
        <Route path="/home/:id" element={<HomePage />} />
        <Route path="/add-orders/:id" element={<AddOrdersPage />} />
        <Route path="/your-orders/:id" element={<YourOrdersPage />} />
        <Route path="/manage-your-acc/:id" element={<ManageYourAccPage />} />
        <Route path="/About-us/:id" element={<AboutUsPage />} />
        <Route path="/contact-us/:id" element={<ContactUsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
