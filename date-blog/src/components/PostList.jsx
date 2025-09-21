import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadAllPosts } from '../utils/loadPosts'


export default function PostList() {
    const [posts, setPosts] = useState([])


    useEffect(() => {
        loadAllPosts().then(setPosts)
    }, [])


    const sorted = useMemo(() => {
        return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
    }, [posts])


    return (
        <div>
            {sorted.map(p => (
                <article key={p.slug} style={{ marginBottom: '2rem' }}>
                    {p.cover && (
                        <Link to={`/post/${p.slug}`}>
                            <img src={p.cover} alt="cover" style={{ width: '100%', borderRadius: 12 }} />
                        </Link>
                    )}
                    <h2 style={{ marginBottom: 6 }}>
                        <Link to={`/post/${p.slug}`}>{p.title}</Link>
                    </h2>
                    <div style={{ fontSize: 14, opacity: 0.7 }}>
                        {new Date(p.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        {p.tags?.length ? ' · ' + p.tags.join(', ') : ''}
                    </div>
                    <p style={{ marginTop: 8 }}>{p.excerpt}</p>
                    <Link to={`/post/${p.slug}`}>Read more →</Link>
                </article>
            ))}


            {!sorted.length && <p>No posts yet. Add Markdown files to <code>src/content/</code>.</p>}
        </div>
    )
}