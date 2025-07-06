"use client";

import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

function TestButton() {
	return (
		<Button
			className={'m-5'}
			onClick={async () => {
				const url = await getAurinkoAuthUrl("Google");
				redirect(url);
			}}
		>
			Click
		</Button>
	);
}

export default TestButton;