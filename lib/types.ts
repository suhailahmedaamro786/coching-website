/** Shared row types for the LearnHub data model. */

export type Teacher = {
  id: number;
  name: string | null;
  role: string | null;
  subject: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at?: string | null;
};

export type Course = {
  id: number;
  title: string | null;
  description: string | null;
  price: number | null;
  duration_weeks: number | null;
  thumbnail_url: string | null;
  status: string | null;
  teacher_id?: number | null;
  teachers?: Teacher | null;
  created_at?: string | null;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role?: string | null;
};

export type NotificationRow = {
  id: number;
  user_id: string;
  title: string | null;
  message: string | null;
  is_read: boolean;
  created_at?: string | null;
};

/** Minimal serializable view of the auth session user. */
export type SessionUser = {
  id: string;
  email?: string | null;
};
