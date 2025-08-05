import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // <-- 1. Mengimpor ThemeProvider
import 'leaflet/dist/leaflet.css'; // <-- 2. Menambahkan CSS Leaflet (dari tips sebelumnya)

export const metadata: Metadata = {
  title: "Wajah Mangunsari",
  description: "Menyingkap Pesona, Inovasi, dan Semangat Lestari RW 01 Mangunsari",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* <-- 4. Menambahkan suppressHydrationWarning */}
      <body className={GeistSans.className}> {/* <-- 5. Menerapkan font dengan cara yang benar */}
        <ThemeProvider // <-- 6. MEMBUNGKUS children dengan ThemeProvider (INI YANG PALING PENTING)
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}