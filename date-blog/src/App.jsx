import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import GitHubAuthPanel from './components/GitHubAuthPanel';
import Editor from './components/Editor';
import PostList from './components/PostList'
import PostView from './components/PostView'


export default function App() {
  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>💞 Our Date Blog</h1>
        <p style={{ marginTop: 8 }}>Little memories, big smiles.</p>
        <nav style={{ marginTop: 16 }}>
          <Link to="/">Home</Link>
        </nav>
      </header>


      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/post/:slug" element={<PostView />} />
        <Route path="/new" element={<>
          <GitHubAuthPanel />
          <Editor />
        </>} />
      </Routes>


      <footer style={{ marginTop: '3rem', fontSize: 14, opacity: 0.7 }}>
        Built with React & GitHub Pages.
      </footer>
    </div>
  )
}