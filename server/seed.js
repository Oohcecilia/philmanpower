/**
 * Seed script: populates server/data/ with initial JSON data.
 * Run: node seed.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SEED_DATA = {
  'services.json': [
    { id: 'srv-1', title: 'Healthcare Recruitment', description: 'We recruit registered nurses, nursing assistants, and care professionals for hospitals, clinics, and long-term care facilities across Germany, Austria, and Spain.', icon: 'Heart', image_url: '', is_active: true, display_order: 1, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'srv-2', title: 'Hospitality Staffing', description: 'Skilled chefs, service staff, and hotel professionals trained for premium European establishments.', icon: 'UtensilsCrossed', image_url: '', is_active: true, display_order: 2, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'srv-3', title: 'Technical & Trade Recruitment', description: 'Certified welders, industrial mechanics, construction workers, and engineering professionals.', icon: 'Wrench', image_url: '', is_active: true, display_order: 3, created_date: '2024-01-01T00:00:00.000Z' },
  ],
  'industries.json': [
    { id: 'ind-1', title: 'Healthcare & Nursing', description: 'Registered nurses, certified care professionals, and healthcare assistants prepared for European standards.', icon: 'Heart', roles: 'Registered Nurses, Nursing Assistants, Care Professionals', is_active: true, display_order: 1, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'ind-2', title: 'Hospitality & Gastronomy', description: 'Skilled chefs, service staff, and hotel professionals trained for premium European establishments.', icon: 'UtensilsCrossed', roles: 'Chef de Cuisine, Commis & Sous Chef, Service & Reception', is_active: true, display_order: 2, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'ind-3', title: 'Technical & Skilled Trades', description: 'Certified welders, industrial mechanics, construction workers, and engineering professionals.', icon: 'Wrench', roles: 'Welders & Fabricators, Industrial Mechanics, Construction Specialists', is_active: true, display_order: 3, created_date: '2024-01-01T00:00:00.000Z' },
  ],
  'process_steps.json': [
    { id: 'step-1', step_number: '01', title: 'Consultation', description: 'We analyze your staffing needs, timelines, and specific requirements in a free initial consultation.', icon: 'MessageSquare', is_active: true, display_order: 1, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'step-2', step_number: '02', title: 'Candidate Selection', description: 'We identify and pre-screen qualified candidates from our vetted talent pool in the Philippines.', icon: 'Users', is_active: true, display_order: 2, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'step-3', step_number: '03', title: 'Language & Skills Training', description: 'Selected professionals undergo intensive language and vocational training with our certified partners.', icon: 'BookOpen', is_active: true, display_order: 3, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'step-4', step_number: '04', title: 'Visa & Documentation', description: 'We handle all documentation, translations, credential recognition, and visa processing.', icon: 'FileText', is_active: true, display_order: 4, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'step-5', step_number: '05', title: 'Relocation', description: 'Comprehensive relocation support including travel, housing guidance, and administrative setup.', icon: 'Plane', is_active: true, display_order: 5, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'step-6', step_number: '06', title: 'Successful Integration', description: 'Ongoing support for employers and professionals to ensure a smooth start and long-term success.', icon: 'Award', is_active: true, display_order: 6, created_date: '2024-01-01T00:00:00.000Z' },
  ],
  'faqs.json': [
    { id: 'faq-1', question: 'How long does the recruitment process take?', answer: 'The typical timeline from initial consultation to a professional\'s arrival is 4–8 months, depending on the industry, visa processing times, and language training requirements.', is_active: true, display_order: 1, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'faq-2', question: 'What is the visa process for Filipino professionals?', answer: 'We handle the complete visa process, including document preparation, credential recognition, embassy appointments, and work permit applications.', is_active: true, display_order: 2, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'faq-3', question: 'What qualifications do the candidates have?', answer: 'All candidates hold relevant professional qualifications from accredited institutions.', is_active: true, display_order: 3, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'faq-4', question: 'What level of German language proficiency do candidates achieve?', answer: 'We work with certified language institutes to prepare candidates to at least B1 level, with most healthcare professionals reaching B2 before their arrival.', is_active: true, display_order: 4, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'faq-5', question: 'What are the costs involved?', answer: 'Our fee structure is transparent and depends on the number of placements, industry, and specific service requirements.', is_active: true, display_order: 5, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'faq-6', question: 'What support do you provide after placement?', answer: 'We offer comprehensive post-placement support for both employers and professionals, including integration coaching and cultural orientation.', is_active: true, display_order: 6, created_date: '2024-01-01T00:00:00.000Z' },
  ],
  'testimonials.json': [
    { id: 'test-1', name: 'Dr. Thomas Berger', role: 'Medical Director', company: 'Klinikum München-Ost', text: 'PhilManPower delivered exactly what we needed — qualified nursing professionals who were language-ready and culturally prepared.', rating: 5, photo_url: '', is_active: true, display_order: 1, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'test-2', name: 'Elisabeth Gruber', role: 'HR Director', company: 'Hotel Sacher Wien', text: 'Finding skilled hospitality staff in Austria has been challenging for years. PhilManPower\'s structured approach has been a game changer.', rating: 5, photo_url: '', is_active: true, display_order: 2, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'test-3', name: 'Markus Schneider', role: 'Operations Manager', company: 'Siemens Energy AG', text: 'The technical professionals we received were thoroughly vetted and well-prepared.', rating: 5, photo_url: '', is_active: true, display_order: 3, created_date: '2024-01-01T00:00:00.000Z' },
    { id: 'test-4', name: 'Anna-Maria Hoffmann', role: 'Nursing Director', company: 'Caritas Pflegezentrum', text: 'We\'ve worked with several recruitment agencies, but PhilManPower stands out for their commitment to quality.', rating: 5, photo_url: '', is_active: true, display_order: 4, created_date: '2024-01-01T00:00:00.000Z' },
  ],
  'announcements.json': [
    { id: 'annc-1', title: 'Now Hiring', message: 'We are actively recruiting healthcare professionals for positions across Germany and Austria. Apply today!', color: 'info', cta_text: 'View Openings', cta_link: '#contact', featured_image: '/uploads/landscape.jpg', is_enabled: true, start_date: null, end_date: null, created_date: '2026-01-01T00:00:00.000Z' },
  ],

  'users.json': [
    { id: 'admin-1', username: 'admin', email: 'admin@philmanpower.com', name: 'Admin', role: 'admin', password: 'admin123', created_date: '2024-01-01T00:00:00.000Z' },
  ],
};

let count = 0;
for (const [file, data] of Object.entries(SEED_DATA)) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Created: ${file}`);
    count++;
  } else {
    console.log(`Skipped: ${file} (already exists)`);
  }
}

// Seed a sample featured image into the uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const sampleImages = [
  { name: 'landscape.jpg', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80' },
];

for (const img of sampleImages) {
  const dest = path.join(UPLOADS_DIR, img.name);
  if (fs.existsSync(dest)) {
    console.log(`Skipped: uploads/${img.name} (already exists)`);
    continue;
  }
  try {
    execSync(`curl -sL -o "${dest}" "${img.url}"`, { stdio: 'pipe' });
    const size = fs.statSync(dest).size;
    console.log(`Created: uploads/${img.name} (${(size / 1024).toFixed(0)} KB)`);
  } catch (err) {
    console.error(`Failed: uploads/${img.name} - ${err.message}`);
  }
}

console.log(`\nSeed complete! ${count} files created.`);
