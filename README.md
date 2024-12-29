# Tandem - Volunteer Management System 🚀

A full-stack web application for managing volunteers, events, and tasks for community-driven projects. The platform enables organizers to manage events, assign tasks to volunteers, and collect feedback on events. Volunteers can sign up, participate in events, and submit feedback.

## Features 🌟

- **Organizer Dashboard**: Manage events, assign tasks, and track volunteer participation.
- **Volunteer Participation**: View available events and sign up for participation.
- **Task Management**: Assign tasks to volunteers for specific events.
- **Feedback**: Submit feedback on events.
- **Authentication**: Secure login and registration using Supabase.
- **Role-Based Access Control**: Different levels of access for organizers, volunteers, and admins.

## Tech Stack 🛠️

- **Frontend**: Next.js (Tailwind CSS for styling)
- **Backend**: Supabase (PostgreSQL, and Authentication)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (in the future) and Supabase (for backend)

## Prerequisites 📋

- Node.js (v18 or higher)
- Supabase account (for database and authentication)
- PostgreSQL database (handled by Supabase)
- Vercel account (for deploying the frontend)

## Getting Started 🏁

![Project image](https://github.com/user-attachments/assets/00558235-1bc9-4869-ad03-a6bb9c7b2b9a)

![users](https://github.com/user-attachments/assets/502e6fcf-4941-4cf0-95da-402a649be156)

![image](https://github.com/user-attachments/assets/3ff84c08-64c3-4a4d-a163-bca20cb34862)

### Clone the Repository

```bash
git clone https://github.com/himanshukt03/Tandem.git
cd Tandem

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```makefile
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can obtain these from your Supabase project.

### Running Locally

To start the development server locally:

```bash
npm run dev
```

This will start the Next.js server on `http://localhost:3000`.

### Database Setup

1. Set up a Supabase project.
2. Create the tables and schema by running the provided SQL migrations in the Supabase SQL editor.
3. Insert some test data (volunteers, events, etc.) to get started.

### Seeding Test Data

You can add test data for volunteers and events in your Supabase dashboard to quickly start using the app.


## Database Schema

### Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text CHECK (role IN ('admin', 'organizer', 'volunteer')) DEFAULT 'volunteer',
  phone varchar,
  status boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

### Events Table

```sql
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  description text,
  date date,
  location varchar,
  status text CHECK (status IN ('Active', 'Completed')) DEFAULT 'Active',
  organizer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
```

### Volunteer Participation Table

```sql
CREATE TABLE IF NOT EXISTS volunteer_participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  volunteer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text CHECK (status IN ('Confirmed', 'Pending')) DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);
```

### Tasks Table

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  description text NOT NULL,
  assigned_to uuid REFERENCES users(id) ON DELETE CASCADE,
  status text CHECK (status IN ('Pending', 'Complete')) DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);
```

### Feedback Table

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  comments text,
  created_at timestamptz DEFAULT now()
);
```

## Role-Based Access Control (RLS)

Row-level security (RLS) is enabled to restrict access to users based on their roles. Policies are set for viewing and managing events and tasks by organizers and volunteers.

## Contributing

We welcome contributions to improve this project! To contribute:

1. Fork the repository.
2. Clone your fork locally.
3. Create a new branch for your feature or bugfix.
4. Make your changes and write tests (if applicable).
5. Push your changes and create a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
