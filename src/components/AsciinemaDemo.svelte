<script lang="ts">
  import { onMount } from 'svelte';
  import 'asciinema-player/dist/bundle/asciinema-player.css';

  export let src: string;
  export let title = 'Terminal recording';
  export let autoplay: boolean | string = false;
  export let controls: boolean | string | undefined = undefined;
  export let loop: boolean | string = false;
  export let speed: number | undefined = undefined;
  export let poster: string | undefined = undefined;
  export let cols: number | undefined = undefined;
  export let rows: number | undefined = undefined;
  export let fontSize: string | undefined = undefined;
  export let maxWidth: string | undefined = undefined;

  const truthy = (v: boolean | string) => v === true || v === 'true';

  let mountEl: HTMLElement;
  let narrow = false;

  onMount(() => {
    let player: any;
    let cancelled = false;

    // Show a hint on narrow screens, and keep it in sync on rotate/resize
    const mq = window.matchMedia('(max-width: 800px) and (pointer: coarse)');
    narrow = mq.matches;
    const onChange = (e: MediaQueryListEvent) => (narrow = e.matches);
    mq.addEventListener('change', onChange);

    async function init() {
      const [{ create }] = await Promise.all([
        import('asciinema-player'),
        document.fonts.load('16px "MonaspiceNe Nerd Font Mono"'),
        document.fonts.load('16px "Noto Sans Symbols 2"', '⣿'),
      ]);
      if (cancelled) return;

      const options: Record<string, unknown> = {
        fit: 'width',
        terminalFontFamily: '"MonaspiceNe Nerd Font Mono", "Noto Sans Symbols 2", monospace',
        theme: 'starrytea',
      };
      if (truthy(autoplay)) options.autoPlay = true;
      if (truthy(loop)) options.loop = true;
      if (speed) options.speed = speed;
      if (poster) options.poster = poster;
      if (cols) options.cols = cols;
      if (rows) options.rows = rows;
      if (fontSize) options.terminalFontSize = fontSize;
      if (controls !== undefined) {
        options.controls = controls === 'auto' ? 'auto' : truthy(controls);
      }

      player = create(src, mountEl, options);
    }

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting && e.boundingClientRect.width > 0)) {
        io.disconnect();
        init();
      }
    });
    io.observe(mountEl);

    return () => {
      cancelled = true;
      io.disconnect();
      mq.removeEventListener('change', onChange);
      player?.dispose?.();
    };
  });
</script>

<div class="wrap" style:max-width={maxWidth}>
  <div
    class="player"
    bind:this={mountEl}
    role="img"
    aria-label={title}
  ></div>
  {#if narrow}
    <p class="hint">You may need to fullscreen/tilt to horizontal for this to be legible</p>
  {/if}
</div>

<style>
  .wrap {
    width: 100%;
    min-width: 0;
  }
  .player {
    width: 100%;
    min-width: 0;
    border: 2px dashed var(--border);
    box-sizing: border-box;
    border-radius: 1rem;
    overflow: hidden;
    transform: translateZ(0);
  }
  .hint {
    margin: 0.5rem 0 0;
    font-style: italic;
    font-size: 0.6em;
    color: var(--subtext);
    opacity: 0.8;
  }
</style>
