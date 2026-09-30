const fs = require('fs');

let homeSrc = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const hookRegex = /const form = useRef<HTMLFormElement>\(null\);[\s\S]*?setIsSubmitting\(false\);\s*\n\s*\}\);\s*\n\s*\};/;
const hookMatch = homeSrc.match(hookRegex);
if(hookMatch) {
  homeSrc = homeSrc.replace(hookRegex, '');
} else {
  // If regex fails, let's just do a simple replace
  const start = homeSrc.indexOf('const form = useRef');
  const end = homeSrc.indexOf('return (', start);
  const hookCode = homeSrc.substring(start, end);
  homeSrc = homeSrc.substring(0, start) + homeSrc.substring(end);
  
  let contactSrc = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
  contactSrc = contactSrc.replace('export default function Contact() {', 'export default function Contact() {\n  ' + hookCode);
  fs.writeFileSync('src/pages/Contact.tsx', contactSrc);
}

homeSrc = homeSrc.replace('import React, { useRef, useState } from "react";', '');
homeSrc = homeSrc.replace('import emailjs from "@emailjs/browser";', '');

fs.writeFileSync('src/pages/Home.tsx', homeSrc);
