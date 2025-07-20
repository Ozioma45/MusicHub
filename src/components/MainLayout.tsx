// /app/components/MainLayout.tsx
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "./ui/sonner";
import TopLoader from "./TopLoader";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopLoader />
      <Navbar />

      <main className="flex-grow">{children}</main>
      <Toaster />
      <Footer />
    </div>
  );
};

export default MainLayout;
