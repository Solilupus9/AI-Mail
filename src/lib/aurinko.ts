"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function getAurinkoAuthUrl(serviceType:'Google'|'Office365'){
	const {userId}=await auth();
	if(!userId) throw new Error('Unauthorized');

	const params=new URLSearchParams({
		clientId:process.env.AURINKO_CLIENT_ID!,
		serviceType,
		scope:'Mail.ReadWrite Mail.Send Mail.Read Main.Send Mail.Drafts Mail.All',
		responseType:'code',
		returnUrl:`${process.env.NEXT_PUBLIC_BASE_URL}/api/aurinko/callback`
	});

	return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
}

export async function exchangeCodeForToken(code:string){
	const {userId}=await auth();
	if(!userId) throw new Error('Unauthorized');

	try{
		const response=await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {}, {
			auth: {
				username: process.env.AURINKO_CLIENT_ID!,
				password: process.env.AURINKO_CLIENT_SECRET!
			}
		});
		return response.data as {
			accountId:string;
			accessToken:string;
			userId:string;
			userSession:string;
		};
	}catch (e) {
		if (axios.isAxiosError(e)) {
			console.error(`Error exchanging code for token: ${e.response?.data}`);
		}
		console.error(`Error exchanging code for token: ${e instanceof Error ? e.message : String(e)}`);
	}
}

export async function getAccountDetails(accessToken:string){
	try {
		const response=await axios.get('https://api.aurinko.io/v1/account', {
			headers:{
				'Authorization':`Bearer ${accessToken}`
			}
		});
		return response.data as {
			email:string;
			name:string;
		}
	}catch (e) {
		if(axios.isAxiosError(e)){
			console.error(`Error getting account details: ${e.response?.data}`);
		}
		console.error(`Error getting account details: ${e instanceof Error ? e.message : String(e)}`);
	}
}