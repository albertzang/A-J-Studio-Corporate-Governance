import { ConflictError, NotFoundError } from "./errors.js";
import type {
  BoardMember,
  Meeting,
  Resolution,
  VoteChoice,
} from "./domain.js";

const boardMembers: BoardMember[] = [
  { id: "bm-1", name: "Amara Johnson", role: "Chairperson" },
  { id: "bm-2", name: "Jonas Weber", role: "Chief Executive Officer" },
  { id: "bm-3", name: "Priya Nair", role: "Independent Director" },
  { id: "bm-4", name: "Liam O'Connor", role: "Chief Financial Officer" },
  { id: "bm-5", name: "Sofia Rossi", role: "Company Secretary" },
];

const meetings: Meeting[] = [
  {
    id: "mtg-1",
    title: "Q1 Board Meeting",
    date: "2026-02-12",
    status: "completed",
  },
  {
    id: "mtg-2",
    title: "Annual General Meeting",
    date: "2026-05-20",
    status: "scheduled",
  },
  {
    id: "mtg-3",
    title: "Audit & Risk Committee",
    date: "2026-06-03",
    status: "scheduled",
  },
];

const resolutions: Resolution[] = [
  {
    id: "res-1",
    title: "Approve FY2025 Audited Financial Statements",
    description:
      "Adopt the audited financial statements for the fiscal year ending December 2025.",
    status: "open",
    votesFor: 0,
    votesAgainst: 0,
  },
  {
    id: "res-2",
    title: "Appoint New Independent Auditor",
    description:
      "Appoint Meridian & Co. as the company's independent external auditor for FY2026.",
    status: "open",
    votesFor: 0,
    votesAgainst: 0,
  },
  {
    id: "res-3",
    title: "Adopt Updated Code of Conduct",
    description:
      "Approve the revised employee and board code of conduct effective immediately.",
    status: "open",
    votesFor: 0,
    votesAgainst: 0,
  },
];

const majorityThreshold = Math.floor(boardMembers.length / 2) + 1;

export function getBoardMembers(): BoardMember[] {
  return boardMembers;
}

export function getMeetings(): Meeting[] {
  return meetings;
}

export function getResolutions(): Resolution[] {
  return resolutions;
}

export function castVote(id: string, choice: VoteChoice): Resolution {
  const resolution = resolutions.find((r) => r.id === id);
  if (!resolution) {
    throw new NotFoundError(`Resolution '${id}' not found`);
  }
  if (resolution.status !== "open") {
    throw new ConflictError(
      `Resolution '${id}' is already ${resolution.status} and cannot accept votes`,
    );
  }

  if (choice === "for") {
    resolution.votesFor += 1;
  } else {
    resolution.votesAgainst += 1;
  }

  if (resolution.votesFor >= majorityThreshold) {
    resolution.status = "passed";
  } else if (resolution.votesAgainst >= majorityThreshold) {
    resolution.status = "rejected";
  }

  return resolution;
}
