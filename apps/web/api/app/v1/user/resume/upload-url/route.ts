import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

export async function GET(req: NextRequest) {
    // const { filename, content_type } = await req.json();

    // const key = `resumes/${crypto.randomUUID()}-${filename}`;

    // const command = new PutObjectCommand({
    //     Bucket: "resumes",
    //     Key: key,
    //     ContentType: content_type
    // });

    // const url = await getSignedUrl(s3, command, {
    //     expiresIn: 60 
    // });

    // return NextResponse.json({ url, key });

    const form_data = await req.formData()
    const file = form_data.get("file") as File | null; 
    if(!file){
        return NextResponse.json({success: false})
    }
    console.log('Received:', file.name, file.size)

        return NextResponse.json({ success: true, name: file.name })
}