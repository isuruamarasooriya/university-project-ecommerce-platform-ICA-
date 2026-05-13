import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes (RESTful endpoints for MongoDB/Spring Boot compatibility) ---

  // Auth Mock
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // For demo/local: admin@vexo.com / user@vexo.com
    if (email === "admin@vexo.com" && password === "admin123") {
      res.json({ user: { id: "1", name: "Admin User", email, role: "ADMIN" }, token: "mock-admin-token" });
    } else if (email === "user@vexo.com" && password === "user123") {
      res.json({ user: { id: "2", name: "John Doe", email, role: "USER" }, token: "mock-user-token" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password } = req.body;
    res.status(201).json({ user: { id: Date.now().toString(), name, email, role: "USER" }, token: "mock-new-user-token" });
  });

  // Product CRUD (Admin)
  app.get("/api/products", (req, res) => {
    res.json([
      { id: 1, name: "Apex Pro Compression", category: "Compression", price: 120, stock: 45 },
      { id: 2, name: "Thermal Shield Jacket", category: "Outerwear", price: 195, stock: 12 },
    ]);
  });

  app.post("/api/products", (req, res) => {
    res.status(201).json({ ...req.body, id: Date.now() });
  });

  app.put("/api/products/:id", (req, res) => {
    res.json({ ...req.body, id: req.params.id });
  });

  app.delete("/api/products/:id", (req, res) => {
    res.sendStatus(204);
  });

  // User Orders
  app.get("/api/user/orders", (req, res) => {
    res.json([
      { id: "ORD-9912", date: "2024-05-01", status: "Delivered", total: 245.00 },
      { id: "ORD-9988", date: "2024-05-08", status: "In Transit", total: 110.00 },
    ]);
  });

  // --- End API Routes ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
