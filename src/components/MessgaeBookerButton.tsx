"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function MessageBookerButton({
  bookerId,
}: {
  bookerId: string;
}) {
  const router = useRouter();

  async function handleMessageBooker() {
    const res = await axios.post("/api/conversations/start", {
      targetUserId: bookerId,
    });
    router.push(`/messages/${res.data.conversationId}`);
  }

  return (
    <DropdownMenuItem onClick={handleMessageBooker}>
      Message Booker
    </DropdownMenuItem>
  );
}
