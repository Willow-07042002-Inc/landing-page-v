export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  authorRole: string;
  excerpt: string;
  metaDescription: string;
  tags: string[];
  coverImage: string;
  content: string;
}

// Simple YAML frontmatter parser (no external deps needed)
function parseFrontmatter(raw: string): { data: Record<string, string | string[]>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const frontmatter = match[1];
  const content = match[2];
  const data: Record<string, string | string[]> = {};

  for (const line of frontmatter.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Handle arrays like ["tag1", "tag2"]
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''));
      continue;
    }

    // Remove surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content };
}

// Eagerly import all markdown files as raw strings
const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function loadAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const path in modules) {
    const raw = modules[path];
    const { data, content } = parseFrontmatter(raw);

    posts.push({
      slug: String(data.slug ?? ''),
      title: String(data.title ?? ''),
      date: String(data.date ?? ''),
      author: String(data.author ?? ''),
      authorRole: String(data.authorRole ?? ''),
      excerpt: String(data.excerpt ?? ''),
      metaDescription: String(data.metaDescription ?? ''),
      tags: Array.isArray(data.tags) ? data.tags : [],
      coverImage: String(data.coverImage ?? ''),
      content,
    });
  }

  // Newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Cached so we don't re-parse on every call
let _cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (!_cache) _cache = loadAllPosts();
  return _cache;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00'); // avoid timezone shifts
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
