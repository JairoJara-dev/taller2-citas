import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Cita } from '../../services/quotes.service';

@Component({
  selector: 'app-quote-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card>
      <ion-card-content>
        <p><em>"{{ cita.frase }}"</em></p>
        <p><strong>— {{ cita.autor }}</strong></p>
        <ion-button *ngIf="mostrarEliminar" color="danger" fill="clear" (click)="onEliminar()">
          Eliminar
        </ion-button>
      </ion-card-content>
    </ion-card>
  `
})
export class QuoteCardComponent {
  @Input() cita!: Cita;
  @Input() mostrarEliminar: boolean = false;
  @Output() eliminar = new EventEmitter<number>();

  onEliminar() {
    this.eliminar.emit(this.cita.id);
  }
}