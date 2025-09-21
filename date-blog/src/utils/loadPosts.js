import matter from 'gray-matter'
import { marked } from 'marked'


// Load ALL markdown files from src/content at build time
const modules = import.meta.glob('../content/**/*.md', { as: 'raw' })


function slugify(filename) {
    return filename
        .replace(/^.*\/content\//, '') // keep after /content/
        .replace(/\.md$/, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
}


export async function loadAllPosts() {
    const entries = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
            const raw = await loader()
            const { data, content } = matter(raw)
            const html = marked.parse(content)
            const slug = data.slug || slugify(path)


            // Basic excerpt from first non-empty line
            const firstLine = content.split('\n').find(l => l.trim().length > 0) || ''
            const excerpt = firstLine.replace(/^#+\s*/, '').slice(0, 200)


            // Normalize optional cover path (relative to /public)
            const cover = data.cover?.startsWith('http')
                ? data.cover
                : (data.cover ? `/${data.cover.replace(/^\/?/, '')}` : undefined)


            return {
                slug,
                title: data.title || slug,
                date: data.date || new Date().toISOString(),
                tags: data.tags || [],
                cover,
                excerpt,
                html,
            }
        })
    )


    return entries
}