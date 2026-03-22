import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("api_key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://wakatime.com/api/v1/users/current/stats/last_30_days?api_key=${apiKey}`,
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch WakaTime data" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch WakaTime data" },
      { status: 500 },
    );
  }
}
