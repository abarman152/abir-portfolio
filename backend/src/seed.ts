import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

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

  // Skills
  const skillsExist = await prisma.skill.count();
  if (!skillsExist) {
    await prisma.skill.createMany({
      data: [
        { name: 'Python', level: 95, category: 'Data Science', order: 1 },
        { name: 'Machine Learning', level: 90, category: 'Data Science', order: 2 },
        { name: 'Deep Learning', level: 85, category: 'Data Science', order: 3 },
        { name: 'Data Visualization', level: 88, category: 'Data Science', order: 4 },
        { name: 'TensorFlow / PyTorch', level: 82, category: 'ML', order: 1 },
        { name: 'Scikit-learn', level: 92, category: 'ML', order: 2 },
        { name: 'NLP', level: 80, category: 'ML', order: 3 },
        { name: 'Computer Vision', level: 78, category: 'ML', order: 4 },
        { name: 'Node.js / Express', level: 85, category: 'Backend', order: 1 },
        { name: 'PostgreSQL', level: 82, category: 'Backend', order: 2 },
        { name: 'REST APIs', level: 90, category: 'Backend', order: 3 },
        { name: 'Docker', level: 75, category: 'Backend', order: 4 },
        { name: 'React / Next.js', level: 88, category: 'Frontend', order: 1 },
        { name: 'TypeScript', level: 85, category: 'Frontend', order: 2 },
        { name: 'Tailwind CSS', level: 90, category: 'Frontend', order: 3 },
        { name: 'Three.js', level: 70, category: 'Frontend', order: 4 },
      ],
    });
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
          title: 'International Best Researcher Award',
          description: 'Recognized at the Asia Research Award 2025 for outstanding contributions to data science and analytics research at an international level.',
          date: new Date('2025-01-01'),
          issuer: 'Asia Research Award 2025',
          type: 'Award',
          tags: ['Research', 'International', 'Data Science'],
          featured: true,
          visible: true,
          order: 1,
        },
        {
          title: 'Membership, American Chamber of Research',
          description: 'Inducted as a member recognizing contributions to research and innovation in computer science and data analytics.',
          date: new Date('2025-01-01'),
          issuer: 'American Chamber of Research',
          type: 'Professional',
          tags: ['Research', 'Membership', 'Professional'],
          featured: false,
          visible: true,
          order: 2,
        },
      ],
    });
  }

  // Certifications
  const certsExist = await prisma.certification.count();
  if (!certsExist) {
    await prisma.certification.createMany({
      data: [
        {
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
          title: 'Generative AI Mastermind Program',
          issuer: 'Outskill',
          issueDate: new Date('2026-01-01'),
          credentialId: '',
          credentialUrl: '',
          imageUrl: '',
          category: 'AI / Generative AI',
          description: 'Completed an advanced program focused on Generative AI concepts and real-world applications. Gained hands-on exposure to modern AI tools, model workflows, and practical implementation strategies. Mentored by Vaibhav Sisinty.',
          tags: ['Generative AI', 'LLMs', 'AI Systems'],
          featured: false,
          visible: true,
        },
      ],
    });
  }

  // Sample research papers
  const researchExist = await prisma.researchPaper.count();
  if (!researchExist) {
    await prisma.researchPaper.createMany({
      data: [
        {
          title: 'Anomaly Detection in IoT Sensor Networks Using Federated Learning',
          abstract: 'We propose a federated learning framework for real-time anomaly detection across distributed IoT sensor networks, achieving 97.3% detection accuracy while preserving data privacy.',
          authors: ['Abir Barman', 'Dr. Rahman', 'Prof. Chowdhury'],
          journal: 'IEEE IoT Journal',
          year: 2024,
          doi: '10.1109/JIOT.2024.0001',
          paperUrl: '',
          tags: ['Federated Learning', 'IoT', 'Anomaly Detection'],
          featured: true,
        },
        {
          title: 'Transformer-Based Time Series Forecasting for Financial Markets',
          abstract: 'A novel transformer architecture adapted for financial time series with attention mechanisms capturing both short and long-term temporal dependencies.',
          authors: ['Abir Barman', 'Prof. Islam'],
          journal: 'arXiv preprint',
          year: 2023,
          doi: '',
          paperUrl: '',
          tags: ['Transformers', 'Time Series', 'Finance'],
          featured: true,
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
        summary: 'Data analytics professional experienced in collecting, integrating, and preparing data using Python, SQL, and Microsoft Excel to support data-driven campaigns. Acted in analytics initiatives where I designed, developed, and reported insights through Microsoft Power BI dashboards, supporting business teams. Skilled in critical thinking, problem-solving, teamwork, project management, and adaptability, working in Agile environments to deliver reliable analytics that furthered campaign performance. Committed to continuous learning and improving analytics processes.',
        phone: '+91 8670321835',
        email: 'abirbarman@proton.me',
        linkedinUrl: 'https://linkedin.com/in/abir-barman',
        location: 'India',
        primaryPhoto: '',
        secondaryPhoto: '',
        showSummary: true,
        showEducation: true,
        showAchievements: true,
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

  console.log('Seed completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
