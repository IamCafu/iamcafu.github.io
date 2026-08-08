import type {
  ProjectPoint,
  Project as ProjectType,
} from '@/data/resume/projects';

import ProjectDetail from './ProjectDetail';
import ProjectMetrics from './ProjectMetrics';

interface ProjectProps {
  data: ProjectType;
}

interface DetailBlock {
  label: string;
  items: ProjectPoint[];
}

/**
 * Names only the blocks the project actually has: 'Contribution',
 * 'Contribution & outcomes', 'Contribution, challenges & outcomes'. A fixed
 * label would promise sections a sparser project does not carry.
 */
function summarizeBlocks(labels: string[]) {
  const [first, ...rest] = labels;

  if (rest.length === 0) {
    return first;
  }

  const lowered = rest.map((label) => label.toLowerCase());
  const last = lowered.pop() as string;

  return lowered.length > 0
    ? `${first}, ${lowered.join(', ')} & ${last}`
    : `${first} & ${last}`;
}

export default function Project({ data }: ProjectProps) {
  const { challenges, contribution, outcomes } = data;

  const blocks: DetailBlock[] = [
    ...(contribution.length > 0
      ? [{ label: 'Contribution', items: contribution }]
      : []),
    ...(challenges?.length ? [{ label: 'Challenges', items: challenges }] : []),
    ...(outcomes?.length ? [{ label: 'Outcomes', items: outcomes }] : []),
  ];

  return (
    <li className="project-item">
      <header className="project-item-header">
        <h4 className="project-item-title">
          {data.link ? <a href={data.link}>{data.title}</a> : data.title}
        </h4>
        {data.dateLabel ? (
          <time className="project-item-date" dateTime={data.date}>
            {data.dateLabel}
          </time>
        ) : null}
      </header>

      {data.role ? <p className="project-item-role">{data.role}</p> : null}
      <p className="project-item-overview">{data.overview}</p>
      {data.attribution ? (
        <p className="project-item-attribution">{data.attribution}</p>
      ) : null}

      {data.metrics?.length ? <ProjectMetrics data={data.metrics} /> : null}

      {data.tech?.length ? (
        <ul className="project-item-tech">
          {data.tech.map((item) => (
            <li className="tech-tag" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Native <details> keeps the section scannable without shipping JS to a
          statically exported page, and stays keyboard- and search-accessible. */}
      {blocks.length > 0 ? (
        <details className="project-item-details">
          <summary className="project-item-summary">
            {summarizeBlocks(blocks.map((block) => block.label))}
          </summary>
          <div className="project-item-detail-body">
            {blocks.map((block) => (
              <ProjectDetail
                items={block.items}
                key={block.label}
                label={block.label}
              />
            ))}
          </div>
        </details>
      ) : null}
    </li>
  );
}
