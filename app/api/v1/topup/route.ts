import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try { 
        const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();

        let user_id;

        if (body.email != null) {
            let user = await db.collection("users").findOne({
                email: body.email
            })

            if (user == null) return new NextResponse("user not found", {status: 400})

            user_id = user._id
        } else {
            user_id = body.user_id
        }

        let topUpResult = await db.collection("wallets").updateOne(
			{
				user_id: user_id,
			},
			{
				$inc: {
					wallet: body.amount,
				},
			},
		);

        if (topUpResult.modifiedCount > 0) {
            let transactionResult = await db.collection("transactions").insertOne({
                receiver: new ObjectId(user_id),
                type: "topup",
                amount: body.amount,
                success: true,
                date: new Date()
            });
            return NextResponse.json({
                success: true,
                transactionResult: transactionResult.insertedId,
            });
        } else {
            return new NextResponse("", {
                status: 400,
            });
        }



    } catch(e) {
        return new NextResponse("", { status: 400 });
    }
}