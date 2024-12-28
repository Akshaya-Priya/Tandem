export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'organizer' | 'volunteer';
  status: 'active' | 'inactive';
  created_at: string;
};

export type Organizer = {
  id: string;
  user_id: string;
  specialization: string;
  created_at: string;
};

export type Event = {
  id: string;
  name: string;
  description: string | null;
  date: string;
  location: string;
  status: 'active' | 'completed';
  organizer_id: string;
  created_at: string;
};

export type VolunteerParticipation = {
  id: string;
  event_id: string;
  volunteer_id: string;
  status: 'confirmed' | 'pending';
  created_at: string;
};

export type Task = {
  id: string;
  event_id: string;
  description: string;
  assigned_to: string | null;
  status: 'pending' | 'complete';
  created_at: string;
};

export type Feedback = {
  id: string;
  volunteer_id: string;
  event_id: string;
  rating: number;
  comments: string | null;
  created_at: string;
};