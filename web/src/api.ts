export interface BoardMember {
  id: string;
  name: string;
  role: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  status: "scheduled" | "completed";
}

export type ResolutionStatus = "open" | "passed" | "rejected";

export interface Resolution {
  id: string;
  title: string;
  description: string;
  status: ResolutionStatus;
  votesFor: number;
  votesAgainst: number;
}

export type VoteChoice = "for" | "against";

const BASE = "/api";

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`GET ${path} failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export function fetchBoardMembers(): Promise<BoardMember[]> {
  return getJSON<BoardMember[]>("/board-members");
}

export function fetchMeetings(): Promise<Meeting[]> {
  return getJSON<Meeting[]>("/meetings");
}

export function fetchResolutions(): Promise<Resolution[]> {
  return getJSON<Resolution[]>("/resolutions");
}

export async function voteOnResolution(
  id: string,
  choice: VoteChoice,
): Promise<Resolution> {
  const res = await fetch(`${BASE}/resolutions/${id}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ choice }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Vote failed with ${res.status}`);
  }
  return (await res.json()) as Resolution;
}
