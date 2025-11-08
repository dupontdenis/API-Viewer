"use strict";

// Main app initialization
(function () {
  // Base URL management
  let baseUrl =
    localStorage.getItem("posts_api_base_url") || window.location.origin;
  UI.els.baseUrl.value = baseUrl;
  API.setBaseUrl(baseUrl);

  UI.els.saveBaseUrl.addEventListener("click", () => {
    baseUrl = (UI.els.baseUrl.value || "").trim();
    localStorage.setItem("posts_api_base_url", baseUrl);
    API.setBaseUrl(baseUrl);
    UI.els.baseUrlStatus.textContent = "Saved.";
    setTimeout(() => (UI.els.baseUrlStatus.textContent = ""), 1200);
  });

  // Load posts on init
  UI.els.refreshPosts.addEventListener("click", () => Posts.loadPosts());
  Posts.loadPosts();

  // Get by ID
  UI.els.getByIdForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = UI.els.getByIdInput.value;
    await Posts.fetchById(id);
  });

  // Table actions (view only)
  UI.els.postsList.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");

    if (action === "view") {
      await Posts.fetchById(id);
    }
  });
})();
