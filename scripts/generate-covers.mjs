import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('public/assets');
fs.mkdirSync(outputDir, { recursive: true });

const dramas = [
  {
    id: 1,
    slug: 'a-second-chance',
    title: 'A Second Chance',
    tagline: 'Some endings lead to new beginnings.',
    vol: 'VOL. 01',
    genre: 'Romance',
    cropSource: 'magazine-cover-a-second-chance.png',
    thumbSource: 'featured-01-a-second-chance.png',
    color1: '#1c1917',
    color2: '#78350f',
  },
  {
    id: 2,
    slug: 'his-revenge',
    title: 'His Revenge',
    tagline: 'Betrayal cut deep. Vengeance will cut deeper.',
    vol: 'VOL. 02',
    genre: 'Thriller',
    thumbSource: 'featured-02-his-revenge.png',
    color1: '#09090b',
    color2: '#991b1b',
  },
  {
    id: 3,
    slug: 'my-college-crush',
    title: 'My College Crush',
    tagline: 'Years later, the feelings never left.',
    vol: 'VOL. 03',
    genre: 'College Life',
    thumbSource: 'featured-03-my-college-crush.png',
    color1: '#1e1b4b',
    color2: '#c026d3',
  },
  {
    id: 4,
    slug: 'the-ceos-deal',
    title: "The CEO's Deal",
    tagline: 'A billion-dollar contract. An unexpected heart.',
    vol: 'VOL. 04',
    genre: 'CEO',
    thumbSource: 'featured-04-the-ceos-deal.png',
    color1: '#0f172a',
    color2: '#0284c7',
  },
  {
    id: 5,
    slug: 'stolen-hearts',
    title: 'Stolen Hearts',
    tagline: 'She stole his secret. He stole her freedom.',
    vol: 'VOL. 05',
    genre: 'Drama',
    thumbSource: 'featured-05-stolen-hearts.png',
    color1: '#18181b',
    color2: '#d97706',
  },
  {
    id: 6,
    slug: 'contract-marriage',
    title: 'Contract Marriage',
    tagline: 'Fake rings. Real danger. True desire.',
    vol: 'VOL. 06',
    genre: 'Romance',
    thumbSource: 'trending-06-contract-marriage.png',
    color1: '#18181b',
    color2: '#be123c',
  },
  {
    id: 7,
    slug: 'the-silent-love',
    title: 'The Silent Love',
    tagline: 'Words were never needed when eyes spoke everything.',
    vol: 'VOL. 07',
    genre: 'Drama',
    thumbSource: 'trending-07-the-silent-love.png',
    color1: '#0c4a6e',
    color2: '#0d9488',
  },
  {
    id: 8,
    slug: 'reborn',
    title: 'Reborn',
    tagline: 'Given a second life to rewrite her destiny.',
    vol: 'VOL. 08',
    genre: 'Fantasy',
    thumbSource: 'trending-08-reborn.png',
    color1: '#4a044e',
    color2: '#e11d48',
  },
];

console.log('Generating high quality drama covers...');

for (const drama of dramas) {
  const thumbPath = path.join(outputDir, drama.thumbSource);
  let thumbBuffer;
  if (fs.existsSync(thumbPath)) {
    thumbBuffer = await sharp(thumbPath)
      .resize(600, 750, { fit: 'cover', position: 'center' })
      .toBuffer();
  }

  const width = 600;
  const height = 750;

  // XML encode text for SVG
  const safeTitle = drama.title.replace(/&/g, '&amp;').replace(/'/g, '&apos;');
  const safeTagline = drama.tagline.replace(/&/g, '&amp;').replace(/'/g, '&apos;');

  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0.65)" />
          <stop offset="35%" stop-color="rgba(0,0,0,0.0)" />
        </linearGradient>
        <linearGradient id="gradBottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0.0)" />
          <stop offset="40%" stop-color="rgba(0,0,0,0.7)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.96)" />
        </linearGradient>
        <linearGradient id="fxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#f43f5e"/>
          <stop offset="100%" stop-color="#fbbf24"/>
        </linearGradient>
      </defs>

      <!-- Gradient Shadows -->
      <rect width="${width}" height="${height}" fill="url(#gradTop)" />
      <rect width="${width}" height="${height}" fill="url(#gradBottom)" />

      <!-- Magazine Header Elements -->
      <g transform="translate(40, 52)">
        <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" letter-spacing="-0.5">India<tspan fill="url(#fxGrad)">FX</tspan></text>
        <text x="2" y="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="10" fill="#E4E4E7" letter-spacing="2">MICRO DRAMA SERIES</text>
      </g>

      <!-- Top Right Meta -->
      <g transform="translate(${width - 40}, 42)" text-anchor="end">
        <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" letter-spacing="1">${drama.vol}</text>
        <text x="0" y="14" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="9" fill="#D4D4D8" letter-spacing="1.5">STORIES</text>
        <text x="0" y="26" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="9" fill="#D4D4D8" letter-spacing="1.5">PEOPLE</text>
        <text x="0" y="38" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="9" fill="#D4D4D8" letter-spacing="1.5">EMOTIONS</text>
      </g>

      <!-- Bottom Drama Title & Tagline -->
      <g transform="translate(40, ${height - 90})">
        <!-- Red Accent Line -->
        <line x1="0" y1="-50" x2="36" y2="-50" stroke="#FF1E2D" stroke-width="3.5" stroke-linecap="round" />

        <!-- Drama Title -->
        <text x="0" y="-10" font-family="Georgia, serif" font-weight="700" font-size="42" fill="#FFFFFF" letter-spacing="-0.5">${safeTitle}</text>

        <!-- Tagline with red dash -->
        <text x="0" y="24" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#E4E4E7" font-weight="400">
          <tspan fill="#FF1E2D" font-weight="700">— </tspan>${safeTagline}
        </text>
      </g>
    </svg>
  `;

  let baseImage;
  if (thumbBuffer) {
    baseImage = sharp(thumbBuffer);
  } else {
    baseImage = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: drama.color1,
      },
    });
  }

  await baseImage
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toFile(path.join(outputDir, `cover-${drama.slug}.png`));

  console.log(`Generated cover for: ${drama.title}`);
}
console.log('All drama covers generated successfully!');
