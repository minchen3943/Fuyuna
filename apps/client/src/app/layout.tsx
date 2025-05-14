import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { ViewTransitions } from 'next-view-transitions';
import { metadataConfig } from '@fuyuna/configs';
import Script from 'next/script';
import pkg from '../../package.json';

const APP_VERSION = pkg.version.replace(/^[~^<>=]+/, '');
const NEXT_VERSION = pkg.dependencies.next.replace(/^[~^<>=]+/, '');
const NEST_VERSION = '11.0.6';

const Font = localFont({
  src: '../../public/font.woff2',
});

const { title, description, keywords } = metadataConfig.getMetadataConfig();

export const metadata: Metadata = {
  title,
  description,
  keywords,
  applicationName: 'Fuyuna',
  publisher: 'Fuyuna',
  authors: [
    { name: '沫鸯', url: 'https://mochenwu.com' },
    { name: '瞑尘', url: 'https://mochenwu.com' },
  ],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="zh-CN">
        <head>
          <Script id="info" strategy="afterInteractive">
            {`
              (function() {
                console.groupCollapsed(
                  "%c Fuyuna %c v${APP_VERSION}",
                  "color:#FFFFFF; padding:5px 0; background:#F9C0E4;",
                  "padding:5px 5px 5px 0; background:#F0F0F0;"
                );
                console.log("✍️ Author: https://mochenwu.com");
                console.log("💻 Github: https://github.com/minchen3943/Fuyuna");
                console.log("📦 Next.js: v${NEXT_VERSION} https://nextjs.org/");
                console.log("📦 Nest.js: v${NEST_VERSION} https://nestjs.com/");
                console.log("⚖️ License: AGPL-3.0");
                console.groupEnd();

                if (document.prepend) {
                  document.prepend(
                    document.createComment(
                      \`Powered By Nextjs v${NEXT_VERSION}, NestJS v${NEST_VERSION}\`
                    )
                  );
                }
              })();
            `}
          </Script>
        </head>
        <body className={Font.className}>
          <div id="root">
            <header></header>
            <main>{children}</main>
            <footer></footer>
          </div>
        </body>
      </html>
    </ViewTransitions>
  );
}
