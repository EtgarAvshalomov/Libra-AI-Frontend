import type { Metadata } from "next";
import { Inter, Assistant } from 'next/font/google';
import "../../styles/globals.css";
import "../../styles/style.css";
import "../../styles/base.css";

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const assistant = Assistant({
  variable: '--font-assistant',
  subsets: ['hebrew'],
});

export const metadata: Metadata = {
  title: "Libra",
  description: "A free to use LLM platform",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${assistant.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, interactive-widget=resizes-content"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
