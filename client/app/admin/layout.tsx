import { cookies } from "next/headers";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("admin_session");

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar */}
      {isLoggedIn && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${isLoggedIn ? "lg:pl-60" : ""} min-w-0 transition-all duration-300`}>
        {isLoggedIn && <Topbar />}
        <main className={`flex-1 ${isLoggedIn ? "p-4 md:p-6" : ""} overflow-y-auto max-w-[1600px] w-full mx-auto`}>
          {children}
        </main>
      </div>
    </div>
  );
}
