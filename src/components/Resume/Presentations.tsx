import type { Presentation } from '@/data/resume/presentations';

interface PresentationsProps {
  data: Presentation[];
}

export default function Presentations({ data }: PresentationsProps) {
  return (
    <div className="presentations">
      <div className="link-to" id="presentations" />
      <div className="title">
        <h3>Research and Presentations</h3>
      </div>
      <ul className="presentation-list">
        {data.map((presentation) => {
          const title = presentation.link ? (
            <a href={presentation.link}>{presentation.title}</a>
          ) : (
            presentation.title
          );

          return (
            <li className="presentation-item" key={presentation.title}>
              <h4>{title}</h4>
              <p>{presentation.authors}</p>
              <p>
                {presentation.event}, {presentation.location},{' '}
                <time dateTime={presentation.date}>
                  {presentation.dateLabel}
                </time>{' '}
                ({presentation.type.toLowerCase()})
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
