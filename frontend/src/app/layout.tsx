import type { Metadata } from "next";
import { Fustat } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OSIS SMAN 2 Babelan",
  description: "Website resmi Organisasi Siswa Intra Sekolah (OSIS) SMAN 2 Babelan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fustat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
