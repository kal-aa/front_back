import LogOrSign from "./components/LogOrSign";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./page/SignUpPage";
import HomePage from "./page/HomePage";
import LogInPage from "./page/LogInPage";
import OrdersPage from "./page/OrdersPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogOrSign />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/log-in" element={<LogInPage />} />
        <Route path="/home/:id" element={<HomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
