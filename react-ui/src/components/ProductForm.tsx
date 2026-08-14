import { useEffect, useState } from "react";
import type {
  Product,
  ProductFormData,
} from "../types/product";

interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

const initialForm: ProductFormData = {
  name: "",
  price: 0,
  category: "Phone",
  stock: 0,
  description: "",
};

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] =
    useState<ProductFormData>(initialForm);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        description: product.description,
      });
    } else {
      setForm(initialForm);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="mb-5 text-2xl font-bold">
          {product
            ? "Cập nhật sản phẩm"
            : "Thêm sản phẩm"}
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Giá"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            <option value="Phone">Phone</option>
            <option value="Laptop">Laptop</option>
            <option value="Tablet">Tablet</option>
            <option value="Accessory">
              Accessory
            </option>
          </select>

          <input
            name="stock"
            type="number"
            placeholder="Số lượng"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Mô tả"
            value={form.description}
            onChange={handleChange}
            className="h-24 w-full rounded-lg border p-3"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-5 py-2"
          >
            Hủy
          </button>

          <button
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}