const fs = require('fs');
const path = require('path');

// Directorios y rutas
const frontendDir = path.resolve(__dirname, '..');
const envPath = path.join(frontendDir, '.env');
const envExamplePath = path.join(frontendDir, '.env.example');
const envDir = path.join(frontendDir, 'src', 'environments');

/**
 * Parser nativo de archivos .env (sin dependencias externas)
 */
function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = {};
    for (const rawLine of content.split('\n')) {
      const line = rawLine.replace(/[\r\u23ce]/g, '').trim();
      if (!line || line.startsWith('#')) continue;
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        result[key] = val;
      }
    }
    return result;
  } catch (err) {
    console.warn(`[set-env] Advertencia al leer ${filePath}:`, err.message);
    return {};
  }
}

// Cargar variables
const localEnv = parseEnv(envPath);
const exampleEnv = parseEnv(envExamplePath);

function findValue(sources, keys) {
  for (const src of sources) {
    for (const k of keys) {
      if (src && src[k] !== undefined && src[k] !== '') {
        return src[k];
      }
    }
  }
  return null;
}

const apiUrl = findValue([localEnv, process.env, exampleEnv], ['API_BASE_URL', 'API_URL', 'VITE_API_BASE_URL']) || 'http://127.0.0.1:8000';
const googleClientId = findValue([localEnv, process.env, exampleEnv], ['GOOGLE_CLIENT_ID', 'VITE_GOOGLE_CLIENT_ID']) || '';

// Garantizar existencia del directorio src/environments
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Generar environment.development.ts
const devContent = `// Archivo autogenerado por scripts/set-env.js a partir de .env
// NO EDITAR MANUALMENTE
export const environment = {
  production: false,
  apiUrl: '${apiUrl}',
  googleClientId: '${googleClientId}',
};
`;

// Generar environment.ts (producción)
const prodContent = `// Archivo autogenerado por scripts/set-env.js a partir de .env
// NO EDITAR MANUALMENTE
export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  googleClientId: '${googleClientId}',
};
`;

fs.writeFileSync(path.join(envDir, 'environment.development.ts'), devContent, 'utf8');
fs.writeFileSync(path.join(envDir, 'environment.ts'), prodContent, 'utf8');

console.log('✅ [set-env] Entornos de Angular sincronizados con éxito desde .env:');
console.log(`   • apiUrl         : ${apiUrl}`);
console.log(`   • googleClientId : ${googleClientId ? `${googleClientId.substring(0, 16)}...` : '(no configurado)'}`);
