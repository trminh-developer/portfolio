const fs = require('fs');

let homeSrc = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const heroEnd = homeSrc.indexOf('</section>');
const heroSection = homeSrc.substring(0, heroEnd + 10);

const finalHome = heroSection + '\n      </>\n    </main>\n  );\n}\n';

fs.writeFileSync('src/pages/Home.tsx', finalHome);
