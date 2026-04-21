import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/src/lib/utils";
import SessionProviderWrapper from "@/src/components/shared/SessionProviderWrapper";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body suppressHydrationWarning>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}