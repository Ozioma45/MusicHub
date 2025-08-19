"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/MainLayout";

interface Message {
  id: string;
  conversationId: string;
  userId: string;
  desc: string;
  createdAt: string;
}

const MessagePage = () => {
  const { conversationId } = useParams() as { conversationId: string };
  const { user } = useUser();

  // Fetch current DB user
  const { data: dbUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("/api/me");
      return res.data;
    },
  });

  const currentUserId = dbUser?.id; // internal DB id

  //const currentUserId = user?.id;

  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  const { data, isLoading, error } = useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/conversations/${conversationId}/messages`
      );
      return res.data;
    },
    enabled: !!conversationId,
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

  // Auto scroll to bottom when new messages come
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    mutation.mutate({ desc: newMessage, userId: currentUserId });
    setNewMessage("");
  };

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-md h-[85vh] flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Header */}
          {/*<div className="px-4 py-3 border-b flex items-center gap-2 bg-gray-50">
            <Link href="/messages" className="text-blue-600 text-sm">
              ← Back
            </Link>
            <h2 className="font-semibold text-gray-800">Conversation</h2>
          </div>*/}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error loading messages</p>
            ) : (
              data?.map((m) => (
                <div
                  key={m.id}
                  className={`flex mb-4 ${
                    m.userId === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] ${
                      m.userId === currentUserId
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {m.desc}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t p-3 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default MessagePage;
