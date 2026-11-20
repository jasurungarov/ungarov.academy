
import { contactSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

// Server-side validation
const serverContactSchema = contactSchema.extend({
  name: contactSchema.shape.name.trim().min(3).max(100),
  email: contactSchema.shape.email.trim().max(254),
  message: contactSchema.shape.message.trim().min(10).max(3000),
});

// Escape HTML special characters to prevent Telegram formatting issues
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Format the Telegram message
function createTelegramMessage(data: {
  name: string;
  email: string;
  message: string;
}): string {
  const { name, email, message } = data;

  return [
    "📩 <b>UNGAROV ACADEMY</b>",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    "🟢 <b>YANGI MUROJAAT</b>",
    "",
    `👤 <b>Ism:</b> ${escapeHtml(name)}`,
    `📧 <b>Email:</b> ${escapeHtml(email)}`,
    "",
    "💬 <b>Xabar:</b>",
    escapeHtml(message),
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "🌐 <b>ungarovacademy.uz</b>",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    // Check request origin
    const origin = request.headers.get("origin");

    const allowedOrigin =
      process.env.NODE_ENV === "production"
        ? "https://ungarovacademy.uz"
        : new URL(request.url).origin;

    if (origin !== allowedOrigin) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 },
      );
    }

    // Validate request body
    const body = await request.json();
    const result = serverContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid form data",
        },
        { status: 400 },
      );
    }

    // Server-only Telegram credentials
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram environment variables are missing");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 },
      );
    }

    // Prepare the message
    const text = createTelegramMessage(result.data);

    // Send message to Telegram
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
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );

    const data = await response.json();

    // Handle Telegram API errors
    if (!response.ok || data.ok !== true) {
      console.error("Telegram API Error:", {
        status: response.status,
        errorCode: data.error_code,
        description: data.description,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Failed to send Telegram message",
        },
        { status: 502 },
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Contact API Error:",
      error instanceof Error ? error.name : "Unknown error",
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
