# Diagrams

This project keeps diagrams **inline, in Mermaid, inside the doc they illustrate** (see [`../standards/markdown-and-diagram-standard.md`](../standards/markdown-and-diagram-standard.md)) rather than as separate exported image files — a diagram next to the prose that explains it stays in sync more easily than a detached image asset, and Mermaid source diffs cleanly in git.

This directory exists for the exceptions:

- Diagrams referenced from **more than one** doc (avoid duplicating the same Mermaid block in two files — put it here and link both ways instead).
- Any diagram that becomes large/complex enough that it's easier to review as a standalone file.

There are currently no diagrams that meet that bar — every diagram in this project lives inline in its architecture, feature, or flow doc. See [`../architecture/README.md`](../architecture/README.md) for the full index of docs containing diagrams.
