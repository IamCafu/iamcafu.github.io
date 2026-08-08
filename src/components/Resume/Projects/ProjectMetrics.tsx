import type { ProjectMetric } from '@/data/resume/projects';

interface ProjectMetricsProps {
  data: ProjectMetric[];
}

/** Headline figures for a project, shown above the fold on the card. */
export default function ProjectMetrics({ data }: ProjectMetricsProps) {
  return (
    <dl className="project-metrics">
      {data.map((metric) => (
        <div className="project-metric" key={metric.label}>
          <dt className="project-metric-value">{metric.value}</dt>
          <dd className="project-metric-label">{metric.label}</dd>
        </div>
      ))}
    </dl>
  );
}
