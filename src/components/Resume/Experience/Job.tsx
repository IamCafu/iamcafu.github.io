import dayjs from 'dayjs';

import { isDetailedHighlight, type Position } from '@/data/resume/work';

import JobSummary from './JobSummary';

interface JobProps {
  data: Position;
}

export default function Job({ data }: JobProps) {
  const {
    name,
    department,
    position,
    url,
    startDate,
    endDate,
    location,
    summary,
    highlights,
  } = data;

  return (
    <article className="jobs-container">
      <header>
        <h4>
          <a href={url}>{name}</a>
          {department ? (
            <span className="job-department">, {department}</span>
          ) : null}
        </h4>
        <p className="role">{position}</p>
        <div className="job-meta">
          <p className="daterange">
            {' '}
            <time dateTime={startDate}>
              {dayjs(startDate).format('MMMM YYYY')}
            </time>{' '}
            -{' '}
            {endDate ? (
              <time dateTime={endDate}>
                {dayjs(endDate).format('MMMM YYYY')}
              </time>
            ) : (
              'Present'
            )}
          </p>
          {location ? <p className="job-location">{location}</p> : null}
        </div>
      </header>
      {summary ? <JobSummary summary={summary} /> : null}
      {highlights ? (
        <ul className="points">
          {highlights.map((highlight) => {
            if (!isDetailedHighlight(highlight)) {
              return <li key={highlight}>{highlight}</li>;
            }

            return (
              <li key={highlight.summary}>
                {highlight.summary}
                <ul className="point-details">
                  {highlight.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}
