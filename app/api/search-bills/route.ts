import { NextResponse, NextRequest } from "next/server";

export const GET = async (res: NextResponse, req: NextRequest) => {
  const apiKey = process.env.CONGRESS_GOV_API_KEY;
  const { billType, number, keyWord } = req.params;

  try {
    const response = await fetch(
      `https://api.congress.gov/v3/bill?api_key=${apiKey}&limit=10&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error(`http error. status: ${response.status}`);
    }
    const data = await response.json();
    const nextResponse = NextResponse.json(data);
    nextResponse.headers.set("Cache-Control", "s-maxage=3600");
    return nextResponse;
  } catch (error) {
    console.error(`error fetching data: ${error}`);
    return NextResponse.json({ error: "failed to fetch data" });
  }
};
