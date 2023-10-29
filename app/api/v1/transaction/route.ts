import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);

        const body = await req.json();
        let user_id: ObjectId;

        if (body.email != null) {
            let user = await db.collection("users").findOne({
                email: body.email,
            });
            
            if (user == null) return new NextResponse("user not found", {status: 400});
            user_id = user._id
        } else {
            user_id = new ObjectId(body.user_id)
        }

        const transaction = await db.collection("transactions").find({
            $or: [
                { sender: user_id },
                { receiver: user_id },
            ],
        }).toArray();

        return NextResponse.json(transaction.map(transaction => {
            return {...transaction, isSender: transaction.sender == user_id.toString()};
        }));
    } catch (e) {
        return new NextResponse("", { status: 400 });
    }
}
