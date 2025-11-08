# Posts API UI (Read-Only)

A minimal, dependency-free web UI to view posts from a REST API.

Supported endpoints:

- GET `/api/posts` — list all posts
- GET `/api/posts/:id` — get one post by ID

## Features

- View all posts in a table
- Refresh posts list
- Fetch individual post details by ID
- No write operations (read-only interface)

## Run

This is a static site. You can open `index.html` directly or serve it locally.

- Same-origin (recommended): host this UI from the same origin/domain as your API so calls like `/api/posts` just work.
- Cross-origin: set the "API Base URL" at the top of the page (e.g., `http://localhost:3000/api/posts`). Ensure your API allows CORS.

### Options

- Use VS Code's Live Server extension to serve the folder.
- Or use a simple static server. For example, with Node installed:

```bash
npx http-server -p 8080 .
```

Then visit http://localhost:8080.

## File Structure

```
├── index.html        # Main HTML page
├── css/
│   └── styles.css    # Styling
└── js/
    ├── api.js        # API fetch helper
    ├── ui.js         # UI utilities
    ├── posts.js      # Posts operations
    └── app.js        # App initialization
```

## Notes

- The UI is read-only and does not support creating, updating, or deleting posts.
- The UI expects post objects to have at least `id` and `title` fields. Adjust if your schema differs.
