export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Helper function to extract a specific cookie by name on the client side
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getCookie("admin_session");
  
  const headers = new Headers(options.headers || {});
  
  // Attach token if it exists
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Automatically redirect if not authorized
  if (response.status === 401 || response.status === 403) {
    // Check if we're in a browser environment to redirect
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return response;
}
