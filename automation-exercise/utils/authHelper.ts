import fs from 'fs';
import path from 'path';

const authFilePath = path.join(process.cwd(), '.auth', 'user.json');

/**
 * Zapisuje lub aktualizuje konkretny klucz w pliku .auth/user.json
 */
export function updateAuthCredentials(data: { email?: string; password?: string }) {
  // 1. Upewnij się, że katalog .auth istnieje
  const dir = path.dirname(authFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 2. Odczytaj istniejący plik lub utwórz pusty obiekt
  let currentData: { email?: string; password?: string } = {};
  if (fs.existsSync(authFilePath)) {
    try {
      const fileContent = fs.readFileSync(authFilePath, 'utf-8');
      currentData = JSON.parse(fileContent);
    } catch {
      currentData = {};
    }
  }

  // 3. Nadpisz/dodaj nowe dane do istniejącego obiektu
  const updatedData = { ...currentData, ...data };

  // 4. Zapisz zaktualizowany obiekt z powrotem do pliku
  fs.writeFileSync(authFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');
}