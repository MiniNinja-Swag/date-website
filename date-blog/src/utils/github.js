const API = 'https://api.github.com';

export function setToken(t) {
    localStorage.setItem('gh_token', t);
}
export function getToken() {
    return localStorage.getItem('gh_token') || '';
}

async function gh(path, opts = {}) {
    const token = getToken();
    if (!token) throw new Error('Missing GitHub token. Please sign in.');
    const res = await fetch(`${API}${path}`, {
        ...opts,
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github+json',
            ...(opts.headers || {}),
        },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub ${res.status}: ${text}`);
    }
    return res.json();
}

export async function getFileSHA({ owner, repo, path, ref = 'heads/main' }) {
    try {
        const data = await gh(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${ref}`);
        return data.sha; // existing file
    } catch {
        return null; // new file
    }
}

export async function putFile({ owner, repo, path, message, contentBase64, branch = 'main' }) {
    const sha = await getFileSHA({ owner, repo, path });
    const body = { message, content: contentBase64, branch };
    if (sha) body.sha = sha; // update
    return gh(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

export async function toBase64(file) {
    const arrayBuf = await file.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(arrayBuf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        const slice = bytes.subarray(i, i + chunk);
        binary += String.fromCharCode.apply(null, slice);
    }
    return btoa(binary);
}
