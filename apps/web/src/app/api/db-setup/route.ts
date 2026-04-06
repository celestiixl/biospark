import { NextResponse } from "next/server"
import { runMigrations } from "@/lib/db-migrate"

export async function GET() {
  try {
    await runMigrations()
    return NextResponse.json({ ok: true, message: "Tables ready" })
  } catch (error) {
    console.error("[db-setup] error:", error);
    return NextResponse.json({ ok: false, error: "Database setup failed. Check server logs." }, { status: 500 })
  }
}
