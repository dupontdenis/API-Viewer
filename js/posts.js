// Posts operations
const Posts = {
  async loadPosts() {
    UI.setBusy(UI.els.refreshPosts, true);
    UI.setStatus(UI.els.postsCount, "Loading...");
    try {
      const response = await API.fetchAPI("");

      // Auto-detect resource name from API base URL
      const resourceName = API.getResourceName();

      // Handle different response structures
      let items = [];
      let count = 0;

      if (Array.isArray(response)) {
        // Direct array: [...]
        items = response;
        count = items.length;
      } else if (response && typeof response === "object") {
        // Object response: try common property names
        items =
          response[resourceName] ||
          response.data ||
          response.items ||
          response.results ||
          [];
        count =
          response.count ?? response.length ?? response.total ?? items.length;
      }

      this.renderPosts(items);
      UI.setStatus(UI.els.postsCount, `${count} ${resourceName}`);
    } catch (e) {
      this.renderPosts([]);
      let msg = `Error: ${e.message}`;
      if (msg.includes("Failed to fetch")) {
        msg +=
          '<br><span style="color:#c00">Change the API base URL to <br><b>https://corsproxy.io/?https://ghibliapi.dev/people</b></span>';
      }
      UI.els.postsCount.innerHTML = msg;
    } finally {
      UI.setBusy(UI.els.refreshPosts, false);
    }
  },

  renderPosts(list) {
    if (!Array.isArray(list) || list.length === 0) {
      UI.els.postsList.innerHTML =
        '<div class="muted" style="padding:0.75rem">No items to display.</div>';
      return;
    }

    // Extract keys from first item to build dynamic headers
    const keys = Object.keys(list[0]);

    // Find the ID field (could be 'id', '_id', 'ID', etc.)
    const idKey =
      keys.find((k) => k.toLowerCase() === "id" || k === "_id") || keys[0];

    // Generate table headers dynamically
    const headers = keys
      .map((key) => `<th>${UI.escapeHtml(key)}</th>`)
      .join("");

    // Generate table rows dynamically
    const rows = list
      .map((item) => {
        const itemId = item[idKey] || "";
        const cells = keys
          .map((key) => {
            const value = item[key];
            // Format value based on type
            let displayValue;
            if (typeof value === "object" && value !== null) {
              displayValue = JSON.stringify(value);
            } else {
              displayValue = value ?? "";
            }
            return `<td>${UI.escapeHtml(displayValue)}</td>`;
          })
          .join("");

        return `
      <tr>
        ${cells}
        <td class="actions">
          <button data-action="view" data-id="${UI.escapeAttr(
            itemId
          )}" class="secondary">View</button>
        </td>
      </tr>
    `;
      })
      .join("");

    UI.els.postsList.innerHTML = `
      <table>
        <thead>
          <tr>
            ${headers}
            <th style="width:180px">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  },

  async fetchById(id) {
    if (!id) return;
    UI.setStatus(UI.els.getByIdResult, "Loading...");
    try {
      const post = await API.fetchAPI(`/${id}`);
      UI.els.getByIdResult.textContent = UI.pretty(post);
    } catch (e) {
      UI.els.getByIdResult.textContent = `Error: ${e.message}`;
    }
  },
};
