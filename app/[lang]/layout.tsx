import '@/app/globals.scss';
import type { Metadata } from 'next';
import ReactQueryProvider from '@/providers/ReactQuery';

import { i18n, type Locale } from '@/i18n';

export async function generateStaticParams() {
   return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
   title: ' Shukraraj Hospital',
};

export default async function RootLayout({
   children,
   params: { lang },
}: {
   children: React.ReactNode;
   params: { lang: Locale };
}) {
   return (
      <html lang={lang}>
         <body>
            <ReactQueryProvider>{children}</ReactQueryProvider>
         </body>
      </html>
   );
}
