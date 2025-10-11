const isLive = import.meta.env.VITE_ISLIVE === "1";

const Backend = {
  THIRDEYEBACKEND: {
    URL: isLive
      ? import.meta.env.VITE_THIRDEYEBACKEND_URL
      : import.meta.env.VITE_THIRDEYEBACKEND_URL_LOCAL,
  },
};

export default Backend;
