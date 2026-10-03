/**
 * Genera assets/social/*.png, las imagenes que muestra GitHub cuando alguien
 * comparte el enlace de un repositorio.
 *
 * Una sola plantilla (scripts/social.html) y una tabla de contenido aca abajo,
 * para que las cinco se vean de la misma familia y agregar una sea sumar una
 * fila. El texto sale de lo que ya dicen el README y la descripcion de cada
 * repo: la tarjeta no inventa nada.
 *
 * 1280x640 es la medida que pide GitHub. Despues hay que subir cada imagen a
 * mano en Settings del repo, seccion "Social preview": no hay API para esto.
 *
 * Uso: npm run social
 */
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const WIDTH = 1280;
const HEIGHT = 640;

const CARDS = [
  {
    file: "cv-match",
    kicker: "HERRAMIENTA WEB",
    name: "cv-match",
    lead: "Armá y adaptá tu CV según el mercado al que va y según quién lo lee: una persona o un filtro automático.",
    hook: "Todo corre en el navegador. El CV nunca sale de tu máquina.",
    chips: ["React", "TypeScript", "PDF", "ATS", "300+ tests"],
  },
  {
    file: "musik",
    kicker: "APLICACION INSTALABLE",
    name: "musik",
    lead: "Reproductor que lee la música que ya está en el dispositivo. Sin cuenta, sin servidor y sin anuncios.",
    hook: "Ningún archivo sale del teléfono, y la app nunca escribe en su almacenamiento.",
    chips: ["PWA", "React", "TypeScript", "Web Audio", "MP3 FLAC WAV WMA"],
  },
  {
    file: "portfolio",
    kicker: "SITIO PERSONAL",
    name: "portfolio",
    lead: "Mi sitio, en español e inglés, con estilo de consola de 8 bits.",
    hook: "Del mismo archivo de contenido salen el sitio y once CV en PDF, uno por tipo de búsqueda.",
    chips: ["Next.js", "TypeScript", "i18n", "pixel art"],
  },
  {
    file: "plagas-out",
    kicker: "SITIO DE UN SERVICIO",
    name: "plagas-out",
    lead: "Landing de un servicio de control de plagas en La Plata, Berisso y Ensenada.",
    hook: "El formulario manda mails reales sin backend propio, y si el envío falla cae al correo del visitante.",
    chips: ["React 19", "Vite", "TypeScript", "EmailJS", "Oxlint"],
  },
  {
    file: "bot_whatsapp",
    kicker: "AUTOMATIZACION",
    name: "bot_whatsapp",
    lead: "Envío masivo de mensajes de WhatsApp desde una planilla de Excel.",
    hook: "Con interfaz gráfica para usarlo sin saber programar, y por línea de comandos para automatizarlo.",
    chips: ["Python", "Excel", "Interfaz grafica", "Linea de comandos"],
  },
];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "scripts/social.html");
mkdirSync(resolve(root, "assets/social"), { recursive: true });

let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
} catch (error) {
  console.error("No pude abrir Chrome. playwright-core usa el Chrome instalado en la maquina.");
  console.error(String(error.message).split("\n")[0]);
  process.exit(1);
}

for (const card of CARDS) {
  const target = resolve(root, `assets/social/${card.file}.png`);
  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });
  await page.addInitScript((data) => { window.__CARD = data; }, card);
  await page.goto(pathToFileURL(source).href);
  await page.waitForFunction(() => document.fonts.status === "loaded" && document.body.dataset.ready === "1");
  await page.screenshot({ path: target, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  await page.close();

  const bytes = readFileSync(target);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== WIDTH || height !== HEIGHT) {
    console.error(`${card.file} salio en ${width}x${height} y tiene que ser ${WIDTH}x${HEIGHT}.`);
    process.exit(1);
  }
  // GitHub rechaza las imagenes de mas de 1 MB.
  const kb = Math.round(bytes.length / 1024);
  if (kb > 1024) {
    console.error(`${card.file} pesa ${kb} KB y GitHub acepta hasta 1 MB.`);
    process.exit(1);
  }
  console.log(`assets/social/${card.file}.png  ${width}x${height}  ${kb} KB`);
}

await browser.close();
