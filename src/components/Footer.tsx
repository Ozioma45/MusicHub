// /app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t text-center text-sm text-muted-foreground py-6">
      &copy; {new Date().getFullYear()} Music Hub. All rights reserved.
    </footer>
  );
}
