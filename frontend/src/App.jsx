import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './App.css';

const API_URL = 'http://localhost:5000/api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [currentPost, setCurrentPost] = useState({ title: '', content: '', status: 'Draft', image: '', category: 'General' });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    fetchPosts();
  }, [search]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}?search=${search}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (currentPost.id) {
      await axios.put(`${API_URL}/${currentPost.id}`, currentPost);
    } else {
      await axios.post(API_URL, currentPost);
    }
    setView('list');
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchPosts();
      setView('list');
    }
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setView('form');
  };

  const handleView = (post) => {
    setCurrentPost(post);
    setView('detail');
  };

  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.status === 'Published').length;
  const draftCount = posts.filter(p => p.status === 'Draft').length;

  return (
    <div className="app-container">
      <header>
        <div className="header-title-section">
          <h1 style={{ margin: 0 }}>✍️ Content Creator Blog Manager</h1>
          
          <div className="social-links">
            <a href="https://instagram.com/comi.ccast" target="_blank" rel="noopener noreferrer" className="social-btn insta">📸 Instagram</a>
            <a href="https://t.me/doom5129" target="_blank" rel="noopener noreferrer" className="social-btn tele">✈️ Telegram</a>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Day/Night Mode"
          >
            {isDarkMode ? '🌞' : '🌜'}
          </button>

          {view !== 'list' && (
            <button className="btn btn-secondary" onClick={() => setView('list')}>Back</button>
          )}
        </div>
      </header>

      {view === 'list' && (
        <div>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h4>Total Posts</h4>
              <p>{totalPosts}</p>
            </div>
            <div className="stat-card">
              <h4>Published</h4>
              <p className="text-success">{publishedCount}</p>
            </div>
            <div className="stat-card">
              <h4>Drafts</h4>
              <p className="text-warning">{draftCount}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <input 
              type="text" 
              className="search-bar" 
              style={{ marginBottom: '0' }}
              placeholder="Search posts by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              className="btn btn-primary" 
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => {
                setCurrentPost({ title: '', content: '', status: 'Draft', image: '', category: 'General' });
                setView('form');
              }}>
              + Create New
            </button>
          </div>

          <div className="post-list">
            {posts.length === 0 ? <p>No posts found.</p> : posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="card-content-left">
                  {post.image && <img src={post.image} alt="Cover" className="post-thumbnail" />}
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{post.title}</h3>
                    <div className="badge-container">
                      <span className={`status-badge ${post.status === 'Draft' ? 'status-draft' : 'status-published'}`}>
                        {post.status}
                      </span>
                      <span className="category-badge">{post.category}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary" onClick={() => handleView(post)}>View</button>
                  <button className="btn btn-primary" onClick={() => handleEdit(post)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="comic-cast-section">
            <h2 style={{ margin: '0 0 5px 0' }}>📺 COMIC CAST</h2>
            <p style={{ margin: '0', color: 'var(--text-color)', opacity: 0.8 }}>
              Catch up on the latest lore, theories, and maybe a few cameos!
            </p>
            <div className="video-container">
             <iframe width="560" height="315" src="https://www.youtube.com/embed/hukiC_J_Okc?si=ptSND6zYznSkEwDF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> 
          
          </div>
          </div>
        </div>
      )}

      {view === 'form' && (
        <form onSubmit={handleSave}>
          <h2>{currentPost.id ? 'Edit Post' : 'Create New Post'}</h2>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              required 
              value={currentPost.title} 
              onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Cover Image URL (Optional)</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg"
                value={currentPost.image} 
                onChange={(e) => setCurrentPost({...currentPost, image: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Category</label>
              <select 
                value={currentPost.category} 
                onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
              >
                <option value="General">General</option>
                <option value="Comic Lore (Doom/Deadpool)">Comic Lore (Doom/Deadpool)</option>
                <option value="Gaming">Gaming</option>
                <option value="Programming (Java/C/Linux)">Programming (Java/C/Linux)</option>
                <option value="Tamil Cinema & Memes">Tamil Cinema & Memes</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Content</label>
            <div className="editor-container">
              <ReactQuill 
                theme="snow" 
                value={currentPost.content} 
                onChange={(value) => setCurrentPost({...currentPost, content: value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              value={currentPost.status} 
              onChange={(e) => setCurrentPost({...currentPost, status: e.target.value})}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Save Post</button>
        </form>
      )}

      {view === 'detail' && (
        <div>
          {currentPost.image && <img src={currentPost.image} alt="Cover" style={{ width: '100%', borderRadius: '12px', marginBottom: '20px', maxHeight: '400px', objectFit: 'cover' }} />}
          <div className="badge-container" style={{ marginBottom: '15px' }}>
            <span className={`status-badge ${currentPost.status === 'Draft' ? 'status-draft' : 'status-published'}`}>
              {currentPost.status}
            </span>
            <span className="category-badge">{currentPost.category}</span>
          </div>
          <h2 style={{ fontSize: '36px', marginTop: '0' }}>{currentPost.title}</h2>
          
          <div 
            className="formatted-content"
            style={{ marginTop: '20px', lineHeight: '1.6' }}
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
          />
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => handleEdit(currentPost)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(currentPost.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;