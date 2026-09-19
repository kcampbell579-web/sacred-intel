# Content inbox

Drop Sacred Intel article `.docx` files here in bulk, then tell Claude
"process the inbox." Each doc is converted to a published article in
`src/content/articles/`, and the processed `.docx` is removed from here.

## How to bulk-upload on GitHub
1. Open this folder on github.com
2. **Add file → Upload files**
3. Drag in as many `.docx` files as you want
4. **Commit changes**
5. Come back to Claude and say **"process the inbox"**

Naming doesn't matter — Claude reads the article's own headline/byline.
Article photos still go in `public/img/articles/` (see the image list).
