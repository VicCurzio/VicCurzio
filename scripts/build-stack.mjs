/**
 * Genera assets/stack.png, el cartel que abre el README del perfil.
 *
 * La fuente es scripts/stack.html, que usa la misma paleta y las mismas dos
 * tipografias que el portfolio (Press Start 2P y VT323). La idea es que el
 * perfil de GitHub y el sitio se vean de la misma familia, porque en un README
 * no hay CSS: la unica identidad visual posible es una imagen propia.
 *
 * PNG y no JPEG: esto es arte de pixel, con bordes duros y colores planos, y
 * el JPEG los ensucia justo ahi.
 *
 * Usa playwright-core, que NO descarga navegadores al instalarse: abre el
 * Chrome que ya esta en la maquina.
 *
 * Uso: npm run banner
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const WIDTH = 1280;
const HEIGHT = 470;

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "scripts/stack.html");
const target = resolve(root, "assets/stack.png");

let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
} catch (error) {
  console.error("No pude abrir Chrome. playwright-core no trae navegador propio: usa el Chrome instalado.");
  console.error(String(error.message).split("\n")[0]);
  process.exit(1);
}

const page = await browser.newPage();
await page.setViewportSize({ width: WIDTH, height: HEIGHT });
await page.goto(pathToFileURL(source).href);
await page.waitForFunction(() => document.fonts.status === "loaded");
await page.screenshot({ path: target, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
await browser.close();

// Mide el PNG recien escrito: el ancho y el alto viven en el chunk IHDR, que
// arranca en el byte 16. Si el viewport no se aplico, se descubre aca y no
// cuando el panel sale recortado en el perfil.
const bytes = readFileSync(target);
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);

if (width !== WIDTH || height !== HEIGHT) {
  console.error(`El panel salio en ${width}x${height} y tiene que ser ${WIDTH}x${HEIGHT}.`);
  process.exit(1);
}

console.log(`assets/stack.png  ${width}x${height}  ${Math.round(bytes.length / 1024)} KB`);
