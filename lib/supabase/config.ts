type SupabaseConfig = {
  url: string;
  anonKey: string;
};

const placeholderValues = new Set([
  "https://your-project-ref.supabase.co",
  "your-supabase-anon-key",
]);

function isPlaceholder(value: string) {
  return placeholderValues.has(value) || value.includes("your-project-ref") || value.includes("your-supabase");
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey || isPlaceholder(url) || isPlaceholder(anonKey)) {
    return null;
  }

  try {
    new URL(url);
  } catch {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}
