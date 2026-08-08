# CV

The text CV, kept in this repo so it stays in step with the site.

## Source of truth

The website is the detailed record; this CV is its summary. When they disagree,
the site wins. The CV content maps onto site data as follows:

| CV section                | Site source                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| Experience bullets        | `src/data/resume/work.ts` (scope) + `src/data/resume/projects.ts` (detail) |
| Skills                    | `src/data/resume/skills.ts`                                                |
| Education                 | `src/data/resume/degrees.ts`                                               |
| Posters and Presentations | `src/data/resume/presentations.ts`                                         |

Two rules carried over from the site data and worth keeping:

- **No internal names.** Repository names, internal system names, customer sites,
  and unit serial numbers stay out. Scanner model names and measured figures are
  cleared for publication.
- **No unearned claims.** Spatial calibration (camera intrinsics and
  camera–LiDAR extrinsics) was a colleague's work; the CV claims the temporal
  side only, matching the site.

## Building

Needs a LaTeX distribution with `fontawesome5` and `textpos` (TeX Live full, or
`texlive-latex-extra` plus `texlive-fonts-extra` on Debian/Ubuntu).

```bash
cd cv
pdflatex resume_faangpath.tex
```

`resume.cls` is the custom class the document depends on; `photo.jpg` is the
header portrait. Both must sit next to the `.tex` file.

Build artifacts (`.aux`, `.log`, `.out`) are gitignored. The generated PDF is
not — commit it when you want the built CV available alongside the source.
