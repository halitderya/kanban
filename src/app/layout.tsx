"use client";
import { store } from "./store";
import { Provider } from "react-redux";
import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-roboto-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable}`}
    >
      <body className=" ">
        <Provider store={store}>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
