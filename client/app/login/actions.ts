"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") || formData.get("_1_email") || formData.get("0_email") || formData.get("username") || "") as string;
  const password = (formData.get("password") || formData.get("_1_password") || formData.get("0_password") || "") as string;

  let redirectUrl = "";

  try {
    const res = await fetch("http://127.0.0.1:4000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (res.ok && data.success) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", data.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      
      const role = data.user?.role || "user";
      
      // Determine redirect based on role
      if (role === "admin" || role === "owner") {
        redirectUrl = "/admin";
      } else {
        redirectUrl = "/admin"; // Default fallback
      }
    } else {
      return { error: data.message || "Invalid email or password" };
    }
  } catch (e) {
    console.error("Backend login check failed", e);
    return { error: "Authentication server is unreachable." };
  }

  // Execute redirect outside try/catch so Next.js NEXT_REDIRECT is not caught
  if (redirectUrl) {
    redirect(redirectUrl);
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login");
}
