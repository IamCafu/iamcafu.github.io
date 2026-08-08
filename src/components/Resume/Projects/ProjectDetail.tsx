import { type ProjectPoint, projectPointText } from '@/data/resume/projects';

interface ProjectDetailProps {
  label: string;
  items: ProjectPoint[];
}

/** A bullet is either plain text or segments, some of which are links. */
function renderPoint(point: ProjectPoint) {
  if (typeof point === 'string') {
    return point;
  }

  return point.map((segment) =>
    typeof segment === 'string' ? (
      segment
    ) : (
      <a href={segment.link} key={segment.link}>
        {segment.text}
      </a>
    ),
  );
}

/**
 * One labelled block of bullets inside a project's expanded detail —
 * Contribution, Challenges, or Outcomes.
 */
export default function ProjectDetail({ label, items }: ProjectDetailProps) {
  return (
    <div className="project-detail">
      <h5 className="project-detail-label">{label}</h5>
      <ul className="project-detail-points">
        {items.map((item) => (
          <li key={projectPointText(item)}>{renderPoint(item)}</li>
        ))}
      </ul>
    </div>
  );
}
