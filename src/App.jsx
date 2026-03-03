import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./assets/pages/Login";
import SignUp from "./assets/pages/Signup";
import Verify from "./assets/pages/Verify";
import ForgetPassword from "./assets/pages/ForgetPassword";
import Setting from "./assets/pages/Home/Setting";
import Admin from "./assets/pages/Home/Admin";
import MarketThresold from "./assets/pages/Home/MarketThresold";
import VideoCreater from "./assets/pages/Home/VideoCreater";
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
import AdminPageProvider from "./assets/contexts/Admin/Page/PageProvider";
import VideoPageProvider from "./assets/contexts/VideoCreater/Page/PageProvider";
import ConfigurationProvider from "./assets/contexts/Admin/Configuration/ConfigurationProvider";
import MicroservicesProvider from "./assets/contexts/Admin/Microservices/MicroservicesProvider";
import UsersProvider from "./assets/contexts/Admin/Users/UsersProvider";
import StocksProvider from "./assets/contexts/Admin/Stocks/StocksProvider";
import GeneratorsProvider from "./assets/contexts/VideoCreater/Generators/GeneratorsProvider";
import AudioGeneraterProvider from "./assets/contexts/VideoCreater/AudioGenerators/AudioGeneratorProvider";
import VideoProvider from "./assets/contexts/VideoCreater/Videos/VideoProvider";
import CurrentVideoProvider from "./assets/contexts/VideoCreater/CurrentVideo/CurrentVideoProvider";
import VideoDetailsProvider from "./assets/contexts/VideoCreater/VideoDetails/VideoDetailsProvider";
import NewsProvider from "./assets/contexts/VideoCreater/News/NewsProvider";
import VideoStockProvider from "./assets/contexts/VideoCreater/Stock/StockProvider";
import MultiMediaProvider from "./assets/contexts/VideoCreater/MultiMedia/MultiMediaProvider";
import VideoSettingProvider from "./assets/contexts/VideoCreater/VideoSetting/VideoSettingProvider";
import IntroVideoProvider from "./assets/contexts/VideoCreater/IntroVideo/IntroVideoProvider";
import OutroVideoProvider from "./assets/contexts/VideoCreater/OutroVideo/OutroVideoProvider";
import ContentVideoProvider from "./assets/contexts/VideoCreater/ContentVideo/ContentVideoProvider";
import HeaderProvider from "./assets/contexts/VideoCreater/Header/HeaderProvider";
import StockRaceProvider from "./assets/contexts/VideoCreater/StockRace/StockRaceProvider";
import NewsImageProvider from "./assets/contexts/VideoCreater/NewsImage/NewsImageProvider";
import NewsTextSoundProvider from "./assets/contexts/VideoCreater/NewsTextSound/NewsTextSoundProvider"; 

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
      <Route path="/videocreater" element={<VideoCreater />} />

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
          <AdminPageProvider>
            <VideoPageProvider>
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
                                    <MultiMediaProvider>
                                      <GeneratorsProvider>
                                        <AudioGeneraterProvider>
                                          <VideoStockProvider>
                                            <VideoProvider>
                                              <CurrentVideoProvider>
                                                <VideoDetailsProvider>
                                                  <NewsProvider>
                                                    <VideoSettingProvider>
                                                      <IntroVideoProvider>
                                                        <OutroVideoProvider>
                                                          <ContentVideoProvider>
                                                            <HeaderProvider>
                                                              <StockRaceProvider>
                                                                <NewsImageProvider>
                                                                  <NewsTextSoundProvider>
                                                                    <App />
                                                                  </NewsTextSoundProvider>
                                                                </NewsImageProvider>
                                                              </StockRaceProvider>
                                                            </HeaderProvider>
                                                          </ContentVideoProvider>
                                                        </OutroVideoProvider>
                                                      </IntroVideoProvider>
                                                    </VideoSettingProvider>
                                                  </NewsProvider>
                                                </VideoDetailsProvider>
                                              </CurrentVideoProvider>
                                            </VideoProvider>
                                          </VideoStockProvider>
                                        </AudioGeneraterProvider>
                                      </GeneratorsProvider>
                                    </MultiMediaProvider>
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
            </VideoPageProvider>
          </AdminPageProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
