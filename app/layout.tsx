import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster"
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mentor Connect",
  description: "Video Calling App",
  icons:{
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider 
        appearance={{
          layout:{
            logoImageUrl: '/icons/menco.svg',
            socialButtonsVariant: 'iconButton'
          },
          variables:{
            colorText: '',
            colorPrimary: '',
            colorBackground: '',
            colorInputBackground: '',
            colorInputText: ''
          }
          }}
      >
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cus-1`}>
          {children}
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
