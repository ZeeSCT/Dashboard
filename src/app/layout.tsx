import "@/styles/globals.css";
import Providers from "./providers";
export const metadata = {
  title: "Scientechnic Unified Platform",
  description: "Exact modular frontend structure",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
