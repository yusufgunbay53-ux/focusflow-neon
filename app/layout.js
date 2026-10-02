import "./globals.css";

export const metadata = {
  title: "FocusFlow",
  description: "AI destekli gorev ve odaklanma asistani",
  manifest: "/manifest.json",
  themeColor: "#0b111e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-slate-100 antialiased">{children}</body>
    </html>
  );
}
