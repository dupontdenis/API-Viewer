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
      UI.setStatus(UI.els.postsCount, `Error: ${e.message}`);
    } finally {
      UI.setBusy(UI.els.refreshPosts, false);
    }
  },

  renderPosts(list) {
    if (!Array.isArray(list) || list.length === 0) {
      UI.els.postsList.innerHTML =
        '<div class="muted" style="padding:0.75rem">No posts.</div>';
      return;
    }

    const rows = list
      .map((p) => {
        const postId = p.id || p._id || p.ID || "";
        return `
      <tr>
        <td><span class="badge">${UI.escapeHtml(postId)}</span></td>
        <td>${UI.escapeHtml(p.title || "")}</td>
        <td class="actions">
          <button data-action="view" data-id="${UI.escapeAttr(
            postId
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
            <th style="width:72px">ID</th>
            <th style="width:50%">Title</th>
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
