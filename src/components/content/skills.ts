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
    { name: 'SQL', used: [p('Horologium'), p('Pyxis'), 'Campus Job Training', 'Campus Assignments', 'Freelance Work'] }
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
    { name: 'Git', used: ['tbh everything like even my minecraft is synced with git'] },
    { name: 'SQLite', used: [p('Horologium'), p('Pyxis')] },
    { name: 'Postgres', used: ['Campus Assignments', 'Freelance Work'] },
    { name: 'Cloudflare Tunnels', used: [p('Homelab')] },
    { name: 'Vercel', used: ['Campus Assignments'] },
    { name: 'NixOS', used: [p('Atelier-Iris')] },
    { name: 'Systemd', used: [p('Homelab'), p('Atelier-Iris')] },
    { name: 'Neovim', used: [('obviously :P')] },
  ],
};
