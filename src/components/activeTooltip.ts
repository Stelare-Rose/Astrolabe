import { writable } from 'svelte/store';

export const activeTooltip = writable<string | null>(null);
