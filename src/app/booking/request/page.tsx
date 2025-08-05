import { Suspense } from "react";
import BookingRequestPage from "./BookingRequestPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingRequestPage />
    </Suspense>
  );
}
