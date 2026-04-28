import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dégrèvement eau – Loi Warsmann",
  description:
    "Vérifiez votre éligibilité au dégrèvement de facture d'eau en cas de fuite sur canalisation enterrée (loi Warsmann) et générez votre courrier de demande.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
