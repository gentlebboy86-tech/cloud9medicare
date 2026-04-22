import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';

async function run() {
  console.log("Removing background...");
  try {
    const blob = await removeBackground('public/ceo-profile.png.png');
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync('public/ceo-profile.png', buffer);
    console.log("Success! Saved as ceo-profile.png");
  } catch(e) {
    console.error("Error:", e);
  }
}
run();
