import { useEffect, useState } from "react";
import {
  fetchBoardMembers,
  fetchMeetings,
  fetchResolutions,
  voteOnResolution,
  type BoardMember,
  type Meeting,
  type Resolution,
  type VoteChoice,
} from "./api";

export function App() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBoardMembers(), fetchMeetings(), fetchResolutions()])
      .then(([m, mt, r]) => {
        setMembers(m);
        setMeetings(mt);
        setResolutions(r);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load data"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleVote(id: string, choice: VoteChoice) {
    setError(null);
    try {
      const updated = await voteOnResolution(id, choice);
      setResolutions((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Vote failed");
    }
  }

  return (
    <div className="page">
      <header className="masthead">
        <div className="brand">
          <span className="brand-mark">A·J</span>
          <div>
            <h1>A-J Studio</h1>
            <p>Corporate Governance Portal</p>
          </div>
        </div>
      </header>

      {error && <div className="banner error">{error}</div>}
      {loading && <div className="banner">Loading governance data…</div>}

      <main className="grid">
        <section className="card">
          <h2>Board of Directors</h2>
          <ul className="member-list">
            {members.map((m) => (
              <li key={m.id}>
                <span className="avatar">{initials(m.name)}</span>
                <div>
                  <strong>{m.name}</strong>
                  <span className="muted">{m.role}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Meetings</h2>
          <ul className="meeting-list">
            {meetings.map((mt) => (
              <li key={mt.id}>
                <div>
                  <strong>{mt.title}</strong>
                  <span className="muted">{mt.date}</span>
                </div>
                <span className={`pill ${mt.status}`}>{mt.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card wide">
          <h2>Resolutions</h2>
          <div className="resolutions">
            {resolutions.map((r) => (
              <article key={r.id} className="resolution">
                <div className="resolution-head">
                  <h3>{r.title}</h3>
                  <span className={`pill ${r.status}`}>{r.status}</span>
                </div>
                <p className="muted">{r.description}</p>
                <div className="tally">
                  <span className="for">For: {r.votesFor}</span>
                  <span className="against">Against: {r.votesAgainst}</span>
                </div>
                <div className="actions">
                  <button
                    type="button"
                    className="btn for"
                    disabled={r.status !== "open"}
                    onClick={() => handleVote(r.id, "for")}
                  >
                    Vote For
                  </button>
                  <button
                    type="button"
                    className="btn against"
                    disabled={r.status !== "open"}
                    onClick={() => handleVote(r.id, "against")}
                  >
                    Vote Against
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="foot">
        <span>
          Majority of the five-member board is required to pass a resolution.
        </span>
      </footer>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
