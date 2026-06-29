import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { QuotesService, Cita } from '../../services/quotes.service';
import { SettingsService } from '../../services/settings.service';
import { QuoteCardComponent } from '../../components/quote-card/quote-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, QuoteCardComponent],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  citaAleatoria: Cita | null = null;
  puedeEliminar: boolean = false;

  constructor(
    private quotesService: QuotesService,
    private settingsService: SettingsService
  ) {}

  async ngOnInit() {
    await this.quotesService.inicializar();
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.puedeEliminar = await this.settingsService.getBorrarEnInicio();
    this.citaAleatoria = await this.quotesService.getCitaAleatoria();
  }

  async onEliminarCita(id: number) {
    await this.quotesService.eliminarCita(id);
    this.citaAleatoria = await this.quotesService.getCitaAleatoria();
  }

  async nuevaCita() {
    this.citaAleatoria = await this.quotesService.getCitaAleatoria();
  }
}