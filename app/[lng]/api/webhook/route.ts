/* eslint-disable camelcase */
import Notification from "@/database/notification.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const secret = process.env.NEXT_CLERK_WEBHOOK_SECRET;

  if (!secret) {
    console.error("Missing Clerk webhook secret");

    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { message: "Missing webhook headers" },
      { status: 400 },
    );
  }

  const body = await req.text();
  const webhook = new Webhook(secret);

  let event: WebhookEvent;

  try {
    event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json(
      { message: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  if (event.type !== "user.created" && event.type !== "user.updated") {
    return NextResponse.json({ received: true });
  }

  const {
    id,
    email_addresses,
    primary_email_address_id,
    image_url,
    first_name,
    last_name,
  } = event.data;

  const email = email_addresses.find(
    (address) => address.id === primary_email_address_id,
  )?.email_address;

  const fullName = [first_name, last_name].filter(Boolean).join(" ").trim();

  if (!email) {
    return NextResponse.json(
      { message: "Primary email not found" },
      { status: 422 },
    );
  }

  try {
    await connectToDatabase();

    const session = await User.db.startSession();

    try {
      await session.withTransaction(async () => {
        const existingUser = await User.findOne({
          clerkId: id,
        }).session(session);

        if (event.type === "user.created") {
          if (existingUser) return;

          await User.create(
            [
              {
                clerkId: id,
                email,
                fullName: fullName || email.split("@")[0],
                picture: image_url,
              },
            ],
            { session },
          );

          await Notification.create(
            [
              {
                user: id,
                message: "messageWelcome",
              },
            ],
            { session },
          );

          return;
        }

        if (!existingUser) {
          throw new Error("User profile not found");
        }

        const updatedData = {
          email,
          fullName: fullName || existingUser.fullName,
          picture: image_url,
        };

        const hasChanges =
          existingUser.email !== updatedData.email ||
          existingUser.fullName !== updatedData.fullName ||
          existingUser.picture !== updatedData.picture;

        if (!hasChanges) return;

        await User.updateOne(
          { clerkId: id },
          { $set: updatedData },
          { session, runValidators: true },
        );

        await Notification.create(
          [
            {
              user: id,
              message: "messageProfileUpdated",
            },
          ],
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook processing failed:", error);

    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
