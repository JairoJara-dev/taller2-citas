import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface Cita {
  id?: number;
  frase: string;
  autor: string;
}

const STORAGE_KEY = 'citas_app';

const CITAS_INICIALES: Cita[] = [
  { id: 1, frase: 'El que quiere hacerlo encuentra un camino, el que no quiere hacerlo encuentra una excusa.', autor: 'Sun Tzu' },
  { id: 2, frase: 'La guerra es el arte de destruir al enemigo conservando las propias fuerzas.', autor: 'Napoleón Bonaparte' },
  { id: 3, frase: 'No hay camino a la victoria, la victoria es el camino.', autor: 'Erwin Rommel' },
];

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private inicializado = false;
  private esWeb = Capacitor.getPlatform() === 'web';

  async inicializar() {
    if (this.inicializado) return;

    if (this.esWeb) {
      // En web usamos localStorage
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(CITAS_INICIALES));
      }
    } else {
      // En dispositivo usamos SQLite
      this.db = await this.sqlite.createConnection('citas_db', false, 'no-encryption', 1, false);
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS citas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          frase TEXT NOT NULL,
          autor TEXT NOT NULL
        );
      `);
      const result = await this.db.query('SELECT COUNT(*) as total FROM citas;');
      const total = result.values?.[0]?.total ?? 0;
      if (total === 0) {
        for (const c of CITAS_INICIALES) {
          await this.db.run('INSERT INTO citas (frase, autor) VALUES (?, ?);', [c.frase, c.autor]);
        }
      }
    }

    this.inicializado = true;
  }

  async getCitas(): Promise<Cita[]> {
    if (this.esWeb) {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    const result = await this.db.query('SELECT * FROM citas;');
    return result.values ?? [];
  }

  async agregarCita(cita: Cita): Promise<void> {
    if (this.esWeb) {
      const citas = await this.getCitas();
      const nuevaId = citas.length > 0 ? Math.max(...citas.map(c => c.id!)) + 1 : 1;
      citas.push({ ...cita, id: nuevaId });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(citas));
    } else {
      await this.db.run('INSERT INTO citas (frase, autor) VALUES (?, ?);', [cita.frase, cita.autor]);
    }
  }

  async eliminarCita(id: number): Promise<void> {
    if (this.esWeb) {
      const citas = await this.getCitas();
      const filtradas = citas.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
    } else {
      await this.db.run('DELETE FROM citas WHERE id = ?;', [id]);
    }
  }

  async getCitaAleatoria(): Promise<Cita | null> {
    const citas = await this.getCitas();
    if (citas.length === 0) return null;
    return citas[Math.floor(Math.random() * citas.length)];
  }
}