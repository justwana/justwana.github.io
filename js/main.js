document.addEventListener('DOMContentLoaded', () => {
    const contentAreaElement = document.getElementById('content-area');
    const categoryListElement = document.getElementById('category-list'); // Get category list container

    if (!contentAreaElement) {
        console.error("Element with ID 'content-area' not found.");
        return;
    }
    if (!categoryListElement) {
        console.error("Element with ID 'category-list' not found.");
        // Continue if contentArea is found, as category list is secondary for core functionality
    }

    const blogPostsListId = 'blog-posts-list';
    let allPostsData = [];
    let uniqueCategories = [];
    let currentFilter = null; // To keep track of the active category filter

    const postPaths = ['posts/post1.md', 'posts/post2.md'];

    async function fetchAndDisplayPosts() {
        if (postPaths.length === 0) {
            displayPostList([]); // Pass empty array for consistency
            displayCategoryList(); // Display categories even if no posts (might show "All")
            return;
        }

        try {
            const fetchedPostItems = await Promise.all(
                postPaths.map(async (path) => {
                    const response = await fetch(path);
                    if (!response.ok) {
                        console.error(`Failed to fetch ${path}: ${response.statusText}`);
                        return null;
                    }
                    const markdownText = await response.text();
                    const parsed = parseFrontmatter(markdownText, path);
                    return { ...parsed, path: path };
                })
            );

            allPostsData = fetchedPostItems.filter(post => post !== null);
            
            // Extract unique categories
            const categories = new Set();
            allPostsData.forEach(post => {
                if (post.frontmatter && post.frontmatter.category) {
                    categories.add(post.frontmatter.category.trim());
                }
            });
            uniqueCategories = ['All Categories', ...Array.from(categories).sort()];

            if (allPostsData.length === 0 && postPaths.length > 0) {
                 console.warn("Could not load any blog posts. Check console for errors.");
            }
            
            displayCategoryList();
            displayPostList(allPostsData); // Display all posts initially

        } catch (error) {
            console.error("Error fetching or parsing posts:", error);
            contentAreaElement.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
            if (categoryListElement) categoryListElement.innerHTML = '<p>Error loading categories.</p>';
        }
    }

    function parseFrontmatter(markdownText, filePath = 'unknown file') {
        const frontmatter = {};
        const contentLines = [];
        let inFrontmatter = false;
        let frontmatterEnd = false;
        const lines = markdownText.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === '---') {
                if (!inFrontmatter) {
                    inFrontmatter = true;
                } else if (inFrontmatter && !frontmatterEnd) {
                    frontmatterEnd = true;
                    inFrontmatter = false; 
                } else { 
                    contentLines.push(line);
                }
            } else if (inFrontmatter) {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
                    frontmatter[key] = value;
                }
            } else if (frontmatterEnd) {
                contentLines.push(line);
            } else {
                 contentLines.push(line);
            }
        }
        
        if (inFrontmatter && !frontmatterEnd) {
            console.warn(`Frontmatter in ${filePath} did not have a closing '---'. Treating all as content.`);
            for (const key in frontmatter) delete frontmatter[key];
        }
        return { frontmatter, content: contentLines.join('\n') };
    }

    function displayCategoryList() {
        if (!categoryListElement) return; // Don't proceed if the element doesn't exist

        // The h2 "Categories" is already in index.html, so we target the ul inside it or create one.
        let ul = categoryListElement.querySelector('ul');
        if (!ul) {
            ul = document.createElement('ul');
            // Assuming the h2 is there, append ul after it. If not, simply append to categoryListElement.
            const h2 = categoryListElement.querySelector('h2');
            if (h2 && h2.nextSibling) {
                categoryListElement.insertBefore(ul, h2.nextSibling);
            } else if (h2) {
                 categoryListElement.appendChild(ul);
            } else { // if no h2, just append to the section
                categoryListElement.innerHTML = ''; // Clear previous, e.g. error message
                const newH2 = document.createElement('h2');
                newH2.textContent = 'Categories';
                categoryListElement.appendChild(newH2);
                categoryListElement.appendChild(ul);
            }
        }
        ul.innerHTML = ''; // Clear existing categories before re-rendering

        uniqueCategories.forEach(category => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#'; // Prevent page jump
            link.textContent = category;
            link.dataset.category = category;
            link.addEventListener('click', handleCategoryClick);
            
            if (category === (currentFilter === null && category === 'All Categories' ? 'All Categories' : currentFilter) ) {
                li.classList.add('active-category');
            }

            li.appendChild(link);
            ul.appendChild(li);
        });
    }

    function handleCategoryClick(event) {
        event.preventDefault();
        const selectedCategory = event.currentTarget.dataset.category;
        currentFilter = selectedCategory; // Update current filter

        if (selectedCategory === 'All Categories') {
            displayPostList(allPostsData);
        } else {
            const filteredPosts = allPostsData.filter(post => post.frontmatter && post.frontmatter.category === selectedCategory);
            displayPostList(filteredPosts);
        }
        displayCategoryList(); // Re-render category list to update active state
    }

    function displayPostList(postsToDisplay) { // Modified to accept postsToDisplay
        contentAreaElement.innerHTML = ''; 
        const postListSection = document.createElement('section');
        postListSection.id = blogPostsListId;

        if (!postsToDisplay || postsToDisplay.length === 0) {
            const currentCategory = currentFilter && currentFilter !== 'All Categories' ? currentFilter : '';
            postListSection.innerHTML = `<p>No blog posts found${currentCategory ? ' in category: ' + currentCategory : ''}.</p>`;
            contentAreaElement.appendChild(postListSection);
            return;
        }

        postsToDisplay.forEach(postData => {
            if (!postData || !postData.frontmatter) {
                console.warn("Skipping a post due to missing data:", postData);
                return;
            }
            const fm = postData.frontmatter;
            const article = document.createElement('article');
            article.className = 'blog-post-summary';
            const title = document.createElement('h2');
            const titleLink = document.createElement('a');
            titleLink.href = `#post/${postData.path}`;
            titleLink.textContent = fm.title || "Untitled Post";
            titleLink.dataset.postPath = postData.path;
            titleLink.addEventListener('click', handlePostTitleClick);
            title.appendChild(titleLink);
            const summary = document.createElement('p');
            summary.textContent = fm.summary || "No summary available.";
            const meta = document.createElement('small');
            const dateString = fm.date ? new Date(fm.date).toLocaleDateString() : 'No date';
            const authorString = fm.author || 'Unknown author';
            meta.textContent = `By ${authorString} on ${dateString}`;
            if(fm.category) {
                const categorySpan = document.createElement('span');
                categorySpan.textContent = ` | Category: ${fm.category}`;
                categorySpan.style.marginLeft = '10px';
                meta.appendChild(categorySpan);
            }
            article.appendChild(title);
            article.appendChild(summary);
            article.appendChild(meta);
            postListSection.appendChild(article);
        });
        contentAreaElement.appendChild(postListSection);
    }

    function handlePostTitleClick(event) {
        event.preventDefault();
        const postPath = event.currentTarget.dataset.postPath;
        if (postPath) {
            displaySinglePostView(postPath);
        } else {
            console.error("Post path not found on clicked title element.");
        }
    }

    function displaySinglePostView(postPath) {
        const postData = allPostsData.find(p => p.path === postPath);
        if (!postData) {
            console.error(`Post with path ${postPath} not found in allPostsData.`);
            contentAreaElement.innerHTML = `<p>Error: Post not found.</p><button id="back-to-list-error">Back to List</button>`;
            const backButtonError = document.getElementById('back-to-list-error');
            if (backButtonError) { // Check if button exists before adding listener
                 backButtonError.addEventListener('click', () => displayPostList(allPostsData)); // Default to all posts
            }
            return;
        }
        contentAreaElement.innerHTML = ''; 
        const fm = postData.frontmatter;
        const postArticle = document.createElement('article');
        postArticle.className = 'blog-post-full';
        const title = document.createElement('h1');
        title.textContent = fm.title || "Untitled Post";
        postArticle.appendChild(title);
        const meta = document.createElement('small');
        const dateString = fm.date ? new Date(fm.date).toLocaleDateString() : 'No date';
        const authorString = fm.author || 'Unknown author';
        meta.textContent = `By ${authorString} on ${dateString}`;
        if(fm.category) {
            const categorySpan = document.createElement('span');
            categorySpan.textContent = ` | Category: ${fm.category}`;
            categorySpan.style.marginLeft = '10px';
            meta.appendChild(categorySpan);
        }
        postArticle.appendChild(meta);
        const spacer = document.createElement('hr');
        postArticle.appendChild(spacer);
        const contentDisplay = document.createElement('div');
        contentDisplay.className = 'rendered-markdown';
        if (typeof marked !== 'undefined') {
            contentDisplay.innerHTML = marked.parse(postData.content);
        } else {
            console.error("Marked.js library not loaded. Displaying raw Markdown.");
            const pre = document.createElement('pre');
            pre.textContent = postData.content;
            contentDisplay.appendChild(pre);
        }
        postArticle.appendChild(contentDisplay);
        const backButton = document.createElement('button');
        backButton.id = 'back-to-list';
        backButton.textContent = '← Back to List';
        backButton.style.marginTop = '20px';
        backButton.addEventListener('click', () => {
            // When going back, re-apply the last filter or show all if no filter was active
            if (currentFilter && currentFilter !== 'All Categories') {
                const filteredPosts = allPostsData.filter(post => post.frontmatter && post.frontmatter.category === currentFilter);
                displayPostList(filteredPosts);
            } else {
                displayPostList(allPostsData);
            }
        });
        contentAreaElement.appendChild(postArticle);
        contentAreaElement.appendChild(backButton);
    }

    fetchAndDisplayPosts();
});
