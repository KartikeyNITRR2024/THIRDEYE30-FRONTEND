import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./assets/pages/Login";
import SignUp from "./assets/pages/Signup";
import Verify from "./assets/pages/Verify";
import ForgetPassword from "./assets/pages/ForgetPassword";
import Setting from "./assets/pages/Home/Setting";
import Admin from "./assets/pages/Home/Admin";
import MarketThresold from "./assets/pages/Home/MarketThresold";
import NotFound from "./assets/pages/NotFound";
import NotificationProvider from "./assets/contexts/Notification/NotificationProvider";
import AuthProvider from "./assets/contexts/Auth/AuthProvider";
import UserProvider from "./assets/contexts/User/UserProvider";
import PropertyProvider from "./assets/contexts/Property/PropertyProvider";
import ThresoldGroupProvider from "./assets/contexts/MarketThresold/ThresoldGroup/ThresoldGroupProvider";
import ThresoldProvider from "./assets/contexts/MarketThresold/Thresold/ThresoldProvider";
import ChatIDProvider from "./assets/contexts/MarketThresold/ChatID/ChatIDProvider";
import StockProvider from "./assets/contexts/Stock/StockProvider";
import MarketThresoldProvider from "./assets/contexts/MarketThresold/MarketThresold/MarketThresoldProvider";
import PageProvider from "./assets/contexts/Admin/Page/PageProvider";
import ConfigurationProvider from "./assets/contexts/Admin/Configuration/ConfigurationProvider";
import MicroservicesProvider from "./assets/contexts/Admin/Microservices/MicroservicesProvider";
import UsersProvider from "./assets/contexts/Admin/Users/UsersProvider";
import StocksProvider from "./assets/contexts/Admin/Stocks/StocksProvider";


function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      

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
          <PageProvider>
            <PropertyProvider>
              <StockProvider>
                <UserProvider>
                  <MarketThresoldProvider>
                    <ThresoldProvider>
                      <ChatIDProvider>
                        <ThresoldGroupProvider>
                          <ConfigurationProvider>
                            <MicroservicesProvider>
                              <UsersProvider>
                                <StocksProvider>
                                  <App />
                                </StocksProvider>
                              </UsersProvider>
                            </MicroservicesProvider>
                          </ConfigurationProvider>
                        </ThresoldGroupProvider>
                      </ChatIDProvider>
                    </ThresoldProvider>
                  </MarketThresoldProvider>
                </UserProvider>
              </StockProvider>
            </PropertyProvider>
          </PageProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
