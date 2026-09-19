import { defineMdastPlugin } from 'satteri';

// [[proj!name]] or [[proj!name|label]]
const RE = /\[\[proj!([^\]|]+)(?:\|([^\]]+))?\]\]/g;

const toId = (s) => s.trim().toLowerCase().replace(/\s+/g, '-');

export const wikilinks = defineMdastPlugin({
  name: 'wikilinks-button',
  text(node, ctx) {
    if (!node.value.includes('[[proj!')) return;

    const out = [];
    let last = 0;
    let matched = false;
    let m;
    RE.lastIndex = 0;

    while ((m = RE.exec(node.value))) {
      matched = true;
      if (m.index > last) {
        out.push({ type: 'text', value: node.value.slice(last, m.index) });
      }
      const target = m[1].trim();
      const label = (m[2] ?? m[1]).trim();
      out.push({
        type: 'wikilinkButton',
        data: {
          hName: 'button',
          hProperties: {
            type: 'button',
            className: ['wikilink'],
            dataProjectLink: toId(target),
          },
        },
        children: [{ type: 'text', value: label }],
      });
      last = m.index + m[0].length;
    }

    if (!matched) return;

    if (last < node.value.length) {
      out.push({ type: 'text', value: node.value.slice(last) });
    }
    ctx.replaceNode(node, out);
  },
});
