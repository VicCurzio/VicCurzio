/**
 * Genera assets/avatar.png, la figura que acompania el "About me" del README.
 *
 * El dibujo no se inventa: es el mismo personaje del opening del portfolio.
 * Los mapas de pixeles viven en scripts/sprites.json, copiados de
 * src/components/retro/pixelArt.ts del repositorio del portfolio. Si alla el
 * dibujo cambia, hay que volver a copiarlos y correr esto.
 *
 * Uso: npm run avatar
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const WIDTH = 360;
const HEIGHT = 420;

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "scripts/avatar.html");
const target = resolve(root, "assets/avatar.png");

let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
} catch (error) {
  console.error("No pude abrir Chrome. playwright-core usa el Chrome instalado en la maquina.");
  console.error(String(error.message).split("\n")[0]);
  process.exit(1);
}

const sprites = JSON.parse(readFileSync(resolve(root, "scripts/sprites.json"), "utf8"));

const page = await browser.newPage();
await page.setViewportSize({ width: WIDTH, height: HEIGHT });
// Un fetch() desde file:// lo bloquea el navegador, asi que los mapas entran
// como variable antes de que la pagina corra.
await page.addInitScript((data) => { window.__SPRITES = data; }, sprites);
await page.goto(pathToFileURL(source).href);
// El dibujo se arma leyendo sprites.json, asi que hay que esperar a que
// termine: una captura antes de eso sale con el marco vacio.
await page.waitForFunction(() => document.body.dataset.ready === "1");
await page.screenshot({ path: target, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
await browser.close();

const bytes = readFileSync(target);
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width !== WIDTH || height !== HEIGHT) {
  console.error(`El avatar salio en ${width}x${height} y tiene que ser ${WIDTH}x${HEIGHT}.`);
  process.exit(1);
}
console.log(`assets/avatar.png  ${width}x${height}  ${Math.round(bytes.length / 1024)} KB`);
