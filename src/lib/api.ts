const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.error || error.message || `Request failed: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ── Events ─────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  allDay: boolean;
  imageUrl?: string;
  category: 'MEETING' | 'CAMPOUT' | 'SERVICE' | 'FUNDRAISER' | 'SPECIAL';
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getEvents(params?: { limit?: number; published?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.published !== undefined) searchParams.set('published', String(params.published));
  const qs = searchParams.toString();
  return request<{ events: Event[] }>(`/events${qs ? `?${qs}` : ''}`).then((r) => r.events);
}

export function getEvent(slug: string) {
  return request<{ event: Event }>(`/events/${slug}`).then((r) => r.event);
}

export function createEvent(data: Partial<Event>) {
  return request<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateEvent(id: string, data: Partial<Event>) {
  return request<Event>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteEvent(id: string) {
  return request<void>(`/events/${id}`, { method: 'DELETE' });
}

// ── Posts ──────────────────────────────────────────────

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl?: string;
  featuredImage: string | null;
  category: 'BLOG' | 'SCOUTMASTER_NOTE' | 'ANNOUNCEMENT';
  published: boolean;
  authorId: string;
  author?: { name: string };
  createdAt: string;
  updatedAt: string;
}

export function getPosts(params?: { limit?: number; category?: string; published?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.category) searchParams.set('category', params.category);
  if (params?.published !== undefined) searchParams.set('published', String(params.published));
  const qs = searchParams.toString();
  return request<{ posts: Post[] }>(`/posts${qs ? `?${qs}` : ''}`).then((r) => r.posts);
}

export function getPost(slug: string) {
  return request<{ post: Post }>(`/posts/${slug}`).then((r) => r.post);
}

export function createPost(data: Partial<Post>) {
  return request<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePost(id: string, data: Partial<Post>) {
  return request<Post>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePost(id: string) {
  return request<void>(`/posts/${id}`, { method: 'DELETE' });
}

// ── Resources ─────────────────────────────────────────

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  category: 'PACKING_LIST' | 'GEAR_GUIDE' | 'MERIT_BADGE' | 'GENERAL';
  sortOrder: number;
  fileUrl?: string;
  linkUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getResources(params?: { category?: string; published?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.published !== undefined) searchParams.set('published', String(params.published));
  const qs = searchParams.toString();
  return request<{ resources: Resource[] }>(`/resources${qs ? `?${qs}` : ''}`).then((r) => r.resources);
}

export function getResource(slug: string) {
  return request<{ resource: Resource }>(`/resources/${slug}`).then((r) => r.resource);
}

export function createResource(data: Partial<Resource>) {
  return request<Resource>('/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateResource(id: string, data: Partial<Resource>) {
  return request<Resource>(`/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteResource(id: string) {
  return request<void>(`/resources/${id}`, { method: 'DELETE' });
}

// ── Notifications ─────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'URGENT';
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export function getNotifications(params?: { active?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.active !== undefined) searchParams.set('active', String(params.active));
  const qs = searchParams.toString();
  return request<{ notifications: Notification[] }>(`/notifications${qs ? `?${qs}` : ''}`).then((r) => r.notifications);
}

export function createNotification(data: Partial<Notification>) {
  return request<Notification>('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateNotification(id: string, data: Partial<Notification>) {
  return request<Notification>(`/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteNotification(id: string) {
  return request<void>(`/notifications/${id}`, { method: 'DELETE' });
}

// ── Contact ───────────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function submitContact(data: { name: string; email: string; subject: string; message: string }) {
  return request<ContactMessage>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getContactMessages() {
  return request<{ messages: ContactMessage[] }>('/contact').then((r) => r.messages);
}

export function markContactRead(id: string) {
  return request<ContactMessage>(`/contact/${id}/read`, {
    method: 'PATCH',
  });
}

// ── Auth ──────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export function login(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function loginDevToken(devToken: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ devToken }),
  });
}

export function getMe() {
  return request<{ user: User }>('/auth/me').then((r) => r.user);
}

// ── AI ────────────────────────────────────────────────

export function generateAI(data: { prompt: string; type?: string }) {
  return request<{ content: string }>('/ai/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
