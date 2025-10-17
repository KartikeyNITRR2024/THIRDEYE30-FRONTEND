import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./assets/pages/Login";
import SignUp from "./assets/pages/Signup";
import Setting from "./assets/pages/Home/Setting";
import Admin from "./assets/pages/Home/Admin";
import MarketThresold from "./assets/pages/Home/MarketThresold";
import NotFound from "./assets/pages/NotFound";
import NotificationProvider from "./assets/contexts/Notification/NotificationProvider"
import AuthProvider from "./assets/contexts/Auth/AuthProvider" 
import UserProvider from "./assets/contexts/User/UserProvider"
import PropertyProvider from "./assets/contexts/Property/PropertyProvider"
import ThresoldGroupProvider from "./assets/contexts/MarketThresold/ThresoldGroup/ThresoldGroupProvider"
import ThresoldProvider from "./assets/contexts/MarketThresold/Thresold/ThresoldProvider"
import ChatIDProvider from "./assets/contexts/MarketThresold/ChatID/ChatIDProvider"
import StockProvider from "./assets/contexts/Stock/StockProvider";
import MarketThresoldProvider from "./assets/contexts/MarketThresold/MarketThresold/MarketThresoldProvider"
// New 404 page

function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

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
          <PropertyProvider>
            <StockProvider>
              <UserProvider>
                <MarketThresoldProvider>
                  <ThresoldProvider>
                    <ChatIDProvider>
                      <ThresoldGroupProvider>
                      <App />
                      </ThresoldGroupProvider>
                    </ChatIDProvider>
                  </ThresoldProvider>
                </MarketThresoldProvider>
              </UserProvider>
            </StockProvider>
          </PropertyProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
