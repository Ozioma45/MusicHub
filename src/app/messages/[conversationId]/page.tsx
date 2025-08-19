"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const MessagePage = () => {
  const { conversationId } = useParams() as { conversationId: string };
  const { user } = useUser();
  const currentUserId = user?.id;

  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages
  const { data, isLoading, error } = useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/conversations/${conversationId}/messages`
      );
      return res.data;
    },
    enabled: !!conversationId, // only run when we have an id
  });

  // Send message
  const mutation = useMutation({
    mutationFn: async (message: { desc: string; userId: string }) => {
      return axios.post(
        `/api/conversations/${conversationId}/messages`,
        message
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    mutation.mutate({ desc: newMessage, userId: currentUserId });
    setNewMessage("");
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl p-6">
        {/* Breadcrumb */}
        <span className="text-sm text-gray-500">
          <Link href="/messages" className="hover:underline">
            Messages
          </Link>{" "}
          {">"} Conversation
        </span>

        {/* Messages */}
        <div className="my-6 h-[500px] overflow-y-scroll flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error loading messages</p>
          ) : (
            data?.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-lg ${
                  m.senderId === currentUserId
                    ? "flex-row-reverse self-end"
                    : "flex-row self-start"
                }`}
              >
                <img
                  src={
                    m.senderId === currentUserId
                      ? user?.imageUrl || "/default-avatar.png"
                      : "/default-avatar.png"
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p
                  className={`px-4 py-2 text-sm rounded-2xl ${
                    m.senderId === currentUserId
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t pt-4"
        >
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            className="w-full h-20 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 resize-none"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagePage;
