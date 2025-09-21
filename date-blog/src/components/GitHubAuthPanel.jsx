import React, { useState } from 'react';
import { getToken, setToken } from '../utils/github';

export default function GitHubAuthPanel() {
    const [token, setTok] = useState(getToken());
    const [masked, setMasked] = useState(true);

    function save() {
        setToken(token.trim());
        alert('Token saved locally. You are signed in.');
    }

    return (
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 12, marginBottom: '1rem' }}>
            <strong>Editor sign-in</strong>
            <p style={{ margin: '8px 0' }}>
                Paste your fine-grained GitHub token (repo-scoped, contents:rw). Stored only in your browser.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
                <input
                    type={masked ? 'password' : 'text'}
                    value={token}
                    onChange={e => setTok(e.target.value)}
                    placeholder="ghp_..."
                    style={{ flex: 1, padding: 8 }}
                />
                <button onClick={() => setMasked(m => !m)}>{masked ? 'Show' : 'Hide'}</button>
                <button onClick={save}>Save</button>
            </div>
        </div>
    );
}
