const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type User = {
  id: string;
  name: string;
  email: string;
};
type LoginResponse = {
  token: string;
  user: User;
};

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data.message || 
    (data.errors && data.errors[0]?.msg) || "API Error";
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (data: unknown) =>
    apiRequest("/auth/register", "POST", data),

  login: (data: unknown) =>
     apiRequest<LoginResponse>("/auth/login", "POST", data),

  getDashboard: () =>
    apiRequest("/dashboard"),

  getTransactions: (query: string = "") =>
    apiRequest(`/transactions${query}`),

  createTransaction: (data: unknown) =>
    apiRequest("/transactions", "POST", data),

  deleteTransaction: (id: string) =>
    apiRequest(`/transactions/${id}`, "DELETE"),
};