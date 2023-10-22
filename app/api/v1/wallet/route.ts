import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);

        const body = await req.json();
        const action = body.action;

        if (action == "getWallet") {
            if (body.email != null) {
                const user = await db.collection("users").findOne({
					email: body.email,
				})

				if (user == null) {
					return NextResponse.json({"msg" : "not found"})
				}

				const result = await db.collection("wallets").findOne({user_id: user._id})

				return NextResponse.json(result)
            }
            const result = await db
                .collection("wallets")
                .find({
                    user_id: new ObjectId(body.user_id),
                })
                .toArray();
            return NextResponse.json(result);
        }
    } catch (e) {
        return new NextResponse("", { status: 400 });
    }
}
