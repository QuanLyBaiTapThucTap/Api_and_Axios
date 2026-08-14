import type { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Sản phẩm</th>
            <th className="p-4 text-left">Danh mục</th>
            <th className="p-4 text-left">Giá</th>
            <th className="p-4 text-left">Kho</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-4">
                <div className="font-semibold">{product.name}</div>

                <div className="text-sm text-slate-500">
                  {product.description}
                </div>
              </td>

              <td className="p-4">{product.category}</td>

              <td className="p-4 font-semibold">
                {product.price.toLocaleString("vi-VN")}đ
              </td>

              <td className="p-4">{product.stock}</td>

              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-lg bg-yellow-100 px-3 py-2 text-yellow-700"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => onDelete(product.id)}
                    className="rounded-lg bg-red-100 px-3 py-2 text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="p-10 text-center text-slate-500">Không có sản phẩm</div>
      )}
    </div>
  );
}
