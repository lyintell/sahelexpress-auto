import { Lato } from "next/font/google";
import "./globals.css";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const latoHeading = Lato({
  variable: "--font-heading",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const latoBody = Lato({
  variable: "--font-body",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Sahel Express Auto",
    template: "%s | Sahel Express Auto",
  },
  description:
    "Véhicules importés du Canada pour les clients de Bamako, avec inventaire, vedettes et prise de contact rapide.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${latoHeading.variable} ${latoBody.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="app-shell">
          <div className="public-site-header">
            <SiteHeader />
          </div>
          <main className="flex-1">{children}</main>
          <div className="public-site-footer">
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
