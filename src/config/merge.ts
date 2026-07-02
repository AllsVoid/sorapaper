function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function mergeConfig<T extends Record<string, unknown>>(defaults: T, overrides: unknown): T {
  if (!isRecord(overrides)) return defaults;

  const result: Record<string, unknown> = { ...defaults };

  for (const [key, overrideValue] of Object.entries(overrides)) {
    const defaultValue = result[key];

    if (isRecord(defaultValue) && isRecord(overrideValue)) {
      result[key] = mergeConfig(defaultValue, overrideValue);
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }

  return result as T;
}
