import MainLayout from "../components/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic2, CalendarCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero */}
      <section
        className="p-10 text-center h-full flex justify-center items-center flex-col
"
      >
        <h1 className="text-4xl font-bold mb-4">
          Find the Sound for Every Moment 🎶
        </h1>
        <p className="text-lg text-muted-foreground">
          Book trusted musicians for weddings, events, and more.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-purple-700 font-semibold hover:bg-purple-100"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              size="lg"
              variant="outline"
              className="border-white hover:bg-purple-100 hover:text-purple-700"
            >
              Explore Musicians
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Why Use Music Hub?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div>
            <CalendarCheck className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-lg mb-1">Seamless Booking</h3>
            <p className="text-muted-foreground">
              Book verified musicians directly, no stress or middlemen.
            </p>
          </div>
          <div>
            <Mic2 className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-lg mb-1">Verified Talent</h3>
            <p className="text-muted-foreground">
              Browse profiles, watch videos, and read reviews.
            </p>
          </div>
          <div>
            <Users className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-lg mb-1">Built for Community</h3>
            <p className="text-muted-foreground">
              Connect with fellow music lovers, leave reviews, and build trust.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-purple-50 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to bring your event to life?
        </h2>
        <p className="text-muted-foreground mb-6">
          Join Music Hub as a musician or a booker. It’s free.
        </p>
        <Link href="/sign-up">
          <Button
            size="lg"
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold"
          >
            Create Free Account
          </Button>
        </Link>
      </section>
    </MainLayout>
  );
}
