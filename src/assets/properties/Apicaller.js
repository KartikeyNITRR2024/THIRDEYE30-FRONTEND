import Backend from "./Backend";

export default class ApiCaller {
  async call(endpoint, options = {}) {
    const retries = Backend.RETRY.COUNT;
    const delay = Backend.RETRY.DELAY_MS;
    const timeout = Backend.RETRY.TIMEOUT_MS;
    const enableTimeout = Backend.RETRY.ENABLE_TIMEOUT;

    for (let i = 0; i < retries; i++) {
      let controller, timeoutId;

      if (enableTimeout) {
        controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), timeout);
      }

      try {
        const response = await fetch(`${Backend.THIRDEYEBACKEND.URL}${endpoint}`, {
          ...options,
          ...(controller ? { signal: controller.signal } : {}),
        });

        if (enableTimeout) clearTimeout(timeoutId);

        const data = await response.json().catch(() => ({}));

        if (response.status >= 500 && i < retries - 1) {
          await this.sleep(delay);
          continue;
        }

        return { response, data };
      } catch (err) {
        if (enableTimeout) clearTimeout(timeoutId);

        const isAbort = err.name === "AbortError";
        const isLastTry = i === retries - 1;

        if (isAbort && enableTimeout) {
          if (isLastTry) throw new Error("Request timed out");
          await this.sleep(delay);
          continue;
        }

        if (isLastTry) throw new Error("Network error");
        await this.sleep(delay);
      }
    }
  }

  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
}


// This ApiCaller class provides a centralized way to make API requests with retry and optional timeout logic.
// It reads configuration from Backend.js, including retry count, delay, timeout, and whether to enable timeout.
// Supports automatic retries on server errors and handles network errors or request timeouts gracefully.
