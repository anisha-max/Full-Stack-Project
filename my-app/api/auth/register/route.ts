import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { error } from "console";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" }, { status: 400 }
            )
        }
        await connectDB()

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" }, { status: 400 }
            )
        }

        await User.create(
            {
                email,
                password
            }
        )

        return NextResponse.json(
            { error: "User created successfully" }, { status: 201 }
        )

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to register User" }, { status: 500 }
        )
    }
}