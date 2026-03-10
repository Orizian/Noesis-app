import { DIFFICULTY_CONFIG, DEPTH_CONFIG, SCOPE_CONFIG } from './courseTagConfig';

function DotTag({ label, value, config }) {
  const level = value - 1;
  const dotColor = config.dotColors[level];
  const textLabel = config.labels[level];

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-zinc-500 mr-0.5">{label}</span>
      {config.labels.map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i <= level ? dotColor : 'bg-zinc-700'}`}
        />
      ))}
      <span className={`text-xs ${config.colors[level]} ml-0.5`}>{textLabel}</span>
    </div>
  );
}

export default function DotTagRow({ difficulty, depth, scope }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      <DotTag label="Difficulty" value={difficulty} config={DIFFICULTY_CONFIG} />
      <DotTag label="Depth" value={depth} config={DEPTH_CONFIG} />
      <DotTag label="Scope" value={scope} config={SCOPE_CONFIG} />
    </div>
  );
}