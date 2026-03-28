export interface MivaXOptions {
  baseUrl?: string;
}

export interface LoginResponse {
  sessionId: string;
  [key: string]: any;
}

export interface UserProfile {
  [key: string]: any;
}

export interface AcademicSummary {
  cgpa: string | number;
  degreeStatus: string;
  [key: string]: any;
}

export interface AcademicLevel {
  level: string;
  completed: boolean;
  [key: string]: any;
}

export interface Transcript {
  [key: string]: any;
}

export interface Course {
  id: string | number;
  name: string;
  [key: string]: any;
}

export interface RegistrationStatus {
  enrolled: boolean;
  [key: string]: any;
}

export interface PaymentRecord {
  id: string | number;
  amount: number;
  date: string;
  [key: string]: any;
}

export interface Notification {
  id: string | number;
  message: string;
  [key: string]: any;
}

export interface ModuleDetail {
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  perPage?: number;
}
