import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./assets/pages/Login";
import SignUp from "./assets/pages/Signup";
import AlertDemo from "./assets/pages/AlertDemo";
import Setting from "./assets/pages/Home/Setting";
import Admin from "./assets/pages/Home/Admin";
import MarketThresold from "./assets/pages/Home/MarketThresold";
import NotFound from "./assets/pages/NotFound";
import NotificationProvider from "./assets/contexts/Notification/NotificationProvider"
import AuthProvider from "./assets/contexts/Auth/AuthProvider" 
import UserProvider from "./assets/contexts/User/UserProvider"
import ThresoldGroupProvider from "./assets/contexts/MarketThresold/ThresoldGroup/ThresoldGroupProvider"
// New 404 page

function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/alertdemo" element={<AlertDemo />} />

      {/* Home / App Pages */}
      <Route path="/setting" element={<Setting />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/marketthresold" element={<MarketThresold />} />

      {/* Catch-all for unfound routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <UserProvider>
            <ThresoldGroupProvider>
            <App />
            </ThresoldGroupProvider>
          </UserProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
