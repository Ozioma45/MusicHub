# 🎶 MusiConnect – Musician Booking Platform

MusiConnect is a **full-stack booking platform** that allows **musicians** to showcase their profiles and **bookers** (event organizers, individuals, businesses) to hire them for events.  
It is built with **Next.js 14 (App Router)**, **Prisma**, **PostgreSQL**, and **Clerk Authentication**.

---

live preview [Click Here](https://music-hub-lyart.vercel.app/)

## 🚀 Features

- 🔐 **Authentication with Clerk**

  - Sign up, login, and logout
  - Social logins supported
  - User data synced with PostgreSQL

- 👥 **Role Management**

  - Every user can have both roles: `MUSICIAN` and `BOOKER`
  - Role switching system with active role stored in DB
  - Role-based dashboards

- 🎤 **Musician Features**

  - Create and update musician profile (bio, genre, skills, portfolio, etc.)
  - Receive booking requests
  - Accept / reject bookings
  - View reviews from past clients

- 📅 **Booker Features**

  - Browse and search musicians
  - Send booking requests
  - Leave reviews for musicians
  - Manage upcoming and past bookings

- 🗂 **Dashboard Pages**

  - `/dashboard/musician`
  - `/dashboard/booker`
  - Internal profile management pages

- 📡 **API Routes**
  - `POST /api/roles/switch` – switch active role
  - `POST /api/bookings` – create booking
  - `GET /api/bookings/:id` – get booking details
  - `POST /api/reviews` – add review
  - `PUT /api/users/update` – update user profile

---

## 🛠 Tech Stack

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions), [React](https://react.dev/), [TailwindCSS](https://tailwindcss.com/)
- **Backend:** [Prisma ORM](https://www.prisma.io/), [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [Clerk](https://clerk.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Notifications:** ShadCN Toaster

---

## 📂 Project Structure

```

musiconnect/
│── app/
│ ├── api/ # API routes
│ ├── dashboard/ # Role-based dashboards
│ ├── select-role/ # Role selection page
│ ├── layout.tsx # Global layout
│ └── page.tsx # Landing page
│
│── prisma/
│ └── schema.prisma # Database schema
│
│── lib/
│ ├── db.ts # Prisma client
│ └── utils.ts # Helper functions
│
│── components/ # Reusable UI components
│── middleware.ts # Clerk middleware
│── package.json
│── README.md

```

---

## 🗄 Database Schema (Prisma)

```prisma
model User {
  id          String   @id @default(cuid())
  clerkUserId String   @unique
  email       String   @unique
  name        String?
  imageUrl    String?
  roles       Role[]
  activeRole  Role?

  // Relations
  MusicianProfile MusicianProfile?
  BookingsMade    Booking[] @relation("BookerBookings")
  BookingsRecvd   Booking[] @relation("MusicianBookings")
  ReviewsGiven    Review[]  @relation("ReviewerReviews")
  ReviewsRecvd    Review[]  @relation("MusicianReviews")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model MusicianProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  bio         String?
  genre       String?
  skills      String[]
  portfolio   String?
  user        User     @relation(fields: [userId], references: [id])
}

model Booking {
  id          String   @id @default(cuid())
  bookerId    String
  musicianId  String
  date        DateTime
  status      String   @default("PENDING")

  booker   User @relation("BookerBookings", fields: [bookerId], references: [id])
  musician User @relation("MusicianBookings", fields: [musicianId], references: [id])
}

model Review {
  id          String   @id @default(cuid())
  rating      Int
  comment     String?
  reviewerId  String
  musicianId  String

  reviewer User @relation("ReviewerReviews", fields: [reviewerId], references: [id])
  musician User @relation("MusicianReviews", fields: [musicianId], references: [id])
}

enum Role {
  MUSICIAN
  BOOKER
}
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/musiconnect.git
cd musiconnect
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create `.env` file in root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/musiconnect"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4️⃣ Run Prisma Migrations

```bash
npx prisma migrate dev
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

---

## 🔐 Authentication & Roles

- Uses **Clerk** for login/signup
- Each user is automatically assigned both roles: `MUSICIAN` & `BOOKER`
- Active role is stored in `user.activeRole` and can be switched
- Middleware ensures users without a role are redirected to `/select-role`

---

## 📡 API Routes

| Endpoint            | Method | Description                 |
| ------------------- | ------ | --------------------------- |
| `/api/roles/switch` | POST   | Switch user active role     |
| `/api/bookings`     | POST   | Create a new booking        |
| `/api/bookings/:id` | GET    | Fetch booking details       |
| `/api/reviews`      | POST   | Add a review for a musician |
| `/api/users/update` | PUT    | Update user profile         |

---

## 🤝 Contributing

Contributions are welcome!
To contribute:

1. Fork repo
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m "Added new feature"`)
4. Push branch (`git push origin feature/new-feature`)
5. Create Pull Request 🎉

---

## 📜 License

This project is licensed under the **MIT License** – feel free to use and adapt.

---

## 👨🏽‍💻 Author

Built with ❤️ by **[Ozioma John Egole](https://github.com/Ozioma45)**
Mission: Helping musicians connect with opportunities and event organizers 🎶

```

```
