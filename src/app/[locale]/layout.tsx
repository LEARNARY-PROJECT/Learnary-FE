import { notFound } from "next/navigation";
import { getMessages } from 'next-intl/server';
import { routing } from "@/i18n/routing";
<<<<<<< Updated upstream
import NavbarWrapper from "@/components/NavbarWrapper";
import Navbar from "@/components/Navbar";
=======
import { hasLocale } from "next-intl";
import CoreProviders from "@/app/providers"; // 1. Import file provider CHUNG

>>>>>>> Stashed changes
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
   const { locale } = params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
<<<<<<< Updated upstream
    <main className="min-h-screen w-full">
      <NextIntlClientProvider locale={locale}>
        <NavbarWrapper>
          <Navbar />
          {children}
        </NavbarWrapper>
      </NextIntlClientProvider>
    </main>
=======
    <CoreProviders locale={locale} messages={messages}>
      <main className="min-h-screen w-full">
        {children}
      </main>
    </CoreProviders>
>>>>>>> Stashed changes
  );
}