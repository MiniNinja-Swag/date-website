import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadAllPosts } from '../utils/loadPosts'


export default function PostView() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)


    useEffect(() => {
        loadAllPosts().then(posts => setPost(posts.find(p => p.slug === slug)))
    }, [slug])


    if (!post) return <p>Loading…</p>


    return (
        <article>
            <Link to="/">← Back</Link>
            <h1>{post.title}</h1>
            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>
                {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                {post.tags?.length ? ' · ' + post.tags.join(', ') : ''}
            </div>
            {post.cover && <img src={post.cover} alt="cover" style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} />}
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
    )
}