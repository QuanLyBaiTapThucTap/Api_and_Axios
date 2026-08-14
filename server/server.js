const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { decode } = require("punycode");
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "product-management-secret";
const DB_PATH = path.join(__dirname, "db.json");
app.use(cors());
app.use(express.json());
function readDB() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
//login api
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(
    (user) => user.username === username && user.password === password,
  );
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Username hoac Password khong dung" });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.json({
    success: true,
    message: "Dang nhap thanh cong",
    data: {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    },
  });
});
// AUTHENTICATION MIDDLEWARE

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Khong tim thay token",
    });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token khong hop le",
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token het han hoac khong hop le",
    });
  }
}
// get products
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    message: "Lay danh sach san pham thanh cong",
    data: db.products,
  });
});
// GET PRODUCT DETAIL
app.get("/api/products/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const product = db.products.find((product) => product.id === id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "khong tim thay san pham",
    });
  }
  res.json({
    success: true,
    message: "Lay san pham thanh cong",
    data: product,
  });
});
// POST PRODUCT
app.post("/api/products", authenticateToken, (req, res) => {
  const db = readDB();
  const { name, price, category, stock, description } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      message: "Vui long nhap day du thong tin",
    });
  }
  const newProduct = {
    id:
      db.products.length > 0
        ? Math.max(...db.products.map((p) => p.id)) + 1
        : 1,
    name,
    price: Number(price),
    category,
    stock: Number(stock),
    description,
  };
  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json({
    success: true,
    message: "Them san pham thanh cong",
    data: newProduct,
  });
});
// PUT PRODUCT
app.put("/api/products/:id", authenticateToken, (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const index = db.products.findIndex((product) => product.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "khong tim thay san pham",
    });
  }
  const updateProduct = {
    ...db.products[index],
    ...req.body,
    id,
  };
  db.products[index] = updateProduct;
  writeDB(db);
  res.json({
    success: true,
    message: "Cap nhat san pham thanh cong",
    data: updateProduct,
  });
});
// DELETE PRODUCT
app.delete("/api/products/:id", authenticateToken, (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const index = db.products.findIndex((product) => product.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "khong tim thay san pham",
    });
  }
  db.products.splice(index, 1);
  writeDB(db);
  res.json({
    success: true,
    message: "Xoa san pham thanh cong",
  });
});
// CHẠY SERVER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API khong ton tai",
  });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
