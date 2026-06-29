import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule],
  templateUrl: './configuracion.page.html',
})
export class ConfiguracionPage implements OnInit {
  borrarEnInicio: boolean = false;

  constructor(private settingsService: SettingsService) {}

  async ngOnInit() {
    this.borrarEnInicio = await this.settingsService.getBorrarEnInicio();
  }

  async onToggleChange() {
    await this.settingsService.setBorrarEnInicio(this.borrarEnInicio);
  }
}