import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  async setBorrarEnInicio(valor: boolean): Promise<void> {
    await Preferences.set({ key: 'borrar_en_inicio', value: JSON.stringify(valor) });
  }

  async getBorrarEnInicio(): Promise<boolean> {
    const result = await Preferences.get({ key: 'borrar_en_inicio' });
    return result.value ? JSON.parse(result.value) : false;
  }
}