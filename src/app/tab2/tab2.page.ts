import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonButton, IonSpinner, IonToolbar, IonTextarea } from '@ionic/angular/standalone';
import { GeminiService } from 'src/services/gemini-service/gemini.service';
import { MarkdownModule } from 'ngx-markdown';

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
  imports: [IonHeader, 
    IonButton,
    IonSpinner,
    IonTextarea,
    IonToolbar,
    CommonModule,
    FormsModule,
    MarkdownModule,
    IonContent
  ]
})
export class Tab2Page {
  private geminiService = inject(GeminiService);

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: Message[] = [];
  isLoading: boolean = false;
  newMessage: string = '';
  plantType: string = 'Aglaonema';

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
    this.scrollToBottom(); // Scroll per il messaggio dell'utente

    this.isLoading = true;
    this.geminiService.generateText(messageText, this.plantType).subscribe({
      next: (response) => {
        const geminiResponse = response.candidates[0].content.parts[0].text;
        this.messages.push({
          content: geminiResponse,
          sender: 'gemini',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom(); // <-- AGGIUNGI QUESTA RIGA
      },
      error: (err) => {
        console.error('Errore durante la chiamata a Gemini:', err);
        this.messages.push({
          content: 'Oops! Qualcosa è andato storto. Riprova.',
          sender: 'gemini',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom(); // <-- AGGIUNGI QUESTA RIGA ANCHE QUI
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        const scrollElement = this.chatContainer.nativeElement;
        scrollElement.scrollTop = scrollElement.scrollHeight;
      } catch (err) {
        console.error('Errore durante lo scrolling:', err);
      }
    }, 100);
  }

  trackByMessage(index: number, message: Message): number {
    return message.timestamp.getTime(); 
  }
}