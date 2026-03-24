const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Something went wrong");

  return data;
};

export const developerRegister = (email, password) =>
  api("/developer/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const developerLogin = (email, password) =>
  api("/developer/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const developerLogout = () =>
  api("/developer/logout", { method: "POST" });

export const developerMe = () => api("/developer/me");

export const createApp = (name, redirectUrl) =>
  api("/app/create", {
    method: "POST",
    body: JSON.stringify({ name, redirectUrl }),
  });

export const listApps = () => api("/app/list");

export const updateProviders = (id, data) =>
  api(`/app/${id}/providers`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });