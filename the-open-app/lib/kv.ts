import { Redis } from "@upstash/redis";
import type { Edition } from "./types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function saveEdition(ed: Edition) {
  await redis.set("edition:latest", ed);
  await redis.set(`edition:${ed.date}`, ed);
}

export async function getLatestEdition(): Promise<Edition | null> {
  return (await redis.get<Edition>("edition:latest")) ?? null;
}
