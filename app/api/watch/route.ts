import { FetchSource } from "@/action/fetchsources";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = await searchParams.get("id");
    const dub = await searchParams.get("dub") === "true";
    if (!id) {
        return new NextResponse(JSON.stringify({ error: "No ID provided" }), {
            status: 400,
        });
    }
    try {
        const source = await FetchSource(id, dub);
        return Response.json(source);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch episode data" }), {
            status: 500,
        });
    }
}