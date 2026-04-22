import "./globals.css";

export const metadata = {
  title: "AI Business Communication Assistant",
  description: "Automated customer communication platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}