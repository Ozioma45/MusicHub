"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Announcement() {
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data?.message) {
          setAnnouncement(data.message);
          setOpen(true);
        }
      })
      .catch(() => {
        // optional: handle error silently or log
      });
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Overlay Animation */}
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </DialogOverlay>

            {/* Dialog Content Animation */}
            <DialogContent className="max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-200 text-center">
              <motion.div
                key="announcement-dialog"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <DialogHeader>
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                      <Megaphone className="h-7 w-7 text-blue-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-blue-700">
                      Announcement
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-gray-600">
                      Here’s the latest update:
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <p className="mt-6 text-gray-800 text-lg leading-relaxed">
                  {announcement}
                </p>

                <div className="mt-8 flex justify-center">
                  <DialogClose asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                      Got it
                    </Button>
                  </DialogClose>
                </div>
              </motion.div>
            </DialogContent>
          </>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
