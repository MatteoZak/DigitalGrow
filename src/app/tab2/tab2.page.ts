// File: tab2.page.ts (versione pulita e corretta)

import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonFooter } from '@ionic/angular/standalone';
import { GeminiService } from 'src/services/gemini-service/gemini.service';

export interface Message {
  content: string;
  sender: 'user' | 'gemini';
  timestamp: Date;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    // I componenti standalone non necessitano di importare i loro tag di layout qui
  ]
})
export class Tab2Page {
  @ViewChild(IonContent) private content!: IonContent;

  messages: Message[] = [];
  isLoading: boolean = false;
  newMessage: string = '';

  private geminiService = inject(GeminiService);

  constructor() {
    this.messages.push({
      content: 'Ciao! Sono DigitalGrow, come posso aiutarti oggi?',
      sender: 'gemini',
      timestamp: new Date()
    });
  }

  sendMessage() {
    const messageText = this.newMessage.trim();
    if (this.isLoading || !messageText) return;

    this.messages.push({
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    });
    this.newMessage = '';
    this.scrollToBottom();

    this.isLoading = true;
    this.geminiService.generateText(messageText).subscribe({
      next: (response) => {
        const geminiResponse = response.candidates[0].content.parts[0].text;
        this.messages.push({
          content: geminiResponse,
          sender: 'gemini',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Errore durante la chiamata a Gemini:', err);
        this.messages.push({
          content: 'Oops! Qualcosa è andato storto. Riprova.',
          sender: 'gemini',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => this.content?.scrollToBottom(300), 100);
  }
}