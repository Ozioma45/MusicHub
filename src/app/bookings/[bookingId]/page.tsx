import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { handleBookingAction } from "@/app/actions/bookingActions";
import MainLayout from "@/components/MainLayout";

export default async function BookingDetailsPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: { musician: true, booker: true },
  });
  if (!dbUser) redirect("/dashboard");

  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: {
      client: true,
      musician: { include: { user: true } },
    },
  });
  if (!booking) redirect("/dashboard");

  const isMusician = dbUser.roles.includes("MUSICIAN");
  const isBooker = dbUser.roles.includes("BOOKER");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "DECLINED":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        <h1 className="text-3xl font-bold">Booking Details</h1>

        {/* Profile Card */}
        <div className="flex gap-4 items-center bg-white shadow rounded-lg p-6">
          <Image
            src={
              isMusician
                ? booking.client.imageUrl || "/default-avatar.png"
                : booking.musician.user.imageUrl || "/default-avatar.png"
            }
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {isMusician
                ? booking.client.name || "Unknown Booker"
                : booking.musician.name}
            </h2>
            <p className="text-muted-foreground">
              {isMusician ? booking.client.email : booking.musician.user.email}
            </p>
            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        {/* Booking Info */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <p>
            <strong>Date:</strong> {booking.date.toDateString()}
          </p>
          <p>
            <strong>Event:</strong> {booking.eventType}
          </p>
          <p>
            <strong>Location:</strong> {booking.location}
          </p>
          <p>
            <strong>Message:</strong> {booking.message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {isMusician && booking.status === "PENDING" && (
            <>
              <form action={handleBookingAction}>
                <input type="hidden" name="bookingId" value={booking.id} />
                <input type="hidden" name="action" value="ACCEPTED" />
                <Button className="bg-green-600 hover:bg-green-700">
                  Accept
                </Button>
              </form>
              <form action={handleBookingAction}>
                <input type="hidden" name="bookingId" value={booking.id} />
                <input type="hidden" name="action" value="DECLINED" />
                <Button variant="destructive">Decline</Button>
              </form>
            </>
          )}

          {isBooker && booking.status === "PENDING" && (
            <form action={handleBookingAction}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <input type="hidden" name="action" value="CANCELLED" />
              <Button variant="destructive">Cancel Booking</Button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
