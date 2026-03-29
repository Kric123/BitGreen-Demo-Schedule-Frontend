// src/services/scheduleApi.ts
//add your API service link here, for example: http://localhost:8080/api or https://myapi.com/api must have /api at the end
// For Netlify, we recommend proxying via /api and keeping the frontend origin HTTPS.
const API_BASE_URL = '/api';

export interface ScheduleData {
  id: number;
  firstname?: string;
  firstName?: string;
  lastname?: string;
  lastName?: string;
  email: string;
  phone: string;
  date_Scheduled?: string;
  dateScheduled?: string;
  time_Scheduled?: string;
  timeScheduled?: string;
}

export interface UpdateScheduleData {
  date: string;
  time: string;
}

class ScheduleApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type') || '';
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      // Handle empty responses (204 No Content, etc.)
      if (response.status === 204 || !contentType.includes('application/json')) {
        return undefined as T;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getSchedulesByName(firstName: string, lastName: string): Promise<ScheduleData | ScheduleData[]> {
    return this.request(`/schedules/getByFirstLastName/${firstName}/${lastName}`);
  }

  async deleteSchedule(id: number): Promise<void> {
    return this.request(`/schedules/delete/${id}`, { method: 'DELETE' });
  }

  async updateSchedule(id: number, data: UpdateScheduleData & { firstname: string; lastname: string; email: string; phone: string }): Promise<void> {
    return this.request(`/schedules/update/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        date_Scheduled: data.date,
        time_Scheduled: data.time
      }),
    });
  }
}

export const scheduleApi = new ScheduleApiService();