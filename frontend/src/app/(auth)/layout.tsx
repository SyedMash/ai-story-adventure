import Image from "next/image";
import { Providers } from "~/components/Providers";
import "~/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="flex h-screen flex-col lg:flex-row">
            <div className="relative hidden flex-1 lg:block">
              <Image
                src={"/images/auth-image.webp"}
                alt="auth-image"
                aria-label="auth-image"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <p className="absolute bottom-5 left-5 text-3xl font-semibold uppercase">
                ai story adventure
              </p>
              <p className="absolute top-5 right-5 flex items-center gap-2">
                <span>📌</span>
                <span>Los Angeles</span>
              </p>
            </div>
            <div className="flex flex-1 items-center justify-center">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
