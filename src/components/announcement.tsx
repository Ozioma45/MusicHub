"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Announcement() {
  const [announcement, setAnnouncement] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("announcementDismissed");
    if (dismissed) return;

    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data?.message) {
          setAnnouncement(data.message);
          setOpen(true);
        }
      });
  }, []);

  const handleClose = () => {
    localStorage.setItem("announcementDismissed", "true");
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Announcement</DialogTitle>
          </DialogHeader>
          <p>{announcement}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
