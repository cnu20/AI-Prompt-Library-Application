import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prompt {
  id: number;
  title: string;
  content: string;
  complexity: number;
  created_at: string;
  view_count?: number;
}

@Injectable({ providedIn: 'root' })
export class PromptService {
  private base = 'https://ai-prompt-library-application-w777.onrender.com/prompts/';

  constructor(private http: HttpClient) {}

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.base}/`);
  }

  getPrompt(id: number): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.base}/${id}/`);
  }

  createPrompt(data: { title: string; content: string; complexity: number }): Observable<Prompt> {
    return this.http.post<Prompt>(`${this.base}/`, data);
  }
}
