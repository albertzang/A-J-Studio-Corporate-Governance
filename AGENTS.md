## Cursor Cloud specific instructions

### Git workflow

Follow this until the user says otherwise. It replaces opening a pull request or pushing at the end of a turn.

- Do not open, update, or merge a pull request unless the user explicitly asks for one.
- Commit on local `main`. Leave every commit on this machine. Do not push until the user has checked the change on localhost and says "push".
- "push" ends the iteration. Squash every local commit that is not yet on `origin/main` into one commit, write a message that covers that whole iteration, then push that one commit to `main`. Do not force-push.
- The user edits this workspace from their local machine and may leave those edits uncommitted. Before starting a new round of work, and again before the squash-and-push, check the working tree. If those edits are uncommitted, commit them first with a message that describes them, then continue.

### Local review

Open the page: [http://127.0.0.1:8888/](http://127.0.0.1:8888/)

That address serves this checkout (`/workspace`). Use it for review. Saved edits to `index.html`, `assets/styles.css`, and `assets/app.js` show up on refresh.

If the address does not load, start the server once from `/workspace`:

```
python3 tools/local-server.py
```

That server sends `Cache-Control: no-cache`, so a normal reload picks up saved HTML, CSS, and JavaScript. Do not use `python3 -m http.server` for this page; it leaves the browser holding a stale stylesheet.

If port 8888 is already serving this checkout, leave that process running. Do not start a second one.

### Verifying edits

This site is a static page (`index.html`, `assets/styles.css`, `assets/app.js`).

For wording, names, links, or other copy changes, verify by reading the file and fetching [http://127.0.0.1:8888/](http://127.0.0.1:8888/), then checking that the expected strings are present. Do not take browser screenshots or screen recordings for those edits.

Open the page in a browser only when layout, styling, navigation, or another interaction changed.

### Contents navigation

The contents list includes heading levels 1 and 2 only: the numbered sections, and their subsections numbered like 2.1. Deeper headings stay on the page and are not added to the contents list. Do not raise that depth unless asked.