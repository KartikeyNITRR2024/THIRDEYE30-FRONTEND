const isLive = import.meta.env.VITE_ISLIVE === "1";

const Backend = {
  THIRDEYEBACKEND: {
    URL: isLive
      ? import.meta.env.VITE_THIRDEYEBACKEND_URL
      : import.meta.env.VITE_THIRDEYEBACKEND_URL_LOCAL,
  },
  RETRY: {
    COUNT: Number(import.meta.env.VITE_API_RETRY_COUNT),
    DELAY_MS: Number(import.meta.env.VITE_API_RETRY_DELAY_MS),
    TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT_MS),
    ENABLE_TIMEOUT: import.meta.env.ENABLE_TIMEOUT === "1" || import.meta.env.ENABLE_TIMEOUT === "true",
  },
};

export default Backend;
