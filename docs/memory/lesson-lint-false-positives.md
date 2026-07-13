# Lesson: Verify lint findings before "fixing" them

**What happened:** ESLint `jsx-a11y/alt-text` reported missing alt props at `admin/about/page.tsx:451` and `admin/settings/page.tsx:349`. Investigation showed both were `<Image size={n} />` — the **lucide-react icon component**, not an image element. The real `<img>` tags nearby already had alt text.

**Why it mattered:** Blindly "adding alt props" to an icon component would have produced invalid props and masked the real cause. The correct fix was aliasing the import (`Image as ImageIcon`), which also prevents future recurrences.

**How it was solved:** Read the actual source lines before fixing; aliased the lucide import in both files; verified the warnings disappeared on lint re-run (52→39 problems).
