import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    // Check if email already exists
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: "You are already subscribed." }),
        { status: 409 }
      );
    }

    // Save new subscriber
    await prisma.subscriber.create({
      data: { email },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Subscription failed" }), {
      status: 500,
    });
  }
}
