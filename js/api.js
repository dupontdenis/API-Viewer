// API client with fetch helper
const API = {
  baseUrl: "",

  setBaseUrl(url) {
    this.baseUrl = (url || "").trim();
  },

  getResourceName() {
    // Extract resource name from URL (e.g., "posts" from "/api/posts")
    const match = this.baseUrl.match(/\/([^/]+)\/?$/);
    return match ? match[1] : "items";
  },

  async fetchAPI(endpoint, options = {}) {
    const url = `${this.baseUrl.replace(/\/$/, "")}${endpoint}`;
    const config = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      ...options,
    };

    const response = await fetch(url, config);
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || `Request failed: ${response.status}`
      );
    }

    return data;
  },
};
