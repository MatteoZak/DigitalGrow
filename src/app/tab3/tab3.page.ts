import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { qrCodeOutline, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab3Page {
  isScanning = false;
  manualCode = '';
  scannedResult: any;

  constructor(private router: Router) {
    addIcons({
      qrCodeOutline,
      arrowBack
    });
  }

  async startScan() {
    // Controlla i permessi prima di iniziare
    const permission = await BarcodeScanner.checkPermission({ force: true });
    if (!permission.granted) {
      alert('Devi concedere il permesso di usare la fotocamera per scansionare.');
      return;
    }

    // Rendi il body trasparente e avvia la scansione
    document.body.classList.add('scanner-active');
    this.isScanning = true;
    BarcodeScanner.hideBackground(); // Necessario per iOS

    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      this.scannedResult = result.content;
      console.log('Codice QR scansionato:', this.scannedResult);
      this.stopScan();
      // Qui navighi alla pagina di successo o esegui l'associazione
      // Esempio: this.router.navigate(['/device-added', this.scannedResult]);
      alert(`Vaso associato: ${this.scannedResult}`);
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.body.classList.remove('scanner-active');
    this.isScanning = false;
  }

  submitManualCode() {
    if (!this.manualCode) return;
    console.log('Codice inserito manualmente:', this.manualCode);
    // Qui navighi o esegui l'associazione
    alert(`Vaso associato: ${this.manualCode}`);
  }

  // Assicurati di fermare la scansione se l'utente lascia la pagina
  ionViewWillLeave() {
    if (this.isScanning) {
      this.stopScan();
    }
  }
}