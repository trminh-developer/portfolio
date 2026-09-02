const fs = require('fs');
const path = require('path');

function htmlToJsx(html) {
  return html
    .replace(/class=/g, 'className=')
    .replace(/<!--(.*?)-->/gs, '{/* $1 */}')
    .replace(/<img(.*?)>/g, (match) => {
      if (!match.endsWith('/>')) return match.replace('>', ' />');
      return match;
    })
    .replace(/<input(.*?)>/g, (match) => {
      if (!match.endsWith('/>')) return match.replace('>', ' />');
      return match;
    })
    .replace(/<br>/g, '<br />')
    .replace(/style="([^"]*)"/g, (match, p1) => {
      const styleObj = p1.split(';').filter(s => s.trim()).reduce((acc, style) => {
        const [key, value] = style.split(':').map(s => s.trim());
        if (!key) return acc;
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc.push(`${camelKey}: '${value}'`);
        return acc;
      }, []);
      return `style={{ ${styleObj.join(', ')} }}`;
    });
}

function extractMainContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    return htmlToJsx(mainMatch[1]);
  }
  
  // For subpages, they have <div class="subpage-wrapper">...</div> before footer
  const startIndex = content.indexOf('<div class="subpage-wrapper">');
  const endIndex = content.indexOf('<footer');
  
  if (startIndex !== -1 && endIndex !== -1) {
    let subpageHtml = content.substring(startIndex, endIndex);
    // Remove the last closing div which might belong to a wrapper or not, actually we can just wrap it.
    // It's perfectly safe to just render the whole subpage-wrapper
    return htmlToJsx(subpageHtml);
  }
  
  return '<div>Error extracting content</div>';
}

const pages = [
  { name: 'Home', src: 'Main/index.html' },
  { name: 'Experience', src: 'Experience/index.html' },
  { name: 'Skills', src: 'Skills/index.html' },
  { name: 'Projects', src: 'Project/index.html' },
  { name: 'Contact', src: 'Contact/index.html' }
];

pages.forEach(page => {
  const srcPath = path.join(__dirname, '../../legacy_html', page.src);
  let jsxContent = extractMainContent(srcPath);

  jsxContent = jsxContent.replace(/src="\.\.\/Main\/([^"]+)"/g, 'src="/$1"');
  jsxContent = jsxContent.replace(/href="\.\.\/Main\/([^"]+)"/g, 'href="/$1"');
  jsxContent = jsxContent.replace(/src="([^"]+)"/g, (match, p1) => {
    if (p1.endsWith('.png') || p1.endsWith('.jpg')) {
      if (!p1.startsWith('/')) return `src="/${p1}"`;
    }
    return match;
  });

  const componentContent = `import { Link } from 'react-router-dom';

export default function ${page.name}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
  
  fs.writeFileSync(path.join(__dirname, 'pages', `${page.name}.tsx`), componentContent);
  console.log(`Created ${page.name}.tsx`);
});
