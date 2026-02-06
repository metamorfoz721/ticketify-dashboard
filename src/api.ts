const API_URL = import.meta.env.VITE_API_URL

const TOKEN_KEY = "ticketify_token";

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? data.error ?? `Request failed with ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function login(email: string, password: string, token?: string) {
  const res = await request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, token }),
  });
  setToken(res.token);
  return res;
}


export async function validateTicket(code: string) {
  return request<{
    valid: boolean;
    ticket?: {
      id: string;
      code: string;
      owner: string;
      eventName: string;
      packet: string | null;
      createdAt: number;
      lastScanned: number | null;
    };
    reason?: string;
  }>("/tickets/validate", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function scanTicket(id: string) {
  return request<{
    ticket: {
      id: string;
      code: string;
      owner: string;
      eventName: string;
      packet: string | null;
      createdAt: number;
      lastScanned: number | null;
    };
  }>(`/tickets/scan/${id}`, {
    method: "POST",
  });
}

export async function getTickets() {
  return request<{
    tickets: {
      id: string;
      code: string;
      owner: string;
      eventName: string;
      packet: string | null;
      createdAt: number;
      lastScanned: number | null;
    }[];
  }>("/tickets");
}

export async function getTicketDetails(id: string) {
  return request<{
    ticket: {
      id: string;
      code: string;
      owner: string;
      eventName: string;
      packet: string | null;
      createdAt: number;
    };
    scanHistory: {
      id: string;
      scannedAt: number;
      readerName: string;
    }[];
  }>(`/tickets/${id}`);
}

export async function getProfile() {
  return request<{
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    stats: {
      totalScans: number;
      recentScans: {
        scannedAt: number;
        owner: string;
        eventName: string;
      }[];
    };
  }>("/me");
}

export async function getUsers() {
  return request<{
    users: {
      id: string;
      email: string;
      name: string;
      role: string;
      createdAt: number;
    }[];
  }>("/auth/users");
}

export async function register(userData: {
  email: string;
  name: string;
  password?: string;
  role?: string;
}) {
  return request<{ message: string; id: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function bulkRegister(users: {
  name: string;
  email: string;
  role?: string;
}[]) {
  return request<{
    created: {
      name: string;
      email: string;
      role: string;
      tempPassword: string;
    }[];
    skipped: {
      name: string;
      email: string;
      reason: string;
    }[];
    failed: {
      name?: string;
      email?: string;
      reason: string;
    }[];
  }>("/auth/bulk-register", {
    method: "POST",
    body: JSON.stringify({ users }),
  });
}

export async function getStats() {
  return request<{
    total: number;
    scanned: number;
  }>("/stats");
}
