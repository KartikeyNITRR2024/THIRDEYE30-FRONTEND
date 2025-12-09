import { useState, useEffect, useContext } from "react";
import PropertyContext from "./PropertyContext";
import AuthContext from "../Auth/AuthContext";
import NotificationContext from "../Notification/NotificationContext";
import ApiCaller from "../../properties/Apicaller";

const PropertyProvider = ({ children }) => {
  const { login, userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading } = useContext(NotificationContext);

  const [properties, setProperties] = useState({
    MAXIMUM_NO_OF_THRESOLD_PER_GROUP: 0,
    ALL_ACTIVE_BOTS: [],
    MAXIMUM_NO_OF_THRESOLD_GROUP_PER_USER: 3,
    TIME_GAP_LIST_FOR_THRESOLD_IN_SECONDS: [],
    MAXIMUM_NO_OF_HOLDED_STOCK_PER_USER: 0,
    MAXIMUM_NO_OF_STOCK_PER_GROUP: 0,
    SELECT_ALL_STOCKS: false,
    IS_ZERO_ALLOWED: false
  });

  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  const fetchProperties = async () => {
    if (!userDetails?.token) return;
    // notifyLoading();

    try {
      const { data } = await api.call(`pm/properties/frontend`, {
        method: "GET",
        headers: { token: userDetails.token },
      });
      if (data.success) {
        const res = data.response;
        const bots = res.ALL_ACTIVE_BOTS
          ? res.ALL_ACTIVE_BOTS.replace(/^\[|\]$/g, "")
              .split(",")
              .map((b) => b.trim())
          : [];
        const timeGaps = res.TIME_GAP_LIST_FOR_THRESOLD_IN_SECONDS
          ? res.TIME_GAP_LIST_FOR_THRESOLD_IN_SECONDS.split(",").map((v) => parseInt(v, 10))
          : [];

        setProperties({
          MAXIMUM_NO_OF_THRESOLD_PER_GROUP: res.MAXIMUM_NO_OF_THRESOLD_PER_GROUP,
          ALL_ACTIVE_BOTS: bots,
          MAXIMUM_NO_OF_THRESOLD_GROUP_PER_USER: res.MAXIMUM_NO_OF_THRESOLD_GROUP_PER_USER,
          TIME_GAP_LIST_FOR_THRESOLD_IN_SECONDS: timeGaps,
          MAXIMUM_NO_OF_HOLDED_STOCK_PER_USER: res.MAXIMUM_NO_OF_HOLDED_STOCK_PER_USER,
          MAXIMUM_NO_OF_STOCK_PER_GROUP: res.MAXIMUM_NO_OF_STOCK_PER_GROUP,
          SELECT_ALL_STOCKS: res.SELECT_ALL_STOCKS,
          IS_ZERO_ALLOWED: res.IS_ZERO_ALLOWED
        });
      } else {
        await notifyError(data.errorMessage || "Failed to load properties");
      }
    } catch {
      await notifyError("Network error while fetching properties");
    } finally {
      // closeLoading();
    }
  };

  useEffect(() => {
    if (login) {
      fetchProperties();
    } else {
      setProperties(prev => ({
      ...prev,
      MAXIMUM_NO_OF_THRESOLD_GROUP_PER_USER: 3,
      }));
    }
  }, [login]);

  return (
    <PropertyContext.Provider value={{ properties, loading, fetchProperties }}>
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyProvider;
