import { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../components/NavbarComponents/Navbar";
import FooterNavbar from "../../components/NavbarComponents/FooterNavbar";
import backgroundimage from "../../images/backgroundimage.png";
import UserContext from "../../contexts/User/UserContext";
import NotificationContext from "../../contexts/Notification/NotificationContext";
import LoadingPage from "../../components/LoadingComponents/LoadingPage";

export default function Setting() {
  const { userInfo, updateUserDetails } = useContext(UserContext);
  const { notifyError } = useContext(NotificationContext);

  const [navProperties] = useState({
    showOriginalNavbar: true,
    showBackButton: false,
    backButtonFunction: {},
    showExtraInfo: false,
    infoToShow: null,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        phoneNumber: userInfo.phoneNumber || "",
      });
    }
  }, [userInfo]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, phoneNumber } = formData;
    if (!firstName || firstName.length < 4) {
      notifyError("First name must be at least 4 characters long.");
      return false;
    }
    if (!lastName || lastName.length < 4) {
      notifyError("Last name must be at least 4 characters long.");
      return false;
    }
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      notifyError("Phone number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await updateUserDetails(formData);
  };

  if (!userInfo) return <LoadingPage />;

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 h-16 z-10">
        <Navbar navProperties={navProperties} />
      </div>

      <div
        className="mt-16 h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem)] overflow-y-auto bg-cover bg-center p-4"
        style={{ backgroundImage: `url(${backgroundimage})` }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="settings-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
                Account Settings
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={userInfo.userName}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => handleChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => handleChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={e => handleChange("phoneNumber", e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-16 md:hidden z-10">
        <FooterNavbar />
      </div>
    </div>
  );
}
