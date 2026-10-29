/* =====================================================================
   PORTFOLIO CONTENT
   The page builds the Work, Archive and Certificates sections from
   these lists, so adding something new only needs an entry here.

   featured[]  case-study cards
     title, type, year, summary, problem, built, result, stack[]
     images[]   up to 2 screenshots (first is the main one)
     github, live   optional links

   archive[]   smaller projects shown as a list
     title, type, stack[], image (hover preview), github, live

   certificates[]
     title, issuer, date, image, verify (optional credential link)
   ===================================================================== */

window.PORTFOLIO = {
  featured: [
    {
      title: 'EcoPilot',
      type: 'Hackathon',
      year: '2026',
      summary: 'An agentic AI carbon coach that turns a plain-language description of your week into a measurable reduction plan.',
      problem: 'Carbon calculators ask for dozens of numbers, and AI estimates of emissions are unreliable.',
      built: 'A Google Gemini agent extracts structured data from free text, then calls four deterministic tools that calculate, benchmark, rank and project, so every figure comes from tested code.',
      result: 'Scored 97.27 / 100 in an AI-evaluated code review and placed first at PromptWars 2026.',
      stack: ['React 19', 'TypeScript', 'Gemini API', 'Firebase', 'Cloud Run'],
      images: ['assets/work/ecopilot-1.jpg', 'assets/work/ecopilot-2.jpg'],
      github: 'https://github.com/chinmaymeshram1-wq/promptwar',
      live: 'https://promptwar-opal.vercel.app',
    },
    {
      title: 'AttritionIQ',
      type: 'Internship',
      year: '2026',
      summary: 'A workforce-risk platform that predicts which employees may leave and explains why.',
      problem: 'HR teams usually learn about attrition after people have already resigned.',
      built: 'A scikit-learn classifier with SHAP explanations, batch CSV scoring, a what-if simulator for pay and overtime changes, and a Gemini assistant that answers questions using each employee’s risk factors.',
      result: 'Built during my ML internship at Naviotech, with a FastAPI backend covered by 29 automated tests.',
      stack: ['React', 'TypeScript', 'FastAPI', 'Scikit-Learn', 'SHAP', 'Gemini'],
      images: ['assets/work/attritioniq-1.jpg', 'assets/work/attritioniq-2.jpg'],
      github: 'https://github.com/chinmaymeshram1-wq/AttritionIQ',
    },
    {
      title: 'LumiCity AI',
      type: 'Academic',
      year: '',
      summary: 'A smart street-lighting controller for a simulated city, with a live operations dashboard.',
      problem: 'Street lights on fixed timers burn energy when roads are empty and fail without anyone noticing.',
      built: 'A 36-pole city simulator driven by three models: Gradient Boosting for brightness, Random Forest for traffic forecasting and Isolation Forest for fault detection.',
      result: 'Around 42% energy saved against fixed timers in simulation, with faults flagged on the live map.',
      stack: ['Python', 'Scikit-Learn', 'JavaScript', 'Charts'],
      images: ['assets/work/lumicity-1.jpg', 'assets/work/lumicity-2.jpg'],
    },
    {
      title: 'CampusCare',
      type: 'Academic',
      year: '2026',
      summary: 'A complaint and service management platform connecting students, staff and administrators.',
      problem: 'Campus complaints get lost across emails and paper forms, with no way to track progress.',
      built: 'An Enterprise Java application (EJB, JPA, JAX-RS, JMS) with role-based dashboards, complaint routing, status timelines, notifications and department analytics.',
      result: 'Three complete role workflows, packaged with Docker for deployment.',
      stack: ['Jakarta EE 10', 'JPA', 'JAX-RS', 'JMS', 'Docker'],
      images: ['assets/work/campuscare-1.jpg', 'assets/work/campuscare-2.jpg'],
      github: 'https://github.com/chinmaymeshram1-wq/SDLII_Mini_Projects-2026-27_CSBS-TY',
    },
    {
      title: 'BIVAAE',
      type: 'Smart India Hackathon',
      year: '2026',
      summary: 'A blockchain investigation tool that helps law-enforcement agencies follow stolen crypto to an exchange.',
      problem: 'Tracing funds across many wallets and hops is slow, and attribution claims are hard to justify.',
      built: 'Parallel multi-wallet tracing, multi-path graph search, laundering-pattern detection and an evidence ledger that explains every confidence score.',
      result: 'Cleared the college round of Smart India Hackathon 2026.',
      stack: ['FastAPI', 'NetworkX', 'Next.js', 'TypeScript', 'React Flow'],
      images: ['assets/work/bivaae-1.jpg', 'assets/work/bivaae-2.jpg'],
    },
  ],

  archive: [
    {
      title: 'Society Management System',
      type: 'Web · Firebase',
      stack: ['JavaScript', 'Firestore'],
      image: 'assets/work/society-1.jpg',
      github: 'https://github.com/chinmaymeshram1-wq/Society-Managment-system',
      live: 'https://chinmaymeshram1-wq.github.io/Society-Managment-system/',
    },
    {
      title: 'ChurnScope',
      type: 'Machine learning',
      stack: ['Python', 'XGBoost', 'CatBoost', 'Flask'],
      image: 'assets/work/churnscope-1.jpg',
    },
    {
      title: 'KnowIT',
      type: 'AI · Web & Android',
      stack: ['Gemini Vision', 'Firebase', 'Kotlin'],
      image: 'assets/work/knowit-1.jpg',
    },
    {
      title: 'AplaPune',
      type: 'Web · Maps',
      stack: ['HTML', 'CSS', 'JavaScript'],
      image: 'assets/work/aplapune-1.jpg',
      github: 'https://github.com/chinmaymeshram1-wq/AplaPune',
    },
    {
      title: 'COVID-19 ML Dashboard',
      type: 'Data science',
      stack: ['Python', 'Machine Learning'],
      image: 'assets/work/covid-1.jpg',
      github: 'https://github.com/chinmaymeshram1-wq/COVID-19-ML-Dashboard',
    },
    {
      title: 'Early Smoke & Heat Detection',
      type: 'Hardware',
      stack: ['Arduino', 'C++', 'Sensors'],
      image: 'assets/work/arduino-1.jpg',
    },
  ],

  certificates: [
    { title: 'Machine Learning Internship', issuer: 'Naviotech Solution', date: '2026', image: 'assets/certificates/naviotech-internship.jpg' },
    { title: 'Red Hat Application Development I: Java EE (AD183)', issuer: 'Red Hat', date: '2026', image: 'assets/certificates/redhat-ad183.jpg', verify: 'https://www.credly.com/badges/4705fc5c-fe32-4aae-9bba-f7cfecd11b77' },
    { title: 'Red Hat System Administration I (RH124)', issuer: 'Red Hat', date: '2025', image: 'assets/certificates/redhat-rh124.jpg', verify: 'https://www.credly.com/badges/208e3c14-bd86-489c-8fe6-3cc724d4512e' },
    { title: 'Machine Learning Training', issuer: 'Naviotech Solution', date: '2026', image: 'assets/certificates/naviotech-training.jpg' },
    { title: 'AI Quiz Competition, Grade O', issuer: "JSPM's RSCOE", date: '2026', image: 'assets/certificates/ai-quiz.jpg' },
    { title: 'Build Your Business Brand Using Canva', issuer: 'Coursera', date: '', image: 'assets/certificates/canva-brand.jpg' },
    { title: 'Develop a Company Website', issuer: 'Coursera', date: '', image: 'assets/certificates/company-website.jpg' },
    { title: 'Getting Started with Microsoft Excel', issuer: 'Coursera', date: '', image: 'assets/certificates/excel.jpg' },
    { title: 'Certificate of Honour, Blood Donation', issuer: 'Akshay Blood Centre', date: '', image: 'assets/certificates/blood-donation.jpg' },
  ],
};
