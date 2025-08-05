import { Suspense } from "react";
import SubmitReviewPage from "./SubmitRevewPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitReviewPage />
    </Suspense>
  );
}
