import { Search, CalendarCheck, Sparkles } from "lucide-react";
import { Music, Star, Calendar, Award, CreditCard, Users } from "lucide-react";

export const steps = [
  {
    icon: <Search className="w-10 h-10 text-blue-600 mb-4" />,
    title: "Discover Talent",
    description:
      "Browse an extensive catalog of musicians by genre, location, and availability.",
  },
  {
    icon: <CalendarCheck className="w-10 h-10 text-blue-600 mb-4" />,
    title: "Effortless Booking",
    description:
      "Book your favorite artists directly through our secure platform with ease.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-blue-600 mb-4" />,
    title: "Experience Magic",
    description:
      "Enjoy unforgettable live music performances at your special events.",
  },
];

export const testimonials = [
  {
    name: "Sarah J.",
    role: "Event Organizer",
    quote:
      "MusiConnect made booking a jazz band for our wedding incredibly easy. The band was phenomenal and truly made our day unforgettable!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Smith",
    role: "Corporate Event Planner",
    quote:
      "The variety of musicians on MusiConnect is amazing. My event was a hit because of the talented band I booked here.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Aisha Bello",
    role: "Musician",
    quote:
      "MusiConnect has connected me to incredible gigs. The platform is easy to use and payments are always on time.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export const features = [
  {
    icon: Music,
    title: "Diverse Talent Pool",
    description:
      "Access a wide range of musicians across all genres and styles.",
  },
  {
    icon: Star,
    title: "Verified Professionals",
    description:
      "Book with confidence from a curated selection of top-rated artists.",
  },
  {
    icon: Calendar,
    title: "Seamless Booking",
    description:
      "Our intuitive platform makes finding and booking talent simple and fast.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description:
      "We ensure every performance meets the highest standards of excellence.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "All transactions are safely processed through our trusted system.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description:
      "Our team is here to assist you every step of the way, ensuring a smooth experience.",
  },
];
