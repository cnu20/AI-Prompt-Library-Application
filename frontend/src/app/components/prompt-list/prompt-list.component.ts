import { Component, OnInit } from '@angular/core';
import { PromptService, Prompt } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.css'],
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;
  error = '';

  constructor(private ps: PromptService) {}

  ngOnInit(): void {
    this.ps.getPrompts().subscribe({
      next: (data) => { this.prompts = data; this.loading = false; },
      error: () => { this.error = 'Failed to load prompts.'; this.loading = false; },
    });
  }

  complexityClass(c: number): string {
    if (c <= 3) return 'low';
    if (c <= 7) return 'medium';
    return 'high';
  }
}
