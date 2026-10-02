import { Geist, Geist_Mono } from 'next/font/google';

export const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

/** Class list that defines the font CSS variables on the root <html>. */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`;
