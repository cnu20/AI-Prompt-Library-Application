import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  templateUrl: './add-prompt.component.html',
  styleUrls: ['./add-prompt.component.css'],
})
export class AddPromptComponent {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    complexity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  submitting = false;
  serverError = '';

  constructor(private fb: FormBuilder, private ps: PromptService, private router: Router) {}

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.serverError = '';
    const val = this.form.value;
    this.ps.createPrompt({ title: val.title!, content: val.content!, complexity: Number(val.complexity) }).subscribe({
      next: (p) => this.router.navigate(['/prompts', p.id]),
      error: (e) => {
        this.serverError = e.error?.errors
          ? Object.values(e.error.errors).join(' ')
          : 'Failed to save prompt. Please try again.';
        this.submitting = false;
      },
    });
  }
}
