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
            user_id = body.from_id
        }

        let from_TrasnferResult = await db.collection("wallets").updateOne(
            {
                user_id: new ObjectId(user_id),
            },
            {
                $inc: {
                    wallet: -(body.amount),
                },
            },
        );


		let to_TransferResult = await db.collection("wallets").updateOne(
			{
				user_id: new ObjectId(body.to_id),
			},
			{
				$inc: {
					wallet: body.amount,
				},
			},
		);
        if (
            from_TrasnferResult.modifiedCount > 0 &&
            to_TransferResult.modifiedCount > 0
        ) {
            let transactionResult = await db.collection("transactions").insertOne({
                sender: user_id,
                receiver: new ObjectId(body.to_id),
                type: "transfer",
                amount: body.amount,
                success: true,
                date: new Date(),
                message: body.message,
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