import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

import { productService } from "../services/productService";

import type { Product, ProductFormData } from "../types/product";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await productService.getProduct();

      setProducts(data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const handleCreate = async (data: ProductFormData) => {
    await productService.createProduct(data);

    setShowForm(false);

    await loadProducts();
  };

  const handleUpdate = async (data: ProductFormData) => {
    if (!editingProduct) return;

    await productService.updateProduct(editingProduct.id, data);

    setEditingProduct(null);

    await loadProducts();
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");

    if (!confirmed) return;

    try {
      await productService.deleteProduct(id);

      await loadProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">Product Management</h1>

            <p className="text-sm text-slate-500">Quản lý sản phẩm điện tử</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user.name}</p>

              <p className="text-sm text-slate-500">{user.username}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Products</h2>

            <p className="text-slate-500">{products.length} sản phẩm</p>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Thêm sản phẩm
          </button>
        </div>

        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full rounded-xl border bg-white p-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center">
            Đang tải sản phẩm...
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <ProductTable
            products={filteredProducts}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowForm(false);
            }}
            onDelete={handleDelete}
          />
        )}

        {showForm && (
          <ProductForm
            product={null}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </main>
    </div>
  );
}
