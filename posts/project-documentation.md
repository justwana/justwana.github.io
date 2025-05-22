---
title: "Understanding Our Simple Blog Project"
date: "2023-10-27"
author: "Jules the AI Assistant"
category: "Project Info"
summary: "A brief guide to the structure and functionality of this blog project, including how to add new posts and understand its technical workings."
---

## Introduction

Welcome to our simple Markdown-powered blog! This project is designed to be a lightweight and easy-to-understand blogging system that renders posts written in Markdown. The goal is to provide a clean, readable, and modern interface, inspired by the aesthetics of platforms like Halo.

This document serves as a quick guide to understanding its structure, how content is managed, and the basic technical details behind its operation.

## File Structure

The project is organized into a few key files and directories:

*   `index.html`: This is the main HTML file that provides the basic structure for the entire blog, including the header, navigation, content area, sidebar, and footer.
*   `css/`: This directory contains all the styling for the blog.
    *   `style.css`: The primary stylesheet. It defines the layout, colors, typography, and responsive design.
*   `js/`: This directory holds the JavaScript code.
    *   `main.js`: This script is responsible for all the dynamic functionality of the blog, such as fetching posts, rendering Markdown, and handling navigation.
*   `posts/`: This directory contains all the blog post content. Each post is a separate Markdown (`.md`) file.

## Adding New Posts

Creating a new blog post is straightforward:

1.  **Create a Markdown File:** Add a new file with the `.md` extension to the `posts/` directory (e.g., `my-new-article.md`).
2.  **Add Frontmatter:** At the very beginning of your Markdown file, include a "frontmatter" block. This block is written in YAML format, enclosed by triple hyphens (`---`):

    ```yaml
    ---
    title: "Your Post Title Here"
    date: "YYYY-MM-DD"  # e.g., 2023-10-28
    author: "Your Name"
    category: "Relevant Category" # e.g., Technology, Lifestyle, etc.
    summary: "A short sentence or two summarizing your post. This appears on the post list."
    ---
    ```
    *   `title`: The title of your post.
    *   `date`: The publication date.
    *   `author`: The author's name.
    *   `category`: The category your post belongs to. This is used for filtering.
    *   `summary`: A brief description shown on the homepage list.

3.  **Write Your Content:** Below the closing `---` of the frontmatter, write your blog post content using standard Markdown syntax.

4.  **Update Post List (Manual Step for now):**
    Currently, `js/main.js` has a hardcoded list of post file paths (`postPaths` array). To make your new post appear, you'll need to manually add its path to this array. For example, if you created `posts/my-new-article.md`, you would add `'posts/my-new-article.md'` to the `postPaths` array in `js/main.js`. *Future improvements could automate this discovery process.*

## How `js/main.js` Works

The `js/main.js` script is the engine of the blog. Here's a summary of its key functions:

*   **Fetching Posts:** It fetches the content of each Markdown file specified in the `postPaths` array.
*   **Frontmatter Parsing:** For each post, it parses the frontmatter (title, date, author, category, summary) from the Markdown content. This metadata is used to display post information and for categorization.
*   **Post Listing (`displayPostList`):**
    *   It dynamically generates HTML to display a list of blog post summaries on the main page (`#blog-posts-list`).
    *   Each summary includes the title (as a link), the summary text from the frontmatter, and metadata like author, date, and category.
*   **Single Post View (`displaySinglePostView`):**
    *   When a post title is clicked, this function displays the full content of that post.
    *   It uses the `marked.min.js` library (included in `index.html`) to convert the Markdown content of the post into HTML.
    *   The rendered HTML is then injected into the main content area.
    *   A "Back to List" button is provided to navigate back to the main post list.
*   **Category System:**
    *   It extracts all unique categories from the frontmatter of the posts.
    *   It dynamically generates a list of these categories in the sidebar (`#category-list`).
    *   Clicking on a category filters the post list to show only posts belonging to that category. An "All Categories" option is also available.

## Styling Approach

The blog's appearance is controlled by `css/style.css`. The design aims for a clean, modern, and readable layout, taking inspiration from the minimalist and content-focused aesthetic often found in Halo themes.

Key styling aspects include:

*   **Responsive Design:** The layout adapts to different screen sizes, ensuring a good experience on desktops, tablets, and mobile devices.
*   **Typography:** Emphasis on clear and legible fonts.
*   **Whitespace:** Generous use of whitespace to improve readability and visual separation of elements.
*   **Markdown Styling:** Detailed styling for all standard Markdown elements (headings, lists, code blocks, etc.) to ensure content is presented attractively.
*   **Color Palette:** A restrained color scheme with a primary accent color for interactive elements.

This project serves as a good example of how to build a simple but functional static blog using vanilla JavaScript, Markdown, and CSS.
