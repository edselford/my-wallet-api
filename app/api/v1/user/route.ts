import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);

        const body = await req.json();

        if (body.action == "allUser") {
            const users = await db.collection("users").find().toArray()

            return NextResponse.json(users)
        }

        if (body.action == "searchByName") {
            const user = await db.collection('users')
                .find({ name: RegExp(body.keyword, "i") })
                .toArray()
            
            return NextResponse.json(user)
        }

        const user = await db
            .collection("users")
            .findOne({ email: body.email })

        return NextResponse.json({
            user_id: user?._id,
            image: user?.image,
            username: user?.username 
        });
    } catch (e) {
        return new NextResponse("", { status: 400 });
    }
}
