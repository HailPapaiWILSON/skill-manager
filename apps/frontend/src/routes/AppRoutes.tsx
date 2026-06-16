import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "../App";
import TeamRoom from "../pages/TeamRoom";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/team/:teamId" element={<TeamRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
