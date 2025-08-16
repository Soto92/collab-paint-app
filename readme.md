# Collab Paint App

A real-time collaborative paint application built with **HTML, CSS, JavaScript, Node.js, and Socket.IO**. Multiple users can draw simultaneously, choose tools like pencil, eraser, and geometric shapes, and use undo/clear functionality.

---

## Features

- Real-time multi-user drawing
- Pencil and eraser
- Geometric shapes: rectangle, circle, triangle
- Color selection (preset colors + custom color picker)
- Undo last stroke
- Clear canvas

---

## Project Structure

```
collab-paint-app/
│
├─ public/
│ ├─ index.html
│ ├─ script.js
│ ├─ styles.css
│ └─ favicon.png (optional)
│
├─ server.js
└─ package.json

- `public/` - contains frontend files.
- `server.js` - Node.js server using Express and Socket.IO.
- `package.json` - project dependencies and scripts.
```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Soto92/collab-paint-app.git
cd collab-paint-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the server locally:

```bash
npm start
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

---

## Usage

- Select a tool from the toolbar: Pencil, Eraser, Rectangle, Circle, Triangle.
- Pick a color using preset colors or the color picker.
- Draw on the canvas with your mouse.
- Use **Undo** to remove the last stroke.
- Use **Clear** to clear the entire canvas.
- Open multiple browser tabs or share the URL for real-time collaboration.

---

## Deployment on Render

1. Create a free account on [Render](https://render.com/).
2. Click **New → Web Service** and connect your GitHub repository.
3. Set environment as **Node**.
4. Use these commands:

   - Build Command: `npm install`
   - Start Command: `npm start`

5. Render will provide a live URL for your app.

---

## Dependencies

- [Express](https://www.npmjs.com/package/express)
- [Socket.IO](https://www.npmjs.com/package/socket.io)

---

## License

MIT License
