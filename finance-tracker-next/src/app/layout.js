import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Finance Tracker",
  description: "A simple finance tracker application",
  icons: {
    icon: "/logo-oikono.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
