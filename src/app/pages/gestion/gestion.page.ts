import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuotesService, Cita } from '../../services/quotes.service';
import { QuoteCardComponent } from '../../components/quote-card/quote-card.component';

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, ReactiveFormsModule, QuoteCardComponent],
  templateUrl: './gestion.page.html',
})
export class GestionPage implements OnInit {
  citas: Cita[] = [];
  form: FormGroup;

  constructor(
    private quotesService: QuotesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      frase: ['', [Validators.required, Validators.minLength(5)]],
      autor: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  async ngOnInit() {
    await this.quotesService.inicializar();
    await this.cargarCitas();
  }

  async cargarCitas() {
    this.citas = await this.quotesService.getCitas();
  }

  async agregar() {
    if (this.form.invalid) return;
    await this.quotesService.agregarCita(this.form.value);
    this.form.reset();
    await this.cargarCitas();
  }

  async onEliminar(id: number) {
    await this.quotesService.eliminarCita(id);
    await this.cargarCitas();
  }
}