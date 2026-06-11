import { NextResponse } from "next/server";
import { discoverSite } from "@/features/rss/discovery/discoverSite";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL_REQUIRED" }, { status: 400 });
    }

    const result = await discoverSite(url);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("discover-site error:", err);

    return NextResponse.json(
      { success: false, error: "DISCOVERY_FAILED" },
      { status: 500 },
    );
  }
}
