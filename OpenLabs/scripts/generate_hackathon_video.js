import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputFile = path.join(projectRoot, "OpenLabs_Hackathon_Demo_3Min.webm");

console.log("==========================================================");
console.log("🚀 OpenLabs AI — Automated Hackathon Video Generator");
console.log("==========================================================");
console.log(`Target Video Destination: ${outputFile}`);
console.log("Launching Headless Chrome Renderer Pipeline...\n");

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const targetUrl = "http://localhost:5173/recorder.html?autorecord=true&speed=2.5";
const profileDir = "/tmp/chrome_video_recorder_profile";

try {
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }
} catch (e) {}

const chromeArgs = [
  "--headless=new",
  `--user-data-dir=${profileDir}`,
  "--no-sandbox",
  "--disable-gpu",
  "--autoplay-policy=no-user-gesture-required",
  "--allow-file-access-from-files",
  "--window-size=1920,1080",
  targetUrl,
];

const chromeProcess = spawn(chromePath, chromeArgs, {
  stdio: ["ignore", "pipe", "pipe"],
});

chromeProcess.stdout.on("data", (d) => {
  const msg = d.toString();
  if (msg.includes("AutoRecord") || msg.includes("Video saved")) {
    console.log(`[Chrome] ${msg.trim()}`);
  }
});

chromeProcess.stderr.on("data", (d) => {
  // Silence harmless GPU warnings
  const err = d.toString();
  if (err.includes("Video saved to disk")) {
    console.log(`[Renderer] ${err.trim()}`);
  }
});

console.log("Recording video in progress at 2.5x speed (~88 seconds)...");
let elapsed = 0;
const interval = setInterval(() => {
  elapsed += 5;
  process.stdout.write(`⏳ Recording: ${elapsed}s / ~90s\r`);

  if (fs.existsSync(outputFile)) {
    const stats = fs.statSync(outputFile);
    if (stats.size > 100000) {
      clearInterval(interval);
      console.log(`\n\n🎉 SUCCESS! Video generated and saved:`);
      console.log(`📁 File: ${outputFile}`);
      console.log(`📦 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      chromeProcess.kill();
      process.exit(0);
    }
  }

  if (elapsed > 115) {
    clearInterval(interval);
    console.log("\nTimed out waiting for file. Checking status...");
    chromeProcess.kill();
    process.exit(0);
  }
}, 5000);
