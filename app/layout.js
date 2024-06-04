import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lunar's Color Plotter",
  description: "Color plotter developed by Lunar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Lunar's Color Plotter" />
        <meta property="og:description" content="Color plotter developed by Lunar" />
        <meta property="og:image" content="https://cdn.britannica.com/70/191970-131-A85628DA/Color-wheel-light-color-spectrum.jpg" />
        <title>Your App Title</title>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
