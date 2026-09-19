<script lang="ts">
  import { computePosition, flip, shift, offset } from '@floating-ui/dom';
  import { activeTooltip } from './activeTooltip';

  type Use = string | { project: string; label: string };

  export let name: string;
  export let used: Use[] = [];

  let chip: HTMLElement;
  let tip: HTMLElement;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  $: open = $activeTooltip === name;

  async function place() {
    if (!chip || !tip) return;
    const { x, y } = await computePosition(chip, tip, {
      placement: 'top',
      strategy: 'fixed',
      middleware: [offset(6), flip(), shift({ padding: 8 })],
    });
    Object.assign(tip.style, { left: `${x}px`, top: `${y}px` });
  }

  async function show() {
    clearTimeout(closeTimer);
    activeTooltip.set(name); // automatically closes any other tooltip
    await Promise.resolve();
    place();
  }

  function hide() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      // only clear if we're still the active one
      activeTooltip.update((cur) => (cur === name ? null : cur));
    }, 120);
  }

  function go(id: string) {
    activeTooltip.set(null);
    window.dispatchEvent(new CustomEvent('show-project', { detail: id }));
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') activeTooltip.set(null);
  }

  // Attach hover/focus listeners without triggering a11y lint on non-interactive nodes
  function hoverZone(node: HTMLElement) {
    node.addEventListener('mouseenter', show);
    node.addEventListener('mouseleave', hide);
    node.addEventListener('focusin', show);
    node.addEventListener('focusout', hide);
    node.addEventListener('keydown', onKeydown);
    return {
      destroy() {
        node.removeEventListener('mouseenter', show);
        node.removeEventListener('mouseleave', hide);
        node.removeEventListener('focusin', show);
        node.removeEventListener('focusout', hide);
        node.removeEventListener('keydown', onKeydown);
      },
    };
  }
</script>

<li class="skill">
  <span class="zone" use:hoverZone>
    <button
      bind:this={chip}
      type="button"
      class="chip"
      aria-expanded={used.length ? open : undefined}
    >
      {name}
    </button>

    {#if used.length}
      <span bind:this={tip} role="tooltip" class="tip" class:open>
        {#each used as u}
          {#if typeof u === 'string'}
            <span class="tip-text">{u}</span>
          {:else}
            <button type="button" class="tip-link" on:click={() => go(u.project)}>
              {u.label}
            </button>
          {/if}
        {/each}
      </span>
    {/if}
  </span>
</li>

<style>
  .skill {
    list-style: none;
  }

  .zone {
    position: relative;
    display: inline-block;
  }

  .chip {
    font: inherit;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-alt);
    color: var(--ink);
    cursor: default;
  }

  .chip:hover,
  .chip:focus-visible {
    background: var(--surface);
  }

  .tip {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
    min-width: max-content;
    padding: 0.4rem 0.6rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 0.85em;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s ease, visibility 0.15s;
  }

  .tip.open {
    visibility: visible;
    opacity: 1;
  }

  /* invisible bridges so the pointer can cross the gap in either direction */
  .tip::before,
  .tip::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 0.5rem;
  }
  .tip::before { bottom: 100%; }
  .tip::after { top: 100%; }

  .tip-text {
    color: var(--ink-soft);
  }

  .tip-link {
    all: unset;
    cursor: pointer;
    color: var(--accent, currentColor);
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  .tip-link:hover {
    opacity: 0.8;
  }

  .tip-link:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: 0.2em;
  }
</style>
