import MainLayout from "../components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find the Sound for Every Moment 🎶
        </h1>
        <p className="text-lg text-muted-foreground">
          Book trusted musicians for weddings, events, and more.
        </p>
      </div>
    </MainLayout>
  );
}
