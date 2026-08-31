import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileNavProvider } from "@/components/layout/mobile-nav-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ProRido Operations Dashboard | Fleet & Cab Dispatch Platform",
  description:
    "Internal operations platform for ProRido booking staff, vendor managers, and finance teams. Synced with Google Sheets via n8n.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className="font-sans min-h-screen bg-background text-foreground antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MobileNavProvider>
            {children}
          </MobileNavProvider>

          <Toaster
            richColors
            closeButton
            position="top-right"
            theme="system"
            toastOptions={{
              style: { fontSize: "12px" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
