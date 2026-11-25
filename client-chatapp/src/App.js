import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from "./components/pages/LoginForm";
import RegisterForm from "./components/pages/RegisterForm";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
