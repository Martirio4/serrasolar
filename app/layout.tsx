import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gestor de Servicios Solares",
  description: "Plataforma profesional de gestión de servicios solares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <TopBar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
