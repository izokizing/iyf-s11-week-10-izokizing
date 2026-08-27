const express = require('express'); 
const app = express(); 
const PORT = 3000;
 
 app.get('/', (req, res) => {
     res.send('Hello, World!'); 
 });
 
 app.listen(PORT, () => { 
    console.log(`Server running at http://localhost:${PORT}`); 
});

app.get('/', (req, res) => {
     res.send('Welcome to CommunityHub API'); 
 }); 
 app.get('/about', (req, res) => { 
    res.send('CommunityHub - A community platform');
});
app.get('/api/health', (req, res) => { 
    res.json({ status: 'OK', timestamp: new Date().toISOString() }); 
});
app.use((req, res) => { 
    res.status(404).json({ error: 'Route not found' }); 
}); 

app.listen(PORT, () => { 
    console.log(`Server running at http://localhost:${PORT}`); 
} );

app.get('/text', (req, res) => { 
    res.send('Plain text response'); 
}); 
app.get('/json', (req, res) => { 
    res.json({ message: 'JSON response', success: true }); 
});
app.get('/error', (req, res) => { 
    res.status(400).json({ error: 'Bad request' }); 
}); 
app.get('/old-page', (req, res) => { 
    res.redirect('/new-page'); 
});

app.get('/text', (req, res) => { 
    res.send('Plain text response'); 
});
app.get('/json', (req, res) => { 
    res.json({ message: 'JSON response', success: true }); 
});
app.get('/error', (req, res) => { 
    res.status(400).json({ error: 'Bad request' }); 
}); 
app.get('/old-page', (req, res) => { 
    res.redirect('/new-page'); 
});

app.get('/users/:id', (req, res) => { 
    const userId = req.params.id; 
    res.json({ message: `Getting user ${userId}` }); 
}); 
app.get('/posts/:postId/comments/:commentId', (req, res) => { 
    const { postId, commentId } = req.params; 
    res.json({ postId, commentId }); 
});

app.get('/search', (req, res) => { 
    const { q, limit = 10, page = 1 } = req.query; 
    res.json({ query: q, limit: parseInt(limit), page: parseInt(page) }); 
}); 
app.get('/posts', (req, res) => { 
    const { category, sort = 'newest' } = req.query; 
    res.json({ message: 'Getting posts', filters: { category, sort } }); 
});

app.use(express.json());

// In-memory data store
let posts = [
    { 
        id: 1, 
        title: "Getting Started with Node.js", 
        content: "Node.js is a JavaScript runtime...",
        author: "John Doe",
        createdAt: "2026-01-15T10:00:00Z",
        likes: 10
    },
    { 
        id: 2, 
        title: "Express.js Fundamentals", 
        content: "Express is a web framework...",
        author: "Jane Smith",
        createdAt: "2026-01-16T14:30:00Z",
        likes: 15
    }
];

let nextId = 3;

// GET all posts
app.get('/api/posts', (req, res) => {
    const { author, sort } = req.query;
    
    let result = [...posts];
    
    // Filter by author
    if (author) {
        result = result.filter(post => 
            post.author.toLowerCase().includes(author.toLowerCase())
        );
    }
    
    // Sort
    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    }
    
    res.json(result);
});

// GET single post
app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
});

// POST create new post
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    
    // Validation
    if (!title || !content || !author) {
        return res.status(400).json({ 
            error: 'Title, content, and author are required' 
        });
    }
    
    const newPost = {
        id: nextId++,
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        likes: 0
    };
    
    posts.push(newPost);
    res.status(201).json(newPost);
});

// PUT update post
app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    const { title, content } = req.body;
    
    posts[postIndex] = {
        ...posts[postIndex],
        title: title || posts[postIndex].title,
        content: content || posts[postIndex].content,
        updatedAt: new Date().toISOString()
    };
    
    res.json(posts[postIndex]);
});

// DELETE post
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    posts.splice(postIndex, 1);
    res.status(204).send();  // No content
});

// PATCH like a post
app.patch('/api/posts/:id/like', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    post.likes++;
    res.json(post);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();  // Pass to next middleware/route
};

// Apply to all routes
app.use(logger);

// Request time middleware
const addRequestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};

app.use(addRequestTime);

// Use in route
app.get('/api/time', (req, res) => {
    res.json({ requestTime: req.requestTime });
});

app.use(express.json());

// Parse URL-encoded bodies (forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }
    
    // In real app, verify token here
    next();
};

// Apply to specific routes
app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: 'This is protected data' });
});

// Apply to all routes starting with /api/admin
app.use('/api/admin', requireAuth);

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Route that throws error
app.get('/api/error-test', (req, res, next) => {
    try {
        throw new ApiError('Something went wrong', 500);
    } catch (error) {
        next(error);  // Pass to error handler
    }
});

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/api/users', asyncHandler(async (req, res) => {
    const users = await fetchUsers();  // If this throws, it's caught
    res.json(users);
}));

// Error handling middleware (must be last!)
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        error: {
            message,
            status: statusCode
        }
    });
});
const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;
    const errors = [];
    
    if (!title || title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }
    
    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters');
    }
    
    if (!author) {
        errors.push('Author is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    next();
};

// Apply to route
app.post('/api/posts', validatePost, (req, res) => {
    // Create post (validation already passed)
});

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Running in ${NODE_ENV} mode`);