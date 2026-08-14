export interface User {
  id: number;
  username: string;
  name: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}
