import { Suspense } from "react";
import ExploreContent from "./ExploreContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
