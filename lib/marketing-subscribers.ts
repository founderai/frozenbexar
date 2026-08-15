export type Subscriber = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subscribedAt: string;
};

const REDIS_KEY = "fb:marketing-subscribers";

async function redisGet(): Promise<Subscriber[] | null> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${REDIS_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const { result } = await res.json() as { result: string | null };
    return result ? (JSON.parse(result) as Subscriber[]) : [];
  } catch (err) { console.error("[marketing] Redis GET:", err); return null; }
}

async function redisSet(data: Subscriber[]): Promise<void> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;
  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["SET", REDIS_KEY, JSON.stringify(data)]),
  });
}

export async function readSubscribers(): Promise<Subscriber[]> {
  return (await redisGet()) ?? [];
}

export async function addSubscriber(sub: Omit<Subscriber, "id" | "subscribedAt">): Promise<void> {
  const subs = await readSubscribers();
  const already = subs.some(s => s.email.toLowerCase() === sub.email.toLowerCase());
  if (already) return; // deduplicate
  subs.push({ ...sub, id: Date.now().toString(), subscribedAt: new Date().toISOString() });
  await redisSet(subs);
}

export async function deleteSubscriber(id: string): Promise<void> {
  const subs = await readSubscribers();
  await redisSet(subs.filter(s => s.id !== id));
}
