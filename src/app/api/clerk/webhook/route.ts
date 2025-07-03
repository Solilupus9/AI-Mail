import { db } from "@/server/db";

export async function POST(req:Request){
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { data } = await req.json();

	const emailAddress = data.email_addresses[0].email_address;
	const firstName = data.first_name;
	const lastName = data.last_name;
	const imageUrl = data.image_url;
	const id=data.id;

	await db.user.create({
		data: {
			id,
			emailAddress,
			firstName,
			lastName,
			imageUrl,
		}
	});

	return new Response('User data saved',{ status: 200});
}
