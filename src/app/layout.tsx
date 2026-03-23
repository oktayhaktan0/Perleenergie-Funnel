import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleTagManager, { GTM_ID } from "@/components/GoogleTagManager";
import CookieConsent from "@/components/CookieConsent";
import MobileCallButton from "@/components/MobileCallButton";
import NextTopLoader from "nextjs-toploader";
import ClientErrorHandler from "@/components/ClientErrorHandler";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  metadataBase: new URL('https://perleenergie.de'),
  title: {
    default: "Perle Energie | 100% digital. Keine versteckten Kosten.",
    template: "%s | Perle Energie"
  },
  description: "Klarer Stromtarif mit transparenten Preisen. 100% digital und flexibel kündbar. Jetzt Tarif berechnen.",
  keywords: ["Ökostrom", "Stromtarif", "Energie", "Hamburg", "Perle Energie", "Nachhaltigkeit"],
  authors: [{ name: "Perle Energie" }],
  creator: "Perle Energie",
  publisher: "Perle Energie",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "VR9trguWy1U7cf0vW1iMK2cyQoU6XDXkGcxxps5SCWE",
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://perleenergie.de',
    siteName: 'Perle Energie',
    title: 'Perle Energie | 100% digital. Keine versteckten Kosten.',
    description: 'Klarer Stromtarif mit transparenten Preisen. 100% digital und flexibel kündbar.',
    images: [
      {
        url: '/assets/p-mark-yellow.png', // Logo veya ana görsel
        width: 1200,
        height: 630,
        alt: 'Perle Energie Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perle Energie | 100% digital. Keine versteckten Kosten.',
    description: 'Klarer Stromtarif mit transparenten Preisen. 100% digital und flexibel kündbar.',
    images: ['/assets/p-mark-yellow.png'],
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased text-foreground bg-background flex flex-col min-h-[100dvh] tracking-[-0.04em]`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ClientErrorHandler />
        <NextTopLoader color="#e8ac15" />
        <GoogleTagManager />
        <GoogleAnalytics />
        <Header />
        <main className="flex-grow ">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <MobileCallButton />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
