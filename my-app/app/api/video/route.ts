import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB()
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }
        return NextResponse.json(videos)
    }
    catch (error) {
        return NextResponse.json(
            {error :"failed to get videos"} ,
            { status: 200 })
    }
}

export async function Post(request : NextResponse){
try {
    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json({error:"Unauthorized user"} , {status:401})
    }
    await connectDB()
    const body:IVideo = await request.json()
    if(!body.title || !body.description || !body.thumbnailUrl || body.videoUrl ){
        return NextResponse.json({error : "All details required"} , {status :401})
    }
    const videoData = {
        ...body,
        controls : body.controls ?? true ,
          transformation: {
            width: 1080,
            height: 1920,
              quality: body.transformation?.quality ?? 100,
            },
    }
    const newVideo = await Video.create(videoData)
    return NextResponse.json(newVideo)

} catch (error) {
    return NextResponse.json(
        {error :"unable to post videos"} ,
        { status: 200 })
}
}

