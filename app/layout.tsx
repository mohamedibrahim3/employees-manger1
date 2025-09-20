import "./globals.css";
import localFont from "next/font/local";
import NextAuthProvider from "@/components/providers/session-provider";
import { APP_NAME_FULL as APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/lib/constants";
import { Toaster } from "sonner";

const rubik = localFont({
  src: [
    {
      path: "./../public/fonts/Rubik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../public/fonts/Rubik-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${rubik.className} antialiased`}>
        <NextAuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "bg-white text-gray-900 shadow-lg",
              style: {
                fontSize: "16px",
                padding: "12px 16px",
              },
            }}
          />
        </NextAuthProvider>
      </body>
    </html>
  );
}
