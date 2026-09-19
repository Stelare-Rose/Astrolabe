<script>
  import { onMount, onDestroy } from 'svelte';
  import 'asciinema-player/dist/bundle/asciinema-player.css';

  export let src;
  export let title = 'Terminal recording';
  export let autoplay = false;
  export let loop = false;
  export let speed = undefined;
  export let poster = undefined;
  export let fit = 'width'; // 'width' | 'height' | 'both' | false
  export let cols = undefined;
  export let rows = undefined;
  export let fontSize = undefined; // e.g. "small", "medium", "1em", "14px"
  export let maxWidth = undefined; // e.g. "480px", "40rem"

  let mountEl;
  let player;

  onMount(async () => {
    const { create } = await import('asciinema-player');

    const options = { fit };
    if (autoplay) options.autoPlay = true;
    if (loop) options.loop = true;
    if (speed) options.speed = speed;
    if (poster) options.poster = poster;
    if (cols) options.cols = cols;
    if (rows) options.rows = rows;
    if (fontSize) options.terminalFontSize = fontSize;

    options.theme = 'starrytea',
    player = create(src, mountEl, options);

    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  });

  onDestroy(() => {
    player?.dispose?.();
  });
</script>

<div
  class="asciinema-demo"
  role="group"
  aria-label={title}
  style={maxWidth ? `max-width: ${maxWidth}` : undefined}
>
  <div bind:this={mountEl}></div>
</div>

<style>
  .asciinema-demo {
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid var(--border);
    line-height: 0;
  }

  .asciinema-demo :global(.ap-player) {
    display: block;
  }
</style>
