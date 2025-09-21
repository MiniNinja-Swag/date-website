import React, { useMemo, useState } from 'react';
import { putFile, toBase64 } from '../utils/github';

// TODO: set these:
const OWNER = 'your-github-username';
const REPO = 'your-repo-name';

function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function Editor() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [tags, setTags] = useState('');
    const [cover, setCover] = useState(null);
    const [images, setImages] = useState([]);
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');

    const baseSlug = useMemo(() => slugify(title || 'untitled'), [title]);
    const folder = useMemo(() => `public/images/${date}-${baseSlug}`, [date, baseSlug]);
    const mdPath = useMemo(() => `src/content/${date}-${baseSlug}.md`, [date, baseSlug]);

    async function uploadOne(file, path) {
        const b64 = await toBase64(file);
        return putFile({
            owner: OWNER,
            repo: REPO,
            path,
            message: `chore: upload image ${path}`,
            contentBase64: b64,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setStatus('Uploading images…');
            let coverPath = '';

            if (cover) {
                const coverPathRel = `${folder}/cover-${cover.name}`.replace(/^public\//, 'public/');
                await uploadOne(cover, coverPathRel);
                coverPath = coverPathRel;
            }

            for (const f of images) {
                await uploadOne(f, `${folder}/${f.name}`);
            }

            setStatus('Creating markdown…');
            const fm = [
                '---',
                `title: ${title || 'Untitled'}`,
                `date: ${date}`,
                tags.trim() ? `tags: [${tags.split(',').map(t => t.trim()).filter(Boolean).join(', ')}]` : null,
                coverPath ? `cover: ${coverPath}` : null,
                '---',
                '',
            ].filter(Boolean).join('\n');

            const markdown = fm + (body ? `\n${body}\n` : '\nWrite about your date here!\n');
            const mdB64 = btoa(unescape(encodeURIComponent(markdown)));

            await putFile({
                owner: OWNER,
                repo: REPO,
                path: mdPath,
                message: `feat(post): ${date} ${title}`,
                contentBase64: mdB64,
            });

            setStatus('✅ Post published to main!');
        } catch (err) {
            console.error(err);
            setStatus('❌ ' + err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <label>Title <input value={title} onChange={e => setTitle(e.target.value)} required /></label>
            <label>Date <input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
            <label>Tags (comma-separated) <input value={tags} onChange={e => setTags(e.target.value)} /></label>

            <label>Cover image
                <input type="file" accept="image/*" onChange={e => setCover(e.target.files[0] || null)} />
            </label>

            <label>Gallery images (optional)
                <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files || []))} />
            </label>

            <label>Body (Markdown)
                <textarea rows={10} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your story…" />
            </label>

            <button type="submit">Publish</button>
            <div aria-live="polite">{status}</div>
            <p style={{ fontSize: 12, opacity: .7 }}>
                Files at: <code>{mdPath}</code> and <code>{folder}/...</code>
            </p>
        </form>
    );
}
