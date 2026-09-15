import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagePath = path.resolve('image/57df2c70-0131-4ccc-952c-7dcac24ee1bc.png');
const outputDir = path.resolve('public/assets');
fs.mkdirSync(outputDir, { recursive: true });

const crops = [
  // Logo
  { name: 'logo.png', left: 85, top: 10, width: 165, height: 48 },
  // Avatar
  { name: 'avatar.png', left: 1325, top: 8, width: 44, height: 44 },

  // Magazine Full Stack (Center area)
  { name: 'magazine-full.png', left: 470, top: 60, width: 510, height: 520 },
  // Magazine Cover Front
  { name: 'magazine-cover-a-second-chance.png', left: 550, top: 70, width: 400, height: 490 },
  // Magazine Couple photo clean
  { name: 'hero-couple-main.png', left: 575, top: 140, width: 350, height: 380 },

  // Featured This Week Thumbnails
  { name: 'featured-01-a-second-chance.png', left: 1045, top: 138, width: 95, height: 72 },
  { name: 'featured-02-his-revenge.png', left: 1045, top: 216, width: 95, height: 72 },
  { name: 'featured-03-my-college-crush.png', left: 1045, top: 294, width: 95, height: 72 },
  { name: 'featured-04-the-ceos-deal.png', left: 1045, top: 372, width: 95, height: 72 },
  { name: 'featured-05-stolen-hearts.png', left: 1045, top: 450, width: 95, height: 72 },

  // Cursive Quote
  { name: 'cursive-quote.png', left: 1330, top: 430, width: 175, height: 105 },

  // Trending Now Cards
  { name: 'trending-01-a-second-chance.png', left: 48, top: 722, width: 174, height: 80 },
  { name: 'trending-02-his-revenge.png', left: 230, top: 722, width: 174, height: 80 },
  { name: 'trending-03-my-college-crush.png', left: 414, top: 722, width: 174, height: 80 },
  { name: 'trending-04-the-ceos-deal.png', left: 598, top: 722, width: 174, height: 80 },
  { name: 'trending-05-stolen-hearts.png', left: 780, top: 722, width: 174, height: 80 },
  { name: 'trending-06-contract-marriage.png', left: 960, top: 722, width: 174, height: 80 },
  { name: 'trending-07-the-silent-love.png', left: 1144, top: 722, width: 174, height: 80 },
  { name: 'trending-08-reborn.png', left: 1324, top: 722, width: 174, height: 80 },

  // Browse by Mood Cards
  { name: 'mood-01-love.png', left: 45, top: 915, width: 236, height: 86 },
  { name: 'mood-02-laugh.png', left: 292, top: 915, width: 236, height: 86 },
  { name: 'mood-03-thrill.png', left: 538, top: 915, width: 236, height: 86 },
  { name: 'mood-04-heal.png', left: 780, top: 915, width: 236, height: 86 },
  { name: 'mood-05-escape.png', left: 1022, top: 915, width: 236, height: 86 },
  { name: 'mood-06-bigger.png', left: 1262, top: 915, width: 236, height: 86 },
];

for (const c of crops) {
  try {
    await sharp(imagePath)
      .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
      .toFile(path.join(outputDir, c.name));
    console.log(`Saved: ${c.name}`);
  } catch (err) {
    console.error(`Error saving ${c.name}:`, err.message);
  }
}
