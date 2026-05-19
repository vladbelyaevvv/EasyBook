import api from './client.js'

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
};
