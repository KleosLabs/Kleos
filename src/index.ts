import { readFileSync } from "fs";
import { join } from "path";
import { analyzeScroll } from "./modules/scrollEngine";
import { WalletActivity, BehaviorPattern } from "./types";

const labelMap: Record<string, string> = {
  "RaydiumXYZ": "Raydium",
  "JupiterX": "Jupiter",
  "BONKPool": "BONK",
};

const dataPath = join(__dirname, "data", "mock-wallet.json");
const fileContent = readFileSync(dataPath, "utf-8");
let walletData: WalletActivity[] = JSON.parse(fileContent);

walletData = walletData.map((tx) => ({
  ...tx,
  programId: labelMap[tx.programId] || tx.programId,
}));

const patterns: BehaviorPattern[] = analyzeScroll(walletData);

console.log("📜 Kleos Scroll\n");

if (patterns.length === 0) {
  console.log("🕸️ No interpretable patterns detected.\n");
} else {
  for (const pattern of patterns) {
    console.log(`🧠 Type: ${pattern.type}`);
    console.log(`   Confidence: ${pattern.confidence}`);
    console.log(`   Summary: ${pattern.summary}`);
    console.log(`   Tags: ${pattern.tags.join(", ")}`);
    console.log();
  }
}
