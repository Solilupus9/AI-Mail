import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";

export async function GET(req: NextRequest) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const params = req.nextUrl.searchParams;
	const status = params.get("status");
	if (status !== "success")
		return NextResponse.json(
			{ message: "Failed to link account" },
			{ status: 400 },
		);

	const code = params.get("code");
	if (!code)
		return NextResponse.json(
			{ message: "Code not provided" },
			{ status: 400 },
		);

	const token = await exchangeCodeForToken(code);
	if (!token)
		return NextResponse.json(
			{ message: "Failed to exchange code for token" },
			{ status: 400 },
		);

	const accountDetails = await getAccountDetails(token.accessToken);
	if (!accountDetails)
		return NextResponse.json(
			{ message: "Failed to get account details" },
			{ status: 400 },
		);

	await db.account.upsert({
		where: {
			id: token.accountId.toString(),
		},
		update: {
			accessToken: token.accessToken,
		},
		create: {
			id: token.accountId.toString(),
			userId,
			emailAddress: accountDetails.email,
			name: accountDetails.name,
			accessToken: token.accessToken,
		},
	});

	return NextResponse.redirect(new URL("/mail", req.url));
}
