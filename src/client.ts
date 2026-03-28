import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  MivaXOptions,
  LoginResponse,
  UserProfile,
  AcademicSummary,
  AcademicLevel,
  Transcript,
  Course,
  RegistrationStatus,
  PaginatedResponse,
  PaymentRecord,
  Notification,
  ModuleDetail,
} from './types';

export class MivaX {
  private client: AxiosInstance;
  private sessionId: string | null = null;

  constructor(options?: MivaXOptions) {
    this.client = axios.create({
      baseURL: options?.baseUrl || 'https://mivax.marvelly.com.ng',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Set the session ID manually if already authenticated.
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Get the current session ID.
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`MivaX API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  // Auth Methods

  /**
   * Login to MivaX and set the session ID.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>({
      url: '/login',
      method: 'POST',
      data: { email, password },
    });
    
    // In many cases the response might contain sessionId directly
    // If not, we expect the caller or the API to provide it
    // Based on postman, it says "Exchanges LMS credentials for a Session ID"
    if (data.sessionId) {
      this.sessionId = data.sessionId;
    } else if (data.token) {
        // Fallback for common patterns
        this.sessionId = data.token;
    }
    
    return data;
  }

  // Student (SIS) Methods

  private ensureSessionId(): string {
    if (!this.sessionId) {
      throw new Error('Session ID is required. Please login first or set it manually using setSessionId().');
    }
    return this.sessionId;
  }

  /**
   * Fetch basic student profile from SIS.
   */
  async getUserProfile(sessionId?: string): Promise<UserProfile> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<UserProfile>({
      url: `/user/${sid}`,
      method: 'GET',
    });
  }

  /**
   * Get overall CGPA and degree status.
   */
  async getAcademicSummary(sessionId?: string): Promise<AcademicSummary> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<AcademicSummary>({
      url: `/student/academic-summary/${sid}`,
      method: 'GET',
    });
  }

  /**
   * List all study years (100L, 200L, etc) with completion summaries.
   */
  async getAcademicLevels(sessionId?: string): Promise<AcademicLevel[]> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<AcademicLevel[]>({
      url: `/student/academic-levels/${sid}`,
      method: 'GET',
    });
  }

  /**
   * Returns results for all academic levels at once.
   */
  async getFullTranscript(sessionId?: string): Promise<Transcript> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<Transcript>({
      url: `/student/transcript/${sid}`,
      method: 'GET',
    });
  }

  /**
   * Detailed results and GPA for a specific level (e.g., 200_LEVEL).
   */
  async getTranscriptByLevel(level: string, sessionId?: string): Promise<Transcript> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<Transcript>({
      url: `/student/transcript/${level}/${sid}`,
      method: 'GET',
    });
  }

  /**
   * List only the courses currently being taken in the active semester.
   */
  async getCurrentCourses(sessionId?: string): Promise<Course[]> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<Course[]>({
      url: `/student/current-courses/${sid}`,
      method: 'GET',
    });
  }

  /**
   * Check enrollment windows and pending status.
   */
  async getRegistrationStatus(sessionId?: string): Promise<RegistrationStatus> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<RegistrationStatus>({
      url: `/student/registration-status/${sid}`,
      method: 'GET',
    });
  }

  /**
   * Get payment records with pagination.
   */
  async getPaymentRecords(page = 1, perPage = 10, sessionId?: string): Promise<PaginatedResponse<PaymentRecord>> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<PaginatedResponse<PaymentRecord>>({
      url: `/payment-records/${sid}`,
      method: 'GET',
      params: { page, perPage },
    });
  }

  /**
   * Get notifications with pagination.
   */
  async getNotifications(page = 1, perPage = 5, sessionId?: string): Promise<PaginatedResponse<Notification>> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<PaginatedResponse<Notification>>({
      url: `/notifications/${sid}`,
      method: 'GET',
      params: { page, perPage },
    });
  }

  /**
   * Fetch the entire SIS dashboard JSON (heavy).
   */
  async getFullDashboard(sessionId?: string): Promise<any> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<any>({
      url: `/dashboard/${sid}`,
      method: 'GET',
    });
  }

  // LMS Methods

  /**
   * List all LMS courses.
   */
  async getLmsCourses(sessionId?: string): Promise<Course[]> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<Course[]>({
      url: `/courses/${sid}`,
      method: 'GET',
    });
  }

  /**
   * Get details of a specific course.
   */
  async getCourseContent(courseId: string | number, sessionId?: string): Promise<any> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<any>({
      url: `/course/${courseId}/${sid}`,
      method: 'GET',
    });
  }

  /**
   * Get details of a module within a course.
   */
  async getModuleDetail(modType: string, modId: string | number, sessionId?: string): Promise<ModuleDetail> {
    const sid = sessionId || this.ensureSessionId();
    return this.request<ModuleDetail>({
      url: `/mod/${modType}/${modId}/${sid}`,
      method: 'GET',
    });
  }

  /**
   * Proxy image URL and return it through MivaX.
   */
  async getProxyImageUrl(encodedUrl: string, sessionId?: string): Promise<string> {
    const sid = sessionId || this.ensureSessionId();
    // Usually this returns an image, but we return the full URL to the proxy
    return `${this.client.defaults.baseURL}/img/${encodedUrl}/${sid}`;
  }
}
