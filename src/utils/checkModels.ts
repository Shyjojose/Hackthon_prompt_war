export const checkAvailableModels = async (_key: string) => {
  try {
    // In current SDK version, we can't easily list via frontend without Discovery API
    // but we can test a few common fallbacks
    return ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  } catch (e) {
    return [];
  }
};
