import { NextResponse } from "next/server";
import { saveSignup, validateSignup } from "@/lib/signups";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === "string" && body.website !== "") {
    return NextResponse.json({ status: "created" });
  }

  const result = validateSignup(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  try {
    const status = await saveSignup(result.signup);
    return NextResponse.json({ status });
  } catch (err) {
    console.error("Failed to save signup", err);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again in a minute." },
      { status: 500 },
    );
  }
}
