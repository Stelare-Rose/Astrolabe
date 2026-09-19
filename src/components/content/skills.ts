type Use = string | { project: string; label: string };
export type Skill = { name: string; used: Use[] };

const p = (label: string): Use => ({
  project: label.trim().toLowerCase().replace(/\s+/g, '-'),
  label,
});

export const skills: Record<string, Skill[]> = {
  Languages: [
    { name: 'C++', used: ['Competitive Programming'] },
    { name: 'C#', used: ['Unity Game Development', 'Campus Job Training'] },
    { name: 'TypeScript', used: [p('Pyxis'), 'Campus Job'] },
    { name: 'Rust', used: [p('Starlit'), p('Eridanus'), p('Horologium')] },
    { name: 'Golang', used: [p('Pyxis')] },
    { name: 'Dart', used: ['Campus Assignments'] },
    { name: 'Nix', used: [p('Atelier-Iris')] },
  ],
  Frameworks: [
    { name: '.NET', used: ['Campus Job Training'] },
    { name: 'React Native', used: ['Campus Job'] },
    { name: 'Flutter', used: ['Campus Assignments'] },
    { name: 'Nuxt', used: [p('Pyxis')] },
    { name: 'Svelte', used: [('This Website')] },
    { name: 'Astro', used: [('This Website')] },
  ],
  Tools: [
    { name: 'Git', used: [] },
    { name: 'Nix Devshells', used: [] },
    { name: 'Systemd', used: [] },
    { name: 'Neovim', used: [('obviously :P')] },
  ],
};
