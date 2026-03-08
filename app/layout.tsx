import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n";
import RootShell from "@/components/root-shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Largify BizDist — Distribution Management System",
  description: "Manage products, warehouses, orders, retailers & payments in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoUrdu.variable} font-sans antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <RootShell>{children}</RootShell>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
