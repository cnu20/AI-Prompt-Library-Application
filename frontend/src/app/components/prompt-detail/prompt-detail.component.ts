import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromptService, Prompt } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-detail',
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css'],
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  loading = true;
  error = '';
  copied = false;

  constructor(private route: ActivatedRoute, private ps: PromptService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ps.getPrompt(id).subscribe({
      next: (data) => { this.prompt = data; this.loading = false; },
      error: () => { this.error = 'Prompt not found.'; this.loading = false; },
    });
  }

  complexityLabel(c: number): string {
    if (c <= 3) return 'Low';
    if (c <= 7) return 'Medium';
    return 'High';
  }

  complexityClass(c: number): string {
    if (c <= 3) return 'low';
    if (c <= 7) return 'medium';
    return 'high';
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
