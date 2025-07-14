import { Providers } from "@/views/components/shared/providers";
import { Toaster } from "@/components/ui/use-toast";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}