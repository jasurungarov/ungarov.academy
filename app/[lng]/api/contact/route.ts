import { contactSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

const serverContactSchema = contactSchema.extend({
  name: contactSchema.shape.name.trim().min(3).max(100),
  email: contactSchema.shape.email.trim().max(254),
  message: contactSchema.shape.message.trim().min(10).max(3000),
});

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");

    const allowedOrigin =
      process.env.NODE_ENV === "production"
        ? "https://ungarovacademy.uz"
        : new URL(request.url).origin;

    if (origin !== allowedOrigin) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const body = await request.json();
    const result = serverContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const { name, email, message } = result.data;

    const text = [
      "📩 Ungarov Academy — New inquiry",
      "",
      `👤 Name: ${name}`,
      `📧 Email: ${email}`,
      "",
      `💬 Message: ${message}`,
    ].join("\n");

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );

    const data = await response.json();

    if (!response.ok || data.ok !== true) {
      console.error("Telegram API Error:", {
        status: response.status,
        errorCode: data.error_code,
        description: data.description,
      });

      return NextResponse.json({ success: false }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
