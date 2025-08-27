# 🎵 MusiConnect – Musician Booking Platform

MusiConnect is a full-stack platform that allows **musicians and bands** to showcase their profiles, while **bookers (event organizers)** can discover, book, and review them.  
Built with **Next.js 14 (App Router), Clerk Authentication, Prisma, and PostgreSQL**, it provides role-based dashboards and a smooth booking flow.

---

## 🚀 Features

- **Authentication**
  - Secure login/register with [Clerk](https://clerk.com/)
  - Social sign-in support
- **Role Management**
  - Users can be both `MUSICIAN` and `BOOKER`
  - Role switcher with persistent `activeRole`
- **Dashboards**
  - 🎤 **Musician Dashboard**: manage profile, showcase music, view booking requests, manage reviews
  - 📅 **Booker Dashboard**: search musicians, send booking requests, leave reviews
- **Bookings System**
  - Create, accept, or decline booking requests
  - Booking status tracking
- **Profiles**
  - Musician profile pages with bio, genre, images, and social links
  - Booker profile for account management
- **Messaging (WIP)**
  - Direct conversation between musicians and bookers
- **Responsive UI**
  - Built with **TailwindCSS + ShadCN UI**

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 14 (App Router)](https://nextjs.org/), [React](https://reactjs.org/), [TailwindCSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend:** API Routes with Next.js App Router
- **Auth:** [Clerk](https://clerk.com/) (JWT-based authentication)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Hosting:** [Vercel](https://vercel.com/)
- **Notifications:** ShadCN Toaster

---

## ⚙️ Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/musiconnect.git
cd musiconnect
```

````

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Database (Postgres via Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/musiconnect

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the dev server

```bash
npm run dev
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
src/
 ├── app/
 │   ├── api/              # API Routes (messages, bookings, profiles, etc.)
 │   ├── dashboard/        # Musician & Booker dashboards
 │   ├── select-role/      # Role selection page
 │   ├── layout.tsx        # Root layout
 │   └── page.tsx          # Landing page
 ├── components/           # Reusable UI components
 ├── lib/                  # Prisma & utility functions
 └── prisma/               # Prisma schema
```

---

## 🔑 Key Flows

### User Signup

1. User signs in via Clerk
2. System checks if Clerk user exists in DB
3. If new → creates user with roles `["MUSICIAN", "BOOKER"]` and redirects to `/select-role`
4. Active role determines dashboard (`/dashboard/musician` or `/dashboard/booker`)

### Role Switching

- Stored in `user.activeRole`
- `POST /api/role-switch` updates active role without mutating `roles[]`

### Bookings

- Bookers send booking requests → stored in `Booking` table
- Musicians can accept/reject
- Status updated accordingly

---

## 📜 Prisma Schema (Core Models)

```prisma
model User {
  id          String   @id @default(cuid())
  clerkUserId String   @unique
  name        String?
  email       String?  @unique
  imageUrl    String?
  roles       Role[]
  activeRole  Role?
  bookings    Booking[] @relation("UserBookings")
  messages    Message[] @relation("UserMessages")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Booking {
  id             String   @id @default(cuid())
  musicianId     String
  bookerId       String
  status         String   @default("PENDING")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Message {
  id             String   @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  createdAt      DateTime @default(now())
}

enum Role {
  MUSICIAN
  BOOKER
}
```

---

## 🧪 Development Notes

- Role switcher updates `activeRole`, not `roles[]`.
- New users are seeded with **both roles** to simplify role switching.
- Server components are used wherever possible (App Router best practice).
- Mutations are handled via Next.js API routes.

---

## 📌 Roadmap

- [x] Authentication with Clerk
- [x] Role-based dashboards
- [x] Booking system (CRUD)
- [x] Role switcher (`activeRole`)
- [x] Search & filter for musicians
- [x] Messaging system (real-time chat)
- [ ] Payment integration

---

## 🤝 Contributing

1. Fork this repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License © 2025 [Your Name](https://github.com/yourusername)

```

```
````
