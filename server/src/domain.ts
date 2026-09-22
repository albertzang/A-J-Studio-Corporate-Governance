export type ResolutionStatus = "open" | "passed" | "rejected";

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

export type VoteChoice = "for" | "against";

export interface Resolution {
  id: string;
  title: string;
  description: string;
  status: ResolutionStatus;
  votesFor: number;
  votesAgainst: number;
}
