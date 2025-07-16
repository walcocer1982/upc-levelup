import { Providers } from "@/views/components/shared/providers";
import { Toaster } from "@/components/ui/sonner";
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