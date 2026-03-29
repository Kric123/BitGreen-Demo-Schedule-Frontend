// src/services/scheduleApi.ts
//add your API service link here, for example: http://localhost:8080/api or https://myapi.com/api must have /api at the end
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://bgbackenddemo-env.eba-pucdzufm.us-east-1.elasticbeanstalk.com/api';

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
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

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