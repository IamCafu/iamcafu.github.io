import type { DegreeDetail, Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

function getDetailText(detail: DegreeDetail) {
  return typeof detail === 'string' ? detail : detail.text;
}

export default function Degree({ data }: DegreeProps) {
  return (
    <article className="degree-container">
      {data.logo ? (
        // Same destination as the school name below. Hidden from assistive
        // tech and skipped by tab so the link is not announced twice.
        <a
          className="degree-logo"
          href={data.link}
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* No width/height attributes: they would declare a 1:1 ratio that
              the marks do not share, and the browser sizes the box from that
              rather than the file's own proportions. */}
          {/* biome-ignore lint/performance/noImgElement: native img keeps next/image out of the static export */}
          <img src={data.logo} alt="" loading="lazy" />
        </a>
      ) : null}
      <header>
        <h4 className="degree">
          {data.degree}
          {data.field ? (
            <span className="degree-field">in {data.field}</span>
          ) : null}
        </h4>
        {/* `year` still drives the newest-first ordering check in the data
            tests; the detail list already carries the date range. */}
        <p className="school">
          <a href={data.link}>{data.school}</a>
          {data.location ? ` · ${data.location}` : null}
        </p>
        {data.details ? (
          <ul className="points">
            {data.details.map((detail) => (
              <li key={getDetailText(detail)}>
                {typeof detail === 'string' ? (
                  detail
                ) : (
                  <>
                    {detail.label ? `${detail.label} ` : null}
                    <a href={detail.link}>{detail.text}</a>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </header>
    </article>
  );
}
