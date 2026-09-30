const fs = require('fs');

const homeSrc = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// We want to KEEP the hero section and maybe Testimonials in Home.tsx.
// Actually, let's just keep the Hero and Testimonials.

// Extract emailJS imports and hooks
const importsMatch = homeSrc.match(/import emailjs from "@emailjs\/browser";/);
const formHooksMatch = homeSrc.match(/const form = useRef<HTMLFormElement>\(null\);[\s\S]*?finally \{\s*setIsSubmitting\(false\);\s*\}\s*\);?\s*\};/);

// Extract sections
const servicesSection = homeSrc.match(/<section className="section-card" id="services">[\s\S]*?<\/section>/)[0];
const portfolioSection = homeSrc.match(/<section className="section-card" id="portfolio">[\s\S]*?<\/section>/)[0];
const contactSection = homeSrc.match(/<section className="section-card contact-section" id="contact">[\s\S]*?<\/section>/)[0];

// Update Contact.tsx
let contactSrc = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
contactSrc = contactSrc.replace('export default function Contact() {', 'import { useRef, useState } from "react";\nimport emailjs from "@emailjs/browser";\n\nexport default function Contact() {\n' + (formHooksMatch ? formHooksMatch[0] : ''));
contactSrc = contactSrc.replace('</>\\n  );\\n}', '  ' + contactSection + '\n    </>\n  );\n}');
fs.writeFileSync('src/pages/Contact.tsx', contactSrc);

// Update Skills.tsx
let skillsSrc = fs.readFileSync('src/pages/Skills.tsx', 'utf8');
skillsSrc = skillsSrc.replace('</>\\n  );\\n}', '  ' + portfolioSection + '\n    </>\n  );\n}');
fs.writeFileSync('src/pages/Skills.tsx', skillsSrc);

// Update Services.tsx
let servicesSrc = fs.readFileSync('src/pages/Services.tsx', 'utf8');
// Convert the Home 'service-card' format to match Services if possible, or just append it below the page-container?
// Actually, let's just append the services section at the bottom of the page container.
servicesSrc = servicesSrc.replace('</div>\\n        </div>\\n      </div>\\n    </>\\n  );\\n}', '  </div>\n' + servicesSection + '\n        </div>\n      </div>\n    </>\n  );\n}');
fs.writeFileSync('src/pages/Services.tsx', servicesSrc);

// Update Home.tsx
let newHomeSrc = homeSrc;
newHomeSrc = newHomeSrc.replace(servicesSection, '');
newHomeSrc = newHomeSrc.replace(portfolioSection, '');
newHomeSrc = newHomeSrc.replace(contactSection, '');
if(importsMatch) newHomeSrc = newHomeSrc.replace(importsMatch[0], '');
if(formHooksMatch) newHomeSrc = newHomeSrc.replace(formHooksMatch[0], '');
// Also remove unused imports like useRef, useState if they are no longer needed, but let's just leave them or let eslint/tsc warn.

fs.writeFileSync('src/pages/Home.tsx', newHomeSrc);
