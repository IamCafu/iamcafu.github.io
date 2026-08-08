import type { Project as ProjectType } from '@/data/resume/projects';

import Project from './Projects/Project';

interface ProjectsProps {
  data: ProjectType[];
}

export default function Projects({ data }: ProjectsProps) {
  // A bare heading over nothing reads as a mistake, and the nav link would
  // point at an empty anchor. `ResumeNav` drops its link on the same condition.
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="projects-resume">
      <div className="title">
        <h3>Projects</h3>
      </div>
      <ul className="project-list">
        {data.map((project) => (
          <Project data={project} key={project.title} />
        ))}
      </ul>
    </div>
  );
}
