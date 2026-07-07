let translateFn: ((text: string, targetLang: string) => Promise<string>) | null = null;

async function getTranslator() {
  if (!translateFn) {
    const { translate } = await import("@vitalets/google-translate-api");
    translateFn = async (text: string, targetLang: string) => {
      const result = await translate(text, { to: targetLang });
      return result.text;
    };
  }
  return translateFn;
}

export async function translateToKorean(text: string): Promise<string> {
  try {
    const translate = await getTranslator();
    return await translate(text, "ko");
  } catch {
    return text;
  }
}

export async function translateBullets(
  bullets: string[],
  sourceLang = "en",
): Promise<string[]> {
  const needsTranslation = bullets.some((b) => /[a-zA-Z]/.test(b) && !/[\uAC00-\uD7AF]/.test(b));
  if (!needsTranslation) return bullets;

  try {
    const translate = await getTranslator();
    const results = await Promise.allSettled(
      bullets.map((b) => translate(b, "ko")),
    );
    return results.map((r, i) => (r.status === "fulfilled" ? r.value : bullets[i]));
  } catch {
    return bullets;
  }
}
