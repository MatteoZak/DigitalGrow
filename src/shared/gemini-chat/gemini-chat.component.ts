import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from 'src/services/gemini-service/gemini.service';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-gemini-chat',
  templateUrl: './gemini-chat.component.html',
  styleUrls: ['./gemini-chat.component.scss'],
})
export class GeminiChatComponent {

  private geminiService = inject(GeminiService);

  prompt: string = '';
  geminiResponse: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  callGeminiApi() {
    if (!this.prompt.trim()) return;

    this.isLoading = true;
    this.error = null;
    this.geminiResponse = '';

    this.geminiService.generateText(this.prompt).subscribe({
      next: (response) => {
        // La risposta di Gemini è annidata, estrai il testo
        this.geminiResponse = response.candidates[0].content.parts[0].text;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore durante la chiamata a Gemini:', err);
        this.error = 'Si è verificato un errore. Controlla la console per i dettagli.';
        this.isLoading = false;
      }
    });
  }

}
