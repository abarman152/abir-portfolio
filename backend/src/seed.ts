import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  // Admin
  const adminExists = await prisma.admin.count();
  if (!adminExists) {
    await prisma.admin.create({
      data: { email: 'admin@abirbarman.dev', password: await bcrypt.hash('Admin@123', 12) },
    });
    console.log('Admin created: admin@abirbarman.dev / Admin@123');
  }

  // Site settings
  const settingsExist = await prisma.siteSettings.count();
  if (!settingsExist) {
    await prisma.siteSettings.create({ data: {} });
  }

  // Stats
  const statsExist = await prisma.stat.count();
  if (!statsExist) {
    await prisma.stat.createMany({
      data: [
        { label: 'LeetCode Solved', value: 350, suffix: '+', icon: 'Code2', order: 1 },
        { label: 'GitHub Repos', value: 42, suffix: '', icon: 'Github', order: 2 },
        { label: 'Codeforces Rating', value: 1450, suffix: '', icon: 'Trophy', order: 3 },
        { label: 'Research Papers', value: 3, suffix: '', icon: 'FileText', order: 4 },
      ],
    });
  }

  // Social links
  const socialExist = await prisma.socialLink.count();
  if (!socialExist) {
    await prisma.socialLink.createMany({
      data: [
        { platform: 'GitHub', url: 'https://github.com/abirbarman', username: 'abirbarman', icon: 'Github', order: 1 },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/abirbarman', username: 'abirbarman', icon: 'Linkedin', order: 2 },
        { platform: 'LeetCode', url: 'https://leetcode.com/abirbarman', username: 'abirbarman', icon: 'Code2', order: 3 },
        { platform: 'Codeforces', url: 'https://codeforces.com/profile/abirbarman', username: 'abirbarman', icon: 'Trophy', order: 4 },
      ],
    });
  }

  // SkillCategory — upsert ensures idempotency
  const CATEGORY_DEFS = [
    { name: 'Data Science', order: 0 },
    { name: 'ML',           order: 1 },
    { name: 'Backend',      order: 2 },
    { name: 'Frontend',     order: 3 },
  ];
  for (const def of CATEGORY_DEFS) {
    await prisma.skillCategory.upsert({
      where:  { name: def.name },
      create: def,
      update: { order: def.order },
    });
  }
  const categoryMap = Object.fromEntries(
    (await prisma.skillCategory.findMany()).map((c) => [c.name, c.id]),
  );

  // Skills
  const skillsExist = await prisma.skill.count();
  if (!skillsExist) {
    await prisma.skill.createMany({
      data: [
        { name: 'Python',              level: 95, category: 'Data Science', categoryId: categoryMap['Data Science'], order: 1, isHighlighted: true  },
        { name: 'Machine Learning',    level: 90, category: 'Data Science', categoryId: categoryMap['Data Science'], order: 2, isHighlighted: false },
        { name: 'Deep Learning',       level: 85, category: 'Data Science', categoryId: categoryMap['Data Science'], order: 3, isHighlighted: false },
        { name: 'Data Visualization',  level: 88, category: 'Data Science', categoryId: categoryMap['Data Science'], order: 4, isHighlighted: false },
        { name: 'TensorFlow / PyTorch',level: 82, category: 'ML',           categoryId: categoryMap['ML'],           order: 1, isHighlighted: true  },
        { name: 'Scikit-learn',        level: 92, category: 'ML',           categoryId: categoryMap['ML'],           order: 2, isHighlighted: true  },
        { name: 'NLP',                 level: 80, category: 'ML',           categoryId: categoryMap['ML'],           order: 3, isHighlighted: true  },
        { name: 'Computer Vision',     level: 78, category: 'ML',           categoryId: categoryMap['ML'],           order: 4, isHighlighted: false },
        { name: 'Node.js / Express',   level: 85, category: 'Backend',      categoryId: categoryMap['Backend'],      order: 1, isHighlighted: false },
        { name: 'PostgreSQL',          level: 82, category: 'Backend',      categoryId: categoryMap['Backend'],      order: 2, isHighlighted: true  },
        { name: 'REST APIs',           level: 90, category: 'Backend',      categoryId: categoryMap['Backend'],      order: 3, isHighlighted: false },
        { name: 'Docker',              level: 75, category: 'Backend',      categoryId: categoryMap['Backend'],      order: 4, isHighlighted: true  },
        { name: 'React / Next.js',     level: 88, category: 'Frontend',     categoryId: categoryMap['Frontend'],     order: 1, isHighlighted: false },
        { name: 'TypeScript',          level: 85, category: 'Frontend',     categoryId: categoryMap['Frontend'],     order: 2, isHighlighted: false },
        { name: 'Tailwind CSS',        level: 90, category: 'Frontend',     categoryId: categoryMap['Frontend'],     order: 3, isHighlighted: false },
        { name: 'Three.js',            level: 70, category: 'Frontend',     categoryId: categoryMap['Frontend'],     order: 4, isHighlighted: false },
      ],
    });
  } else {
    // Migrate any existing skills that are missing a categoryId
    const unlinked = await prisma.skill.findMany({ where: { categoryId: null } });
    for (const skill of unlinked) {
      const catId = categoryMap[skill.category];
      if (catId) {
        await prisma.skill.update({ where: { id: skill.id }, data: { categoryId: catId } });
      }
    }
  }

  // Sample projects
  const projectsExist = await prisma.project.count();
  if (!projectsExist) {
    await prisma.project.createMany({
      data: [
        {
          slug: 'ml-sentiment-analyzer',
          title: 'ML Sentiment Analyzer',
          description: 'Real-time sentiment analysis platform using BERT fine-tuned on domain-specific data with a React dashboard.',
          longDesc: 'A production-grade NLP platform that processes customer reviews in real-time. Built with a fine-tuned BERT model achieving 94% accuracy on benchmark datasets. Features include batch processing, REST API, and an interactive dashboard for visualization.',
          techStack: ['Python', 'PyTorch', 'BERT', 'FastAPI', 'React', 'PostgreSQL'],
          imageUrl: '',
          screenshots: [],
          githubUrl: 'https://github.com/abirbarman',
          liveUrl: '',
          featured: true,
          order: 1,
        },
        {
          slug: 'stock-predictor',
          title: 'Stock Price Predictor',
          description: 'LSTM-based time series forecasting system for stock market predictions with backtesting dashboard.',
          longDesc: 'Advanced time series analysis using LSTM neural networks and technical indicators. Includes a backtesting framework, portfolio optimization, and real-time data pipeline from market APIs.',
          techStack: ['Python', 'TensorFlow', 'Pandas', 'Next.js', 'Chart.js'],
          imageUrl: '',
          screenshots: [],
          githubUrl: 'https://github.com/abirbarman',
          liveUrl: '',
          featured: true,
          order: 2,
        },
        {
          slug: 'data-pipeline-orchestrator',
          title: 'Data Pipeline Orchestrator',
          description: 'Scalable ETL pipeline with Apache Airflow, dbt transformations and real-time monitoring.',
          longDesc: 'Enterprise-grade data pipeline handling 10M+ events daily. Features automated data quality checks, lineage tracking, and a monitoring dashboard with alerting.',
          techStack: ['Python', 'Apache Airflow', 'dbt', 'PostgreSQL', 'Docker', 'Grafana'],
          imageUrl: '',
          screenshots: [],
          githubUrl: 'https://github.com/abirbarman',
          liveUrl: '',
          featured: true,
          order: 3,
        },
      ],
    });
  }

  // Achievements
  const achievementsExist = await prisma.achievement.count();
  if (!achievementsExist) {
    await prisma.achievement.createMany({
      data: [
        {
          slug: 'international-best-researcher-award',
          title: 'International Best Researcher Award',
          description: 'Recognized at the Asia Research Award 2025 for outstanding contributions to data science and analytics research at an international level.',
          date: new Date('2025-01-01'),
          issuer: 'Asia Research Award 2025',
          category: 'Award',
          tags: ['Research', 'International', 'Data Science'],
          featured: true,
          visible: true,
          order: 1,
        },
        {
          slug: 'membership-american-chamber-of-research',
          title: 'Membership, American Chamber of Research',
          description: 'Inducted as a member recognizing contributions to research and innovation in computer science and data analytics.',
          date: new Date('2025-01-01'),
          issuer: 'American Chamber of Research',
          category: 'Professional',
          tags: ['Research', 'Membership', 'Professional'],
          featured: false,
          visible: true,
          order: 2,
        },
      ],
    });
  }

  // Fix any existing achievements that were seeded without a slug
  const sluglessAchievements = await prisma.achievement.findMany({ where: { slug: null } });
  for (const ach of sluglessAchievements) {
    const base = slugify(ach.title);
    let candidate = base;
    let suffix = 1;
    while (await prisma.achievement.findFirst({ where: { slug: candidate, NOT: { id: ach.id } } })) {
      candidate = `${base}-${++suffix}`;
    }
    await prisma.achievement.update({ where: { id: ach.id }, data: { slug: candidate } });
    console.log(`Fixed slug for achievement: ${ach.title} → ${candidate}`);
  }

  // Certifications
  const certsExist = await prisma.certification.count();
  if (!certsExist) {
    await prisma.certification.createMany({
      data: [
        {
          slug: 'oracle-oci-ai-2025',
          title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
          issuer: 'Oracle',
          issueDate: new Date('2026-02-01'),
          credentialId: '103400391OCI25AICFA',
          credentialUrl: '',
          imageUrl: '',
          category: 'Cloud & AI',
          description: 'Foundational certification covering AI concepts, machine learning fundamentals, and OCI AI services.',
          tags: ['Oracle', 'Cloud', 'AI', 'Machine Learning'],
          featured: true,
          visible: true,
        },
        {
          slug: 'generative-ai-mastermind-program',
          title: 'Generative AI Mastermind Program',
          issuer: 'Outskill',
          issueDate: new Date('2026-01-01'),
          credentialId: '',
          credentialUrl: '',
          imageUrl: '',
          category: 'AI / Generative AI',
          description: 'Completed an advanced program focused on Generative AI concepts and real-world applications. Gained hands-on exposure to modern AI tools, model workflows, and practical implementation strategies. Mentored by Vaibhav Sisinty.',
          tags: ['Generative AI', 'LLMs', 'AI Systems'],
          featured: true,
          visible: true,
        },
      ],
    });
  }

  // Fix any existing certifications seeded without a slug; also ensure featured flags are correct
  const sluglessCerts = await prisma.certification.findMany({ where: { slug: null } });
  for (const cert of sluglessCerts) {
    const base = slugify(cert.title);
    let candidate = base;
    let suffix = 1;
    while (await prisma.certification.findFirst({ where: { slug: candidate, NOT: { id: cert.id } } })) {
      candidate = `${base}-${++suffix}`;
    }
    await prisma.certification.update({ where: { id: cert.id }, data: { slug: candidate } });
    console.log(`Fixed slug for certification: ${cert.title} → ${candidate}`);
  }

  // Ensure known certifications have correct featured + visible flags
  await prisma.certification.updateMany({
    where: { slug: 'generative-ai-mastermind-program' },
    data: { featured: true, visible: true },
  });
  await prisma.certification.updateMany({
    where: { title: { contains: 'Oracle Cloud Infrastructure 2025' } },
    data: { featured: true, visible: true },
  });

  // Sample research items
  const researchExist = await prisma.research.count();
  if (!researchExist) {
    await prisma.research.createMany({
      data: [
        {
          slug: 'quantum-bias-detection-nlp',
          title: 'Bridging Quantum Computing and NLP: A Novel Framework for Advanced Bias Detection with Next-Generation Computing',
          abstract: 'Proposes a hybrid quantum-classical framework for bias detection in NLP using quantum embeddings and kernel methods. Demonstrates improved accuracy and sensitivity for complex linguistic bias patterns.',
          overviewMd: '',
          authors: [
            { name: 'Abir Barman', role: 'Co-Author', isPrimary: true },
            { name: 'Dr. M.K. Jayanthi Kannan', role: 'Supervisor', isPrimary: false },
            { name: 'Anjali Yadav', role: 'Co-Author', isPrimary: false },
          ],
          publishedAt: new Date('2025-01-01'),
          publisher: 'IJFMR',
          publicationUrl: '',
          googleScholarUrl: '',
          tags: ['Quantum Computing', 'NLP', 'Bias Detection', 'Quantum ML'],
          featured: true,
          order: 1,
        },
        {
          slug: 'logix-ai-secure-login-quantum-resistant',
          title: 'LogiX: AI-Driven Secure Login System with Quantum-Resistant Algorithms and Multi-Factor Authentication',
          abstract: 'Introduces a secure authentication framework integrating post-quantum cryptography, anomaly detection, and adaptive multi-factor authentication to address evolving cybersecurity threats.',
          overviewMd: '',
          authors: [
            { name: 'Abir Barman', role: 'Co-Author', isPrimary: true },
            { name: 'Dr. M.K. Jayanthi Kannan', role: 'Supervisor', isPrimary: false },
            { name: 'Anjali Yadav', role: 'Co-Author', isPrimary: false },
          ],
          publishedAt: new Date('2025-03-01'),
          publisher: 'IJARIIT',
          publicationUrl: '',
          googleScholarUrl: '',
          tags: ['Cybersecurity', 'Quantum Cryptography', 'AI Security', 'Authentication'],
          featured: false,
          order: 2,
        },
        {
          slug: 'classification-neural-network-genetic-algorithm',
          title: 'Classification Using Neural Network and Genetic Algorithm',
          abstract: 'Explores a hybrid AI approach combining neural networks and genetic algorithms to optimize model structure and weights. Addresses limitations of traditional backpropagation by improving convergence speed and classification accuracy through evolutionary optimization.',
          overviewMd: '',
          authors: [
            { name: 'Abir Barman', role: 'Lead Author', isPrimary: true },
            { name: 'Muskan Sinha', role: 'Co-Author', isPrimary: false },
          ],
          publishedAt: new Date('2025-06-01'),
          publisher: 'New Delhi Publishers',
          publicationUrl: '',
          googleScholarUrl: '',
          tags: ['Neural Networks', 'Genetic Algorithm', 'Optimization', 'Machine Learning'],
          featured: false,
          order: 3,
        },
      ],
    });
  }

  // About Profile
  const aboutExists = await prisma.aboutProfile.count();
  if (!aboutExists) {
    await prisma.aboutProfile.create({
      data: {
        name: 'Abir Barman',
        title: 'Data Analytics Professional',
        subtitle: 'Data Collection & Preparation | Reporting & Insights Generation',
        summary: 'Data analytics professional experienced in collecting, integrating, and preparing data using Python, SQL, and Microsoft Excel to support data-driven campaigns.\n\nDesigned and delivered insights through Microsoft Power BI dashboards, supporting business teams with Agile project execution and cross-functional collaboration.\n\nSkilled in critical thinking, problem-solving, and adaptability. Committed to continuous learning and improving analytics processes.',
        phone: '+91 8670321835',
        email: 'abirbarman@proton.me',
        linkedinUrl: 'https://linkedin.com/in/abir-barman',
        githubUrl: 'https://github.com/abirbarman',
        leetcodeUrl: 'https://leetcode.com/u/abirbarman/',
        codechefUrl: 'https://www.codechef.com/users/abirbarman',
        location: 'India',
        showSummary: true,
        showEducation: true,
        showAchievements: true,
        showProjects: true,
        showSkills: true,
      },
    });
  }

  // Education
  const educationExists = await prisma.education.count();
  if (!educationExists) {
    await prisma.education.createMany({
      data: [
        {
          degree: 'Master of Computer Applications (MCA)',
          institution: 'VIT Bhopal University',
          location: 'Bhopal, Madhya Pradesh',
          startDate: '08/2024',
          endDate: '06/2026',
          description: '',
          order: 1,
          visible: true,
        },
        {
          degree: 'B.Sc. Computer Science Honours',
          institution: 'Kalyani Mahavidyalaya',
          location: 'Kalyani, West Bengal',
          startDate: '08/2021',
          endDate: '06/2024',
          description: '',
          order: 2,
          visible: true,
        },
      ],
    });
  }

  // About Skill Groups
  const aboutSkillsExist = await prisma.aboutSkillGroup.count();
  if (!aboutSkillsExist) {
    await prisma.aboutSkillGroup.createMany({
      data: [
        { category: 'Programming', skills: ['Python', 'SQL'], order: 1, visible: true },
        { category: 'Data Processing', skills: ['Data Cleaning', 'Data Transformation', 'Data Validation', 'CSV/JSON'], order: 2, visible: true },
        { category: 'Analytics Tools', skills: ['Microsoft Excel', 'Power BI'], order: 3, visible: true },
        { category: 'Databases', skills: ['PostgreSQL', 'RDBMS fundamentals'], order: 4, visible: true },
        { category: 'Development Tools', skills: ['Git', 'GitHub'], order: 5, visible: true },
        { category: 'Core Competencies', skills: ['Data Analysis', 'Reporting', 'Automation', 'Problem Solving', 'Attention to Detail'], order: 6, visible: true },
      ],
    });
  }

  // Hero Badges
  const heroBadgesExist = await prisma.heroBadge.count();
  if (!heroBadgesExist) {
    await prisma.heroBadge.createMany({
      data: [
        { label: 'AI / ML Systems',  position: 'top-right',    icon: 'Brain',      isActive: true, order: 0 },
        { label: '40+ Projects',     position: 'bottom-left',  icon: 'FolderOpen', isActive: true, order: 1 },
        { label: 'Research Work',    position: 'bottom-right', icon: 'BookOpen',   isActive: true, order: 2 },
      ],
    });
  }

  // NotificationSettings — singleton, safe to create once
  const notifExists = await prisma.notificationSettings.count();
  if (!notifExists) {
    await prisma.notificationSettings.create({ data: {} });
    console.log('NotificationSettings record created (all channels disabled by default)');
  }

  // About Section (Home page)
  const aboutSectionExists = await prisma.aboutSection.count();
  if (!aboutSectionExists) {
    await prisma.aboutSection.create({
      data: {
        headline: 'Turning raw data into',
        highlight: 'decisions that matter.',
        paragraphs: [
          "I'm a Data Scientist and ML Engineer who loves the full journey — from exploring messy datasets to shipping production systems that make a measurable difference.",
          "My work sits at the intersection of machine learning, research, and data storytelling. I build systems that don't just predict — they explain, alert, and act.",
          "Outside of professional work, I contribute to research in quantum computing, NLP, and evolutionary optimization, compete on platforms like LeetCode and Codeforces, and explore applied AI systems.",
        ],
        skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'PostgreSQL', 'Docker', 'Airflow', 'Quantum ML'],
        categories: [
          {
            title: 'Machine Learning',
            description: 'Designing and deploying ML models that solve real problems — from NLP and computer vision to anomaly detection and forecasting.',
            icon: 'Brain',
            color: '#6366f1',
          },
          {
            title: 'Data Engineering',
            description: 'Building robust data pipelines, ETL systems, and analytics infrastructure that make data reliable and decision-ready.',
            icon: 'Database',
            color: '#8b5cf6',
          },
          {
            title: 'Research & Innovation',
            description: 'Published researcher in quantum-enhanced NLP, post-quantum cryptography, and evolutionary optimization bridging theory with production systems.',
            icon: 'Lightbulb',
            color: '#f59e0b',
          },
        ],
      },
    });
    console.log('AboutSection seeded with default home-page content');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
