import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col h-100">
      <div className="m-auto">
        <SignUp forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
