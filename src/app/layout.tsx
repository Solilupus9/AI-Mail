import "@/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
	title: "AI Mail",
	description: "Send emails with AI",
};

const inter = Inter({
	subsets: ["latin"],
	weight:['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<ClerkProvider>
			<html lang="en" className={`${inter.className}`}>
				<body>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
