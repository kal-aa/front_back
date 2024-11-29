import LogOrSign from "./components/LogOrSign";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./page/SignUpPage";
import HomePage from "./page/HomePage";
import LogInPage from "./page/LogInPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogOrSign />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/log-in" element={<LogInPage />} />
        <Route path="/home/:full-name" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
