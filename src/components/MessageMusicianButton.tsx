"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

// MessageMusicianButton.tsx
export default function MessageMusicianButton({
  musicianUserId, // renamed for clarity
}: {
  musicianUserId: string;
}) {
  const router = useRouter();

  async function handleMessageMusician() {
    try {
      const res = await axios.post("/api/conversations/start", {
        targetUserId: musicianUserId, // 👈 pass actual userId
      });
      router.push(`/messages/${res.data.conversationId}`);
    } catch (err) {
      console.error("❌ Failed to start conversation with musician:", err);
    }
  }

  return (
    <DropdownMenuItem onClick={handleMessageMusician}>
      Message Musician
    </DropdownMenuItem>
  );
}
