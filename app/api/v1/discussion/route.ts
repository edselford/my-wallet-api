import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();
		const action = body.action;

		if (action == "getDiscussions") {
			const result = await db.collection("discussion").find({}).toArray();
			return NextResponse.json(result);
		}

		if (action == "getAnswers") {
			const result = await db
				.collection("answers")
				.find({
					question_id: new ObjectId(body.question_id),
				})
				.toArray();
			return NextResponse.json(result);
		}

		if (action == "sendAnswer") {
			let user_id;

			if (body.email != null) {
				const user = await db.collection("users").findOne({
					email: body.email,
				})

				if (user == null) return new NextResponse("", {status: 400})

				user_id = user._id
			} else {
				user_id = body.user_id
			}

			const result = await db.collection("answers").insertOne({
				owner: body.owner,
				dateAnswered: body.dateAnswered,
				content: body.content,
				question_id: new ObjectId(body.question_id),
				user_id: user_id,
			});
			return NextResponse.json(result);
		}

		if (action == "createDiscussion") {
			let username;
			if (body.email != null) {
				const user = await db.collection("users").findOne({
					email: body.email,
				});

				if (user == null) return new NextResponse("", {status: 400})

				username = user.username
			} else username = body.owner

			const result = await db
				.collection("discussion")
				.insertOne({
					topic: body.topic,
					content: body.content,
					owner: username,
					asked: body.asked
				})
			return NextResponse.json(result);
		}
	} catch (e) {
		return new NextResponse("", { status: 400 });
	}
}
