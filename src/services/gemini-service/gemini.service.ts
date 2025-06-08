import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';

export interface SensorData {
  temperature: number;
  humidity: number;
  lightIntensity: number;
  tankLevel: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private http = inject(HttpClient);
  private apiKey = environment.geminiApiKey;
  // Assicurati di usare il modello corretto, es. gemini-1.5-flash
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

  constructor() { }

  /**
   * Genera 2-3 consigli brevi e azionabili per la dashboard, usando una cache con scadenza.
   * @param plantType Il nome della pianta.
   * @param data I dati attuali dei sensori.
   */
  getDashboardTips(plantType: string, data: SensorData): Observable<string> {

    // 1. Definiamo la durata della cache in millisecondi.
    // Esempio: 1 ora = 60 minuti * 60 secondi * 1000 millisecondi
    const CACHE_TTL_MS = 3600 * 1000;

    // 2. Creiamo una chiave unica per la cache della dashboard.
    const cacheKey = `dashboardTips_${plantType.toLowerCase().replace(/\s+/g, '-')}`;
    const cachedItem = localStorage.getItem(cacheKey);

    // 3. Controlliamo se esiste qualcosa in cache.
    if (cachedItem) {
      const cachedData = JSON.parse(cachedItem);
      const now = Date.now(); // L'ora attuale in millisecondi

      // 4. Verifichiamo se la cache è scaduta confrontando i timestamp.
      if (now - cachedData.timestamp < CACHE_TTL_MS) {
        console.log(`Carico i tips per la dashboard dalla cache (ancora valida) per: ${plantType}`);
        return of(cachedData.data); // Restituiamo i dati salvati
      } else {
        console.log(`Cache per i tips della dashboard scaduta per: ${plantType}`);
      }
    }

    // 5. Se non c'è cache o è scaduta, procediamo con la chiamata API.
    console.log(`Nessuna cache valida trovata. Chiamo l'API di Gemini per i tips...`);
    
    const promptTemplate = `
      Sei un assistente per un vaso smart. Analizza i seguenti dati per una pianta di tipo "[TIPO_PIANTA]".
      Fornisci una lista puntata con 2 o 3 consigli chiave basati sui dati.
      Ogni punto deve essere molto breve e azionabile (massimo 10-15 parole).
      Inizia la risposta direttamente con la lista (usa '-' per i punti), senza frasi introduttive.
      Se tutti i valori sono perfetti, rispondi con un singolo punto: "- La tua [TIPO_PIANTA] sta benissimo, nessuna azione richiesta!".

      Dati:
      - Tipo Pianta: "[TIPO_PIANTA]"
      - Temperatura: ${data.temperature}°C
      - Umidità terreno: ${data.humidity}%
      - Intensità luce: ${data.lightIntensity} lux
      - Livello serbatoio: ${data.tankLevel}%
    `;

    const finalPrompt = promptTemplate.replace(/\[TIPO_PIANTA\]/g, plantType);
    const requestBody = { contents: [{ parts: [{ text: finalPrompt }] }] };

    return this.http.post<any>(this.apiUrl, requestBody).pipe(
      map(response => response.candidates[0].content.parts[0].text),
      tap(tipsText => {
        // 6. Creiamo il nuovo oggetto da salvare in cache con i dati e il timestamp attuale.
        const newCachedItem = {
          data: tipsText,
          timestamp: Date.now()
        };
        console.log(`Salvo i nuovi tips in cache per: ${plantType}`);
        // Lo convertiamo in stringa JSON prima di salvarlo
        localStorage.setItem(cacheKey, JSON.stringify(newCachedItem));
      })
    );
  }
  
  /**
   * Genera o recupera dalla cache una scheda di cura dettagliata per la pianta.
   * @param plantType Il nome della pianta.
   */
  getDetailedCareSheet(plantType: string): Observable<string> {
    const cacheKey = `detailedCareSheet_${plantType.toLowerCase().replace(/\s+/g, '-')}`;
    const cachedResponse = localStorage.getItem(cacheKey);

    if (cachedResponse) {
      console.log(`Carico la scheda dettagliata dalla cache per: ${plantType}`);
      return of(cachedResponse);
    }

    console.log(`Nessuna cache trovata per la scheda dettagliata di ${plantType}. Chiamo l'API...`);
    const promptTemplate = `Agisci come un botanico esperto e un giardiniere amichevole. Sto configurando un vaso tecnologico per la mia nuova pianta, che è una [TIPO_PIANTA]. Forniscimi una 'Scheda di Cura' iniziale e concisa.

ISTRUZIONI DI FORMATTAZIONE OBBLIGATORIE:
1.  Usa un titolo Markdown di livello 2 (usando '##') per la primissima riga di benvenuto. Esempio: "## 🌿 Benvenuto alla tua Pianta!".
2.  Per tutte le sezioni successive (Luce, Acqua, etc.), usa il grassetto (usando '**') per i titoli. Esempio: "**☀️ Luce:**".
3.  Assicurati che ci sia una riga vuota tra ogni sezione.

SEZIONI OBBLIGATORIE:
- Titolo di benvenuto per [TIPO_PIANTA]
- Luce
- Acqua
- Temperatura e Umidità
- Terreno e Concime
- Problemi Comuni
- Un consiglio da esperto`;

    const finalPrompt = promptTemplate.replace(/\[TIPO_PIANTA\]/g, plantType);
    const requestBody = { contents: [{ parts: [{ text: finalPrompt }] }] };

    return this.http.post<any>(this.apiUrl, requestBody).pipe(
      map(response => response.candidates[0].content.parts[0].text),
      tap(careSheetText => {
        console.log(`Salvo la scheda dettagliata in cache per: ${plantType}`);
        localStorage.setItem(cacheKey, careSheetText);
      })
    );
  }

  /**
   * Invia un prompt all'API di Gemini e restituisce la risposta.
   * @param prompt Il testo da inviare al modello.
   */
  generateText(prompt: string, plantType: string): Observable<any> {

    // 1. ISTRUZIONI DI SISTEMA (Guardrail)
    // Queste sono le regole che l'AI deve sempre seguire.
    const systemInstructions = `Sei "DigitalGrow", un assistente esperto di botanica e giardinaggio. Rispondi SOLO a domande relative a piante, cura delle piante, e giardinaggio. Se una domanda non è inerente a questi argomenti, rispondi gentilmente: "Sono specializzato solo in domande sulle piante, non posso aiutarti con questo." Non deviare mai da questo ruolo.`;

    // 2. CONTESTO SPECIFICO (La pianta dell'utente)
    // Costruiamo una stringa di contesto solo se la pianta è stata fornita.
    let specificContext = '';
    if (plantType) {
      specificContext = `Contesto sulla pianta dell'utente:
      - Nome: ${plantType}
      Rispondi tenendo conto di queste informazioni.`;
    }

    // 3. COSTRUZIONE DEL PROMPT FINALE
    // Combiniamo tutto in un unico mega-prompt.
    const finalPrompt = `
      ${systemInstructions}

      ${specificContext}

      Domanda dell'utente: "${prompt}"
    `;

    // Il corpo della richiesta ora contiene il nostro prompt ingegnerizzato
    const requestBody = {
      contents: [{
        parts: [{
          text: finalPrompt
        }]
      }]
    };

    console.log("Prompt inviato a Gemini:", finalPrompt); // Utile per il debug
    return this.http.post<any>(this.apiUrl, requestBody);
  }
}