import { db, collection, addDoc, serverTimestamp } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('BizKitForm');
  const resultSection = document.getElementById('result');
  const themeToggle = document.querySelector('.theme-toggle');
  const downloadBtn = document.getElementById('download-pdf');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const businessName = form[0].value;
      const industry = form[1].value;
      const style = form[2].value;

      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      const features = [];
      checkboxes.forEach(cb => {
        if (cb.checked) features.push(cb.parentElement.innerText.trim());
      });

      try {
        // AI Prompts
        const taglinePrompt = `Create a catchy tagline for a business named "${businessName}" in the "${industry}" industry.`;
        const blogPrompt = `Write a short 100-word intro blog post for a company named "${businessName}" in the "${industry}" niche.`;
        const seoPrompt = `Generate 5 SEO keywords for a business called "${businessName}" in the "${industry}" niche. Return keywords only.`;

        const tagline = await generateAIContent(taglinePrompt);
        const blogPost = await generateAIContent(blogPrompt);
        const seoKeywords = await generateAIContent(seoPrompt);

        document.querySelector('.tagline').textContent = tagline;
        document.querySelector('.blog').textContent = blogPost;
        document.querySelector('.seo').textContent = seoKeywords;

        generateTextLogo(businessName, style);

        await addDoc(collection(db, 'bizkits'), {
          businessName,
          industry,
          style,
          features,
          tagline,
          blogPost,
          seoKeywords,
          createdAt: serverTimestamp()
        });

        resultSection.scrollIntoView({ behavior: 'smooth' });
        alert('✅ Your BizKit has been generated and saved!');
      } catch (err) {
        console.error('❌ Error:', err);
        alert('Something went wrong. Check console.');
      }
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const businessName = form[0].value;
      const industry = form[1].value;
      const style = form[2].value;
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      const features = [];
      checkboxes.forEach(cb => {
        if (cb.checked) features.push(cb.parentElement.innerText.trim());
      });

      const tagline = document.querySelector('.tagline').textContent;
      const blogPost = document.querySelector('.blog').textContent;
      const seoKeywords = document.querySelector('.seo').textContent;

      document.getElementById('pdf-bizname').textContent = businessName;
      document.getElementById('pdf-industry').textContent = industry;
      document.getElementById('pdf-style').textContent = style;
      document.getElementById('pdf-features').textContent = features.join(', ');
      document.getElementById('pdf-tagline').textContent = tagline;
      document.getElementById('pdf-seo').textContent = seoKeywords;
      document.getElementById('pdf-blog').textContent = blogPost;

      const element = document.getElementById('pdf-content');
      html2pdf().set({
        margin: 0.5,
        filename: `${businessName}-BrandKit.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).from(element).save();
    });
  }
});

// 🔧 Call to Render backend
async function generateAIContent(prompt) {
  try {
    const res = await fetch('https://aibizkit-backend.onrender.com', {  // 🔁 Replace with your actual URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    return data.message;
  } catch (e) {
    console.error("⚠️ AI Content Generation Failed:", e);
    return "Unable to generate content.";
  }
}

// 🎨 Logo Generator
function generateTextLogo(name, style) {
  const logoStyles = {
    'Clean & Modern': 'sans-serif',
    'Bold & Playful': 'Comic Sans MS, cursive',
    'Classic & Elegant': 'Georgia, serif'
  };
  const fontFamily = logoStyles[style] || 'sans-serif';
  const svg = `
    <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <text x="10" y="60" font-size="32" font-family="${fontFamily}" fill="#f24e1e">${name}</text>
    </svg>
  `;
  document.getElementById('logo-container').innerHTML = svg;
}

// ⬇️ Download logo
function downloadLogo() {
  const svgElement = document.querySelector('#logo-container svg');
  if (!svgElement) return;

  const blob = new Blob([svgElement.outerHTML], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'AIBizKit_Logo.svg';
  a.click();
  URL.revokeObjectURL(url);
}
