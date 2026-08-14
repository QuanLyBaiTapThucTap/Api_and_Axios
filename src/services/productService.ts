import api from "../api/axios";
import type { Product, ProductFormData } from "../types/product";
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export const productService = {
  getProduct: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>("/products");
    return response.data.data;
  },
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },
  createProduct: async (data: ProductFormData): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>("/products", data);
    return response.data.data;
  },
  updateProduct: async (
    id: number,
    data: ProductFormData,
  ): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(
      `/products/${id}`,
      data,
    );
    return response.data.data;
  },
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
