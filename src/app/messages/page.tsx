"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import MainLayout from "@/components/MainLayout";

interface Message {
  id: string;
  desc: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  bookerId: string;
  musicianId: string;
  readByBooker: boolean;
  readByMusician: boolean;
  updatedAt: string;
  messages: Message[]; // latest message included
}

export default function MessagesPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const role = user?.publicMetadata?.role as "BOOKER" | "MUSICIAN" | undefined;
  const userId = user?.id;

  // Fetch conversations
  const { isLoading, error, data } = useQuery<Conversation[]>({
    queryKey: ["conversations", userId, role],
    queryFn: async () => {
      const res = await axios.get(
        `/api/conversations?userId=${userId}&role=${role}`
      );
      return res.data;
    },
    enabled: !!userId && !!role, // only run when userId + role exist
  });

  // Mutation: mark conversation as read
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.put(`/api/conversations/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", userId, role],
      });
    },
  });

  const handleRead = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <MainLayout>
      <div className="flex justify-center">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error loading conversations</p>
        ) : (
          <div className="w-full max-w-5xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Messages</h1>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-4">
                      {role === "MUSICIAN" ? "Booker" : "Musician"}
                    </th>
                    <th className="p-4">Last Message</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((c) => {
                    const isUnread =
                      (role === "MUSICIAN" && !c.readByMusician) ||
                      (role === "BOOKER" && !c.readByBooker);

                    return (
                      <tr
                        key={c.id}
                        className={`border-t hover:bg-gray-50 transition ${
                          isUnread ? "bg-green-50" : "bg-white"
                        }`}
                      >
                        <td className="p-4 font-medium">
                          {role === "MUSICIAN" ? c.bookerId : c.musicianId}
                        </td>
                        <td className="p-4 text-gray-600">
                          {c.messages?.[0]?.desc
                            ? c.messages[0].desc.substring(0, 100) + "..."
                            : "No messages yet"}
                        </td>
                        <td className="p-4 text-gray-500">
                          {moment(c.updatedAt).fromNow()}
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/messages/${c.id}`}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            onClick={() => handleRead(c.id)}
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
