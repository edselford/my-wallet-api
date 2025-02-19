import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();
		const action = body.action;

		if (action == "updateImage") {
			const result = await db.collection("users").updateOne(
				{ _id: new ObjectId(body._id) },
				{
					$set: {
						image: body.image,
					},
				},
			);
			return NextResponse.json(result);
		} else if (action == "updateAll") {
			const result = await db.collection("users").updateOne(
				{ _id: new ObjectId(body._id) },
				{
					$set: {
						name: body.name,
					},
				},
			);
			return NextResponse.json(result);
		}
	} catch (e) {
		return new NextResponse("", { status: 400 });
	}
}
