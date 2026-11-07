<script lang="ts">
  type Post = { slug: string; title: string; description: string; publish: string; tags: string[] };
  let { posts, tagIndex }: { posts: Post[]; tagIndex: { name: string; count: number }[] } = $props();
  import { tagColor } from '../utils/tagColor';

  let query = $state('');
  let selected = $state<string[]>([]);

  // Restore ?tag=a&tag=b&q=... from the URL
  $effect.pre(() => {
    const params = new URLSearchParams(location.search);
    selected = params.getAll('tag');
    query = params.get('q') ?? '';
  });

  // Keep the URL shareable as filters change
  $effect(() => {
    const params = new URLSearchParams();
    selected.forEach((t) => params.append('tag', t));
    if (query) params.set('q', query);
    const qs = params.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  });

  const toggle = (t: string) =>
    (selected = selected.includes(t) ? selected.filter((x) => x !== t) : [...selected, t]);

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesTags = selected.every((t) => p.tags.includes(t));
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTags && matchesQuery;
    });
  });

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { dateStyle: 'long' });
</script>

<input type="search" placeholder="Search posts…" bind:value={query} aria-label="Search posts" />

<div class="tags" role="group" aria-label="Filter by tag">
  {#each tagIndex as { name, count }}
    <button type="button" class:active={selected.includes(name)}
      style:--tag-color={tagColor(name)}
            aria-pressed={selected.includes(name)} onclick={() => toggle(name)}>
      {name} <span>{count}</span>
    </button>
  {/each}
  {#if selected.length || query}
    <button type="button" class="clear" onclick={() => { selected = []; query = ''; }}>Clear</button>
  {/if}
</div>

<p class="count">{filtered.length} of {posts.length} posts</p>

<ul class="posts">
  {#each filtered as post (post.slug)}
    <li class="post-card">
      <h2><a class="post-link" href={`/blog/${post.slug}/`}>{post.title}</a></h2>
      <time datetime={post.publish}>{fmt(post.publish)}</time>
      <p>{post.description}</p>
      <ul class="post-tags">
        {#each post.tags as t}
          <li>
            <button type="button" style:--tag-color={tagColor(t)} onclick={() => toggle(t)}>
              #{t}
            </button>
          </li>
        {/each}
      </ul>
    </li>  {:else}
    <li class="empty">No posts match.</li>
  {/each}
</ul>

<style>
  input[type='search'] {
    width: 100%;
    font: inherit;
    color: var(--ink);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: .65rem 1.1rem;
    outline: none;
  }
  input[type='search']::placeholder { color: var(--ink-dim); opacity: .7; }
  input[type='search']:focus { border-color: var(--accent); }

  .tags { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.25rem 0 .75rem; }
  .tags button {
    font-family: var(--font-heading);
    font-size: .9rem;
    color: var(--ink-soft);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: .25rem .8rem;
    cursor: pointer;
  }
  .tags button:hover { border-color: var(--tag-color); }
  .tags button.active { background-color: color-mix(in srgb, var(--tag-color) 10%, transparent); border: 1px dashed var(--tag-color); color: var(--tag-color); }
  .tags span { opacity: .65; font-size: .8em; margin-left: .15rem; }
  .tags .clear { background: none; border-style: dashed; color: var(--subtext); }

  .count { color: var(--subtext); font-size: .9rem; margin: 0 0 1rem; }


  .post-card {
    position: relative;
  }
  .post-card:hover,
  .post-card:focus-within {
    border-color: var(--accent);
  }
  .post-card:hover .post-link {
    color: var(--accent);
  }

  .post-link {
    color: var(--ink);
    text-decoration: none;
  }
  .post-link::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
  .post-link:focus-visible { outline: none; }
  .post-link:focus-visible::after {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .post-tags {
    position: relative;
    z-index: 1;
    width: fit-content;
  }
  .post-tags button {
    color: var(--tag-color, var(--accent));
  }
  .posts { list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem; }
  .posts > li {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
  }
  .posts > li:hover { border-color: var(--accent); }
  .posts h2 { margin: 0 0 .25rem; font-size: 1.35rem; color: var(--ink); }
  .posts time { color: var(--subtext); font-size: .85rem; }
  .posts p { color: var(--ink-soft); margin: .6rem 0 .8rem; line-height: 1.6; }
  .posts .empty { text-align: center; color: var(--subtext); border-style: dashed; }

  .post-tags { display: flex; flex-wrap: wrap; gap: .4rem; list-style: none; padding: 0; margin: 0; }
  .post-tags button {
    font: inherit;
    font-size: .8rem;
    color: var(--tag-color);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-weight: 500;
    font-family: var(--font-heading);
  }
  .post-tags button:hover { text-decoration: underline; }
</style>
