import type { SkillGroup } from '@/data/resume/skills';

interface SkillsProps {
  data: SkillGroup[];
}

/**
 * Static by design. The previous version was a client component whose reducer
 * and memoised state existed only to drive category filter buttons — which
 * filtered a list already grouped by those same categories.
 */
export default function Skills({ data }: SkillsProps) {
  return (
    <div className="skills">
      <div className="title">
        <h3>Skills</h3>
      </div>
      <div className="skill-groups">
        {data.map((group) => (
          <div className="skill-group" key={group.name}>
            <h4 className="skill-group-title">{group.name}</h4>
            <ul className="skill-tags">
              {group.skills.map((skill) => (
                <li className="skill-tag" key={skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
