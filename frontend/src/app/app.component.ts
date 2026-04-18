import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav>
      <a class="brand" routerLink="/prompts">📚 Prompt Library</a>
      <a routerLink="/prompts" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">All Prompts</a>
      <a routerLink="/add-prompt" routerLinkActive="active">+ Add Prompt</a>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
