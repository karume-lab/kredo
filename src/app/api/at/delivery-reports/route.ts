import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const status = formData.get("status");

    // Log the delivery status
    console.log(
      `[Africa's Talking] Message ID ${id} delivery status: ${status}`,
    );

    // Always return a 200 OK so AT knows we received it
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delivery Report Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
