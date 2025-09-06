import { jsonrepair } from "jsonrepair";

export function repairJSON(rawLlamaOutput) {
    //console.log("🔧 Repairing LLaMA JSON output...", rawLlamaOutput);
  try {
    const fixed = jsonrepair(rawLlamaOutput);
    return JSON.parse(fixed);
  } catch (e1) {
    console.warn("⚠️ jsonrepair failed, trying manual fallback...", e1.message);

    // Try naive patch: add a closing bracket
    try {
      const patched = rawLlamaOutput.trim() + "}";
      return JSON.parse(patched);
    } catch (e2) {
      console.error("❌ Manual patch also failed:", e2.message);
      return null;
    }
  }
}