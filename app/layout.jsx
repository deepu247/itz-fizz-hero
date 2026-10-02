import "./globals.css";

export const metadata = {
  title: "Welcome ITZ FIZZ",
  description: "A premium scroll-driven hero section built with Next.js, GSAP and ScrollTrigger.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05060a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
