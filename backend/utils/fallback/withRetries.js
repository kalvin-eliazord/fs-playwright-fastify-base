export async function withRetries(fn, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (err) {
      console.warn(`⚠️ Retry attempt ${i + 1} failed:`, err.message);
    }
  }
  return null;
}