import React, { useState, useEffect, useContext } from "react";
import PropertyContext from "./PropertyContext";
import AuthContext from "../Auth/AuthContext";
import NotificationContext from "../Notification/NotificationContext";
import Backend from "../../properties/Backend";

const PropertyProvider = ({ children }) => {
  const { login, userDetails } = useContext(AuthContext);
  const { notifySuccess, notifyError } = useContext(NotificationContext);

  const [properties, setProperties] = useState({
    MAXIMUM_NO_OF_THRESOLD_PER_GROUP: 0,
    ALL_ACTIVE_BOTS: [],
    MAXIMUM_NO_OF_THRESOLD_GROUP_PER_USER: 0,
    TIME_GAP_LIST_FOR_THRESOLD_IN_SECONDS: [],
    MAXIMUM_NO_OF_HOLDED_STOCK_PER_USER: 0,
  });

  const [loading, setLoading] = useState(false);

  // ---------------- FETCH WITH RETRY ----------------
  const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        const data = await res.json();
        if (res.status >= 500) {
          if (i === retries - 1) return data;
          await new Promise((r) => setTimeout(r, delay));
        } else {
          return data;
        }
      } catch (err) {
        if (i === retries - 1) return { success: false, errorMessage: err.message, response: null };
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  };

  // ---------------- FETCH PROPERTIES ----------------
  const fetchProperties = async () => {
    if (!userDetails?.token) return;
    setLoading(true);

    try {
      const data = await fetchWithRetry(`${Backend.THIRDEYEBACKEND.URL}pm/properties/frontend`, {
        method: "GET",
        headers: { token: userDetails.token },
      });

      if (data.success) {
        const res = data.response;

        const bots = res.ALL_ACTIVE_BOTS
          ? res.ALL_ACTIVE_BOTS.replace(/^\[|\]$/g, "").split(",").map((b) => b.trim())
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
        });
      } else {
        notifyError(data.errorMessage || "Failed to load properties");
      }
    } catch (err) {
      notifyError("Network error while fetching properties");
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties on mount or when token changes
  useEffect(() => {
    if (login) fetchProperties();
  }, [login]);

  return (
    <PropertyContext.Provider value={{ properties, loading, fetchProperties }}>
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyProvider;