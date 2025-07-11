import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const user = await currentUser();
  console.log(user);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        Welcome, {user?.firstName} to your dashboard 🎶
      </h1>
    </div>
  );
}
