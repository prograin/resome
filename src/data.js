// data.js
// Single source of truth: bilingual dataset
window.PORTFOLIO_DATA_I18N = {
  en: {
    ui: {
      heroKicker: "Portfolio",
      rolesHint: "",
      contactHint:
        "Interested in collaboration, consulting, or a full-time role? Reach out via any channel below.",
      cvUrl: "#",

      nav: {
        roles: "Project type",
        skills: "Skills",
        projects: "Projects",
        experience: "Experience",
        education: "Education",
        contact: "Contact",
        about: "About",
      },

      sections: {
        roles: "Project type",
        skills: "Skills",
        projects: "Projects",
        experience: "Experience",
        education: "Education",
        contact: "Contact",
      },

      labels: {
        roles: "Roles",
        stack: "Stack",
        highlights: "Highlights",
        notes: "Notes",
      },

      pills: {
        privateNda: "Private / NDA",
        detailsUponRequest: "Details available upon request.",
      },

      modal: {
        projectDetails: "Project details",
        watchVideo: "Watch video",
        images: "Images",
      },

      buttons: {
        theme: "Theme",
        language: "FA",
        details: "Details",
        github: "GitHub",
        liveDemo: "Live demo",
        viewImages: "View images",
        watchVideo: "Watch video",
        clearRole: "Clear",
        url: "Website",
      },

      projectFilters: [
        {
          key: "all",
          name: "All work",
          hint: "Everything",
          icon: "layout-grid",
          roles: null,
        },
        {
          key: "websites",
          name: "Websites & shops",
          hint: "Sites, panels, payments",
          icon: "globe-2",
          roles: ["Frontend", "Fullstack"],
          projectIds: ["oildb", "rokesh-mehdi", "heychat"],
        },
        {
          key: "backend",
          name: "Backend & APIs",
          hint: "Services, auth, integrations",
          icon: "server",
          roles: ["Backend"],
        },
        {
          key: "data",
          name: "Data & dashboards",
          hint: "ETL, reports, analytics",
          icon: "database",
          roles: ["DataEng"],
        },
        {
          key: "ai",
          name: "AI & vision",
          hint: "ML, CV, deep learning",
          icon: "brain",
          roles: ["ML"],
        },
        {
          key: "desktop",
          name: "Desktop tools",
          hint: "Qt/PyQt apps",
          icon: "monitor",
          roles: ["Desktop"],
        },
      ],

      empty: {
        noProjectsTitle: "No projects match this filter.",
        noProjectsHint: "Clear the filter to view all projects.",
      },
    },

    personal: {
      name: "Ahmadreza Rezaei",
      title:
        "Data Engineer | Backend Engineer | Full-Stack Developer | Machine Learning Engineer",
      location: "Tehran, Iran",
      timezone: "GMT+3:30 (Tehran)",
      employmentType: "Full-time",
      workModes: ["On-site", "Remote", "Hybrid"],
      email: "ahmadreza.pcg1377@gmail.com",
      number: "989185240247+",
      links: {
        github: "https://github.com/prograin",
        linkedin: "https://www.linkedin.com/in/ahmadreza-rezaei-b60866304",
        youtube: "https://www.youtube.com/@Prograin_ARR",
      },
      about: `
Developer and researcher in Deep Learning and Backend Engineering, with experience designing and implementing RESTful APIs and working with modular, microservice, and event-driven architectures. Familiar with the Pub/Sub communication pattern and proficient in JavaScript, Python, and TypeScript.

Experienced in deploying projects to servers; working with Docker and Docker Compose; using Linux environments (Ubuntu, Debian); and designing software architecture.

Skilled in deep learning models, computer vision, and the mathematical foundations of artificial intelligence.

Hands-on experience with SQL and NoSQL databases such as MongoDB, Elasticsearch, ClickHouse, PostgreSQL, and BigQuery across both OLTP and OLAP projects. Interested in R&D roles focused on intelligent modeling and scalable systems, with a strong ability to solve complex problems.
`,
    },

    // IMPORTANT: roles have stable key used for filtering.
    roles: [
      {
        key: "Backend",
        name: "Backend",
        icon: "server",
        blurb: "APIs, auth, microservices, messaging.",
      },
      {
        key: "Frontend",
        name: "Frontend",
        icon: "layout",
        blurb: "Modern UI, responsive layouts, clean UX.",
      },
      {
        key: "Fullstack",
        name: "Fullstack",
        icon: "layers",
        blurb: "End-to-end systems, frontend to backend integration.",
      },
      {
        key: "DataEng",
        name: "Data Engineering & Analytics",
        icon: "database",
        blurb: "ETL, warehouses, analytics, monitoring.",
      },
      {
        key: "ML",
        name: "Machine Learning",
        icon: "brain",
        blurb: "Vision models, training pipelines, evaluation.",
      },
      {
        key: "Desktop",
        name: "Desktop Applications",
        icon: "monitor",
        blurb: "Qt/PyQt tooling, desktop UI systems.",
      },
    ],

    skills: [
      {
        category: "Backend",
        roles: ["Backend", "Fullstack"],
        items: [
          "Python",
          "FastAPI",
          "Express",
          "Node.js",
          "RESTful Architecture",
          "Authentication",
          "Authorization",
          "pytest",
          "Microservices",
          "Redis Streams",
          "Pub/Sub",
          "Elasticsearch",
          "Telegram Bot",
        ],
      },
      {
        category: "Data Engineering & Analytics",
        roles: ["DataEng"],
        items: [
          "ETL Pipelines",
          "Apache Airflow",
          "ClickHouse",
          "PostgreSQL",
          "Pandas",
          "Looker Studio",
          "Grafana",
          "Data Warehousing",
          "Data Transformation",
          "Data Automation",
        ],
      },
      {
        category: "Frontend",
        roles: ["Frontend", "Fullstack"],
        items: ["Nuxt.js", "React", "Vue", "Tailwind CSS"],
      },
      {
        category: "Cloud & Infrastructure",
        roles: ["Backend", "DataEng", "Frontend", "Fullstack"],
        items: [
          "Cloudflare",
          "Docker",
          "Docker Compose",
          "Linux (Debian)",
          "Nginx",
        ],
      },
      {
        category: "Desktop Applications",
        roles: ["Desktop"],
        items: ["Qt Creator", "PyQt", "Python Desktop UI"],
      },
      {
        category: "Machine Learning",
        roles: ["ML"],
        items: [
          "TensorFlow",
          "PyTorch",
          "CNN",
          "RNN",
          "LSTM",
          "Image Processing",
          "Data Augmentation",
        ],
      },
      {
        category: "Math & Fundamentals",
        roles: ["ML"],
        items: ["Linear Algebra", "Calculus", "Statistics"],
      },
    ],

    experience: [
      {
        company: "Al-Zahra Studio",
        role: "Data Engineer | Data Analyst | Full-Stack Developer",
        dates: "Dec 2024 – Present",
        url: "https://alzahravfx.com/",
        bullets: [
          "Actively analyzed organizational data, identified key challenges, and proposed data-driven solutions to optimize processes and support management decision-making.",
          "Designed and implemented an end-to-end Data Warehouse from architecture to deployment, including complex queries and automation for finance-related operations.",
          "Developed backend services using a microservices architecture with FastAPI (user management, logging, reporting) and implemented RESTful APIs for system integration.",
          "Worked hands-on with MongoDB, PostgreSQL, and BigQuery; implemented ETL pipelines and production data processing while adhering to data security principles.",
          "Used Pandas for data analysis, Pytest for automated testing, and applied Fernet encryption and hashing to protect sensitive information.",
          "Worked in server-based Linux environments and contributed to building resilient, scalable systems on real infrastructure.",
          "Proficient in Git for version control, team collaboration, and modular development in real-world, scalable projects.",
        ],
      },
      {
        company: "Black Wall",
        role: "Full Stack Developer",
        dates: "April 2026 – Present",
        url: "https://black-wall.org/",
        bullets: [
          "Developed and maintained both frontend and backend systems with a focus on stability, performance, and scalability.",
          "Implemented and managed authentication and authorization systems to enhance security and access control.",
          "Designed and developed user interfaces (UI) and backend logic to deliver a smooth and integrated user experience.",
          "Handled database migrations and optimized database structures throughout development and deployment processes.",
          "Managed databases, configured infrastructure, and deployed projects on Cloudflare as well as internal servers.",
          "Set up and maintained internal and local databases for organizational systems and services.",
          "Deployed and maintained websites and internal platforms with a focus on availability, security, and developer experience.",
        ],
      },
      {
        company: "Asr-e Maharat",
        role: "Advanced Python & Django Instructor | Private Training",
        dates: "1 year",
        url: "https://asremaharat.com/",
        bullets: [
          "Taught advanced Python and Django in private training sessions, focused on practical coding, problem solving, and real project patterns.",
          "Helped learners move beyond syntax into cleaner code structure, debugging habits, modular thinking, and working with common Python libraries.",
          "Covered Django fundamentals, models, views, routing, templates, and practical web development workflows.",
          "Adapted lessons to each student's level so technical concepts stayed approachable and useful.",
        ],
      },
      {
        company: "VAYO Tech Studio",
        role: "Software Developer | Data Engineer",
        dates: "May 2023 – Dec 2024",
        bullets: [
          "Designed and developed application UI using Qt, leveraging strong HTML and CSS skills to deliver a smooth, user-friendly experience.",
          "Implemented a data storage system using two approaches: managing hierarchical data with JSON files (NoSQL-style) and combining it with XML structures to optimize persistence and retrieval.",
          "Used SQLite to store and manage structured, tabular data similar to Excel-like datasets.",
          "Built practical tools for managing files, documents, and data with a focus on accuracy, speed, and efficiency.",
          "Highly proficient in Python and applied it in practical projects and production environments.",
          "Successful remote work experience with strong time management, teamwork, and consistent, effective reporting.",
          "Worked with SVN for version control, team collaboration, and tracking changes in software development projects.",
        ],
      },
    ],

    education: [
      {
        school: "Arak University",
        degree: "Bachelor’s Degree in Materials Engineering",
        dates: "2017 – 2021",
        details: [],
      },
    ],

    projects: [
      {
        id: "heychat",
        title: "HeyChat",
        shortDescription:
          "Interest- and job-based connection & messaging platform built on microservices with event-driven processing, search, and gateway-level auth.",
        roles: ["Backend", "DataEng", "Frontend"],
        tags: [
          "Python",
          "FastAPI",
          "PostgreSQL",
          "Redis Streams",
          "Pub/Sub",
          "Elasticsearch",
          "Caching",
          "Docker Compose",
          "Nginx",
          "React",
          "Telegram Bot",
          "Telegram Auth Widget",
          "Authentication",
          "Authorization",
          "API Gateway",
          "TailwindCSS",
          "Atomic Design",
          "Feature-based Architecture",
        ],
        highlights: [
          "Microservice architecture with modular services where appropriate",
          "Event-driven design using Redis Streams + selective Redis Pub/Sub",
          "API Gateway enforcing authentication & authorization for all requests",
          "Elasticsearch-powered search with PostgreSQL persistence and caching to reduce redundant reads",
        ],
        details: [
          "Delivered core product features: add contacts, block/unblock, user search, profile viewing, chat requests, and user-to-user connections.",
          "Designed inter-service communication with a hybrid approach: event-driven flows for key operations and REST APIs for service coordination where needed.",
          "Built the frontend with React using a feature-based structure and proper Hooks usage; styled with Tailwind and implemented UI components following atomic design principles for future scalability.",
          "Implemented authentication via Telegram Authenticate Widget to issue user tokens and streamline onboarding (Telegram bot is the primary interaction surface).",
          "Implemented search with Elasticsearch and stored system-of-record data in PostgreSQL; introduced caching to improve performance and prevent duplicate requests.",
          "Used Docker Compose for service orchestration and exposed services through a unified entry; placed an Nginx reverse proxy in the request path for load balancing and route management.",
          "Designed and implemented RESTful routes with careful resource naming; enforced access policies through gateway-level authentication and authorization.",
        ],
        links: {
          github: "https://github.com/prograin/heychat",
          liveDemo: null,
        },
        media: { videoUrl: null, images: [] },
        isPrivate: false,
      },

      {
        id: "oildb",
        title: "Black Wall / Oil-DB",
        shortDescription:
          "A production Black Wall ecommerce/business project with a public contact flow plus a private full-stack Oil-DB panel built with Nuxt, Cloudflare, and D1.",
        roles: ["DataEng", "Backend", "Frontend", "Fullstack"],
        tags: [
          "Ecommerce Website",
          "Business Website",
          "Nuxt.js",
          "Vue",
          "Cloudflare",
          "Cloudflare D1",
          "SQLite",
          "Database Migrations",
          "Authentication",
          "Tailwind CSS",
          "Composables",
          "Full-Stack",
          "Production Deployment",
        ],
        highlights: [
          "Built and maintained the Black Wall production website and its related private Oil-DB panel",
          "Structured the public contact path so visitors can reach the business quickly",
          "Built on Cloudflare infrastructure with Cloudflare D1 (SQLite) as the primary database",
          "Implemented multiple database migrations to evolve schema safely over time",
          "Nuxt + Vue UI with Tailwind CSS for a clean, responsive user experience",
          "Modular architecture using reusable components and composables",
        ],
        details: [
          "Black Wall and Oil-DB refer to the same project area, so they are presented as one portfolio item instead of two separate cards.",
          "The public Black Wall website focuses on a clear business/contact journey, while the private Oil-DB side covers the internal full-stack data panel.",
          "I used Cloudflare for deployment and infrastructure, with Cloudflare D1 as the database layer for the private panel.",
          "A key part of the work was designing the database schema and implementing multiple migrations to safely evolve tables, relationships, and constraints as requirements changed.",
          "The UI was built with Nuxt and Vue, styled with Tailwind CSS, focusing on clarity, responsiveness, and maintainability.",
          "On the engineering side, the project follows a modular structure: composables encapsulate reusable business logic while components keep the interface clean and scalable.",
          "The main technical challenges centered around relational data modeling and ensuring data integrity across entities—solved through careful schema design, iterative migrations, and robust full-stack integration in Nuxt.",
        ],
        links: {
          url: "https://black-wall.org/",
          github: null,
          liveDemo: null,
        },
        media: { videoUrl: "", images: [] },
        isPrivate: false,
      },

      {
        id: "rokesh-mehdi",
        title: "Rokesh Mehdi",
        shortDescription:
          "A production PHP website for Rokesh Mehdi with custom-built backend, payment flow, Enamad trust setup, ZarinPal integration, SMS notifications, and an articles section.",
        roles: ["Backend", "Frontend", "Fullstack"],
        tags: [
          "PHP",
          "MySQL",
          "HTML",
          "CSS",
          "JavaScript",
          "ZarinPal",
          "Enamad",
          "Melipayamak",
          "SMS Gateway",
          "Payment Gateway",
          "SEO",
          "Articles",
        ],
        highlights: [
          "Built the website and backend flow from scratch with PHP",
          "Integrated ZarinPal for online payments and handled transaction flow",
          "Prepared and connected Enamad requirements for trust and sales readiness",
          "Connected Melipayamak for SMS-based notifications and operational messages",
          "Added an articles section to support site content and SEO",
        ],
        details: [
          "Designed and implemented the website as a complete production project, covering both the public pages and backend logic.",
          "Implemented payment handling with ZarinPal and connected the website to the required trust and verification setup for Enamad.",
          "Integrated Melipayamak so the site can send important SMS messages for user and business workflows.",
          "Created a simple content/articles section so non-technical visitors can browse useful site content without needing to understand the underlying stack.",
          "Focused on practical deployment, maintainability, and a clear user journey for visitors who just want to move through the site quickly.",
        ],
        links: {
          url: "https://rokesh-mehdi.ir",
          github: null,
          liveDemo: null,
        },
        media: { videoUrl: null, images: [] },
        isPrivate: false,
      },

      {
        id: "analytical-dashboard",
        title: "Analytical Dashboard",
        shortDescription:
          "Confidential ETL + warehouse + dashboards for KPI-driven reporting and monitoring.",
        roles: ["DataEng"],
        tags: [
          "ETL Pipelines",
          "Apache Airflow",
          "PostgreSQL",
          "ClickHouse",
          "Looker Studio",
          "Grafana",
          "Linux (Debian)",
        ],
        highlights: [
          "Incremental ingestion strategies",
          "Warehousing (PostgreSQL + ClickHouse)",
          "Airflow scheduling",
          "KPI dashboards",
        ],
        details: [
          "Designed and deployed a real-time analytical dashboard at Al-Zahra Studio to monitor team performance, manage tasks, and analyze project progress across Finance, Executive Management, Coordination, and Project Management teams.",
          "Built an ETL pipeline to retrieve, cleanse, and transform data from an internal API, with both full and incremental loads updated every 2 hours.",
          "Loaded processed data into a data warehouse and created optimized SQL-based tables for fast and reliable analysis.",
          "Developed a dashboard with 13 charts across 5 pages and 5 tailored KPIs, enabling filtering by project and time range for managers and analysts.",
          "Automated script execution using Windows Task Scheduler and maintained version control of code and queries with Git.",
          "Improved reporting accuracy and efficiency for Finance, enhanced cross-department insights for Executive Management, enabled real-time monitoring for Coordination, and facilitated faster decision-making for Project Management.",
          "Addressed challenges in data structuring, visualization, and warehouse design with a hybrid full/incremental update approach, ensuring scalable and reliable data processing.",
          "Laid the groundwork for future improvements, including event-based updates and flexible reporting in line with upcoming corporate data policies.",
        ],
        links: { github: null, liveDemo: null },
        media: { videoUrl: null, images: [] },
        isPrivate: true,
      },

      {
        id: "freelancer-etl-dashboard",
        title: "Freelancer Management ETL",
        shortDescription:
          "Automated ETL pipeline to monitor freelancer work hours, task progress, and performance metrics using Python and Google Sheets.",
        roles: ["DataEng"],
        tags: [
          "Python",
          "ETL",
          "Airflow",
          "Google Sheets",
          "API Integration",
          "Data Automation",
          "Task Management",
        ],
        highlights: [
          "Designed ETL pipeline for freelancer activity monitoring",
          "Aggregated key metrics: work hours, task durations, completion times, and statuses",
          "Interactive reporting via Google Sheets for the Finance team",
          "Automated workflows using Airflow DAGs for reliable, scheduled updates",
          "Improved transparency and decision-making for freelancer management",
        ],
        details: [
          "Developed a scalable ETL system to track and analyze freelancer performance across multiple projects.",
          "Extracted data from APIs, processed and transformed it using Python, and calculated metrics including hours worked, task completion times, task durations, and current task statuses.",
          "Integrated with Google Sheets to provide a live, interactive dashboard accessible to the Finance team for tracking and reporting.",
          "Scheduled and orchestrated ETL jobs with Airflow DAGs, ensuring automated, reliable, and timely updates.",
          "Optimized data processing for accuracy, efficiency, and scalability to accommodate future growth.",
          "Enabled better operational transparency and empowered the Finance team with actionable insights for managing freelancer workload and productivity.",
        ],
        links: { github: null, liveDemo: null },
        media: { videoUrl: null, images: [] },
        isPrivate: true,
      },

      {
        id: "notification-system",
        title: "Notification System",
        shortDescription:
          "Confidential FastAPI service for scheduled notifications with Telegram integration and secure auth.",
        roles: ["Backend"],
        tags: [
          "Python",
          "FastAPI",
          "PostgreSQL",
          "Authentication",
          "Authorization",
          "Telegram Bot",
          "pytest",
        ],
        highlights: [
          "Secure auth",
          "Telegram integration",
          "Scheduling",
          "Testable architecture",
          "Real-time task status notifications",
          "Automated daily summary reports",
        ],
        details: [
          "Developed a confidential notification system as a FastAPI backend service, integrated with Telegram to deliver timely updates to users.",
          "Connected the system to the main project management platform to monitor task statuses in real time.",
          "Implemented automatic notifications when a task status changes, ensuring users are immediately informed of progress.",
          "Designed reminders for tasks exceeding expected durations, helping users stay on track and manage deadlines efficiently.",
          "Delivered daily summary reports to users, providing an overview of completed, pending, and delayed tasks.",
          "Focused on secure authentication, authorization, and scalable architecture to handle multiple users and notifications reliably.",
          "Built with testable design patterns to ensure maintainability, reliability, and easy integration with future features.",
        ],
        links: { github: null, liveDemo: null },
        media: { videoUrl: null, images: [] },
        isPrivate: true,
      },

      {
        id: "report-bot",
        title: "Report Bot",
        shortDescription:
          "Confidential Telegram analytics bot + FastAPI backend with MongoDB and automated reporting flows.",
        roles: ["Backend", "DataEng"],
        tags: [
          "Python",
          "FastAPI",
          "Telegram Bot",
          "Matplotlib",
          "Data Analytics",
          "Predictions",
        ],
        highlights: [
          "Automated report generation",
          "Interactive Telegram delivery",
          "Graphical visualization with Matplotlib",
          "Customizable metrics and filters for users",
          "Prediction charts on demand",
          "Supports manager-level dashboards",
        ],
        details: [
          "Developed a Telegram bot that delivers automated reports and visual analytics to users based on their selected metrics.",
          "Connected the bot to data sources and generated graphs and charts using Matplotlib for intuitive visualization of trends, performance, and key metrics.",
          "Enabled prediction visualizations so users can see forecasted outcomes for tasks or projects if they choose.",
          "Provided manager-specific reporting, giving high-level insights and summaries for team oversight.",
          "Designed the system to integrate seamlessly with existing project management platforms and notification systems.",
          "Focused on flexible, user-driven reports, allowing each user to select the data and visualizations they want to receive.",
          "Ensured scalability, reliability, and secure interaction with Telegram and backend services.",
        ],
        links: {
          github: null,
          liveDemo: null,
        },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1nUgbwAzzEU3B5acAwckE_pqG8-rjVuNP/view?usp=drive_link",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "vdoc",
        title: "vDoc",
        shortDescription:
          "Confidential desktop document system with XML/HTML storage and hierarchical tree visualization.",
        roles: ["DataEng", "Desktop"],
        tags: ["PyQt", "Qt Creator", "XML", "HTML", "Desktop UI"],
        highlights: [
          "Rich text editing + autosave",
          "XML/HTML document storage",
          "Hierarchical folder/tree management",
          "Header indexing & quick in-document navigation",
          "Desktop UI built with PyQt/Qt Creator",
        ],
        details: [
          "vDoc is a private/NDA desktop application built to manage and organize documents with a structured, scalable approach.",
          "It includes a full text management layer: creating, editing, and maintaining documents with an autosave workflow to prevent data loss and keep edits continuously synced.",
          "Documents are stored using XML/HTML formats to preserve structure and enable reliable persistence, searchability, and future extensibility.",
          "The app provides hierarchical (tree-based) folder management, making it easy to categorize large collections of files and navigate them like a lightweight knowledge base.",
          "For long documents, vDoc supports header indexing and smooth navigation—users can jump between sections quickly and move through content with minimal friction.",
          "Built with PyQt and Qt Creator, the UI focuses on speed, clarity, and an editor-first workflow designed for daily, intensive usage.",
          "Private / NDA project. Additional technical details can be shared upon request.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1ogetJtmWDpi-1iOFq9u6PaLGCmRzEHjb/view?usp=sharing",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "bmc",
        title: "BMC",
        shortDescription:
          "A confidential Excel-like desktop system focused on structured persistence, database-backed workbooks, and a formula engine for dynamic, editable tables.",
        roles: ["DataEng"],
        tags: [
          "XML",
          "Persistence",
          "Formula Parsing",
          "Data Modeling",
          "Desktop UI",
          "File I/O",
        ],
        highlights: [
          "Excel-like workbook management with save/load",
          "Database-backed (.db) file persistence",
          "Formula engine (parse, evaluate, display)",
          "Editable tables with sheet (tab) add/remove",
          "Text and cell editing with structured data modeling",
        ],
        details: [
          "BMC is a private/NDA Excel-like desktop application designed for managing structured tabular data with reliable persistence and a smooth editing experience.",
          "It supports saving and loading workbook files in a database-backed (.db) format—enabling consistent storage, fast reloads, and scalable data organization.",
          "Users can create and manage multiple sheets (tabs), add/remove sheets as needed, and work with editable tables that behave similarly to spreadsheets.",
          "A built-in formula engine allows users to write formulas, parse and evaluate expressions, and display computed results while keeping the original formulas accessible and editable.",
          "The system includes full table editing capabilities—editing cell text, updating values, and maintaining structured data integrity across sheets and persisted files.",
          "Private / NDA project. Additional implementation details can be shared upon request.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1lakH1BSma0JWRzMAMTDgBFkS1u2JA3Kf/view?usp=drive_link",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "mgv",
        title: "Matrix Graphical Visualization (MGV)",
        shortDescription:
          "PyQt6 desktop app for interactive matrix visualization, formula-driven tables, and Python-powered animations with an embedded code editor.",
        roles: ["Desktop"],
        tags: [
          "PyQt6",
          "Qt Creator",
          "Python",
          "Desktop UI",
          "Linear Algebra",
          "2D Graphics",
          "Formula Parsing",
        ],
        highlights: [
          "2D Graphics View (row-space / column-space visualization)",
          "Customizable color management for matrix items",
          "Table-based matrix editing with formula support",
          "Matrix-to-graphics conversion (values → 2D items)",
          "Embedded Python editor with improved autocompletion + syntax highlighting",
          "Python-driven animation of matrix visualizations (2D + colorized)",
        ],
        details: [
          "MGV (Matrix Graphical Visualization) is a PyQt6-based desktop application built to make matrix exploration more visual, interactive, and programmable.",
          "It introduces a dedicated 2D Graphics View that can visualize matrices in row space or column space, with flexible color controls to improve readability and separation of elements.",
          "The Table View supports end-to-end matrix value management: editing values, converting table data into 2D graphical items, and writing formulas directly in cells for faster manipulation and experimentation.",
          "MGV includes an advanced embedded Python editor with stronger autocompletion and a syntax highlighter, enabling users to write clean scripts to control behavior and workflows inside the app.",
          "A key capability is animation: users can generate animated matrix visualizations using Python code—both as 2D graphics sequences and colorized transitions—making it useful for demos, teaching, and simulation-style exploration.",
        ],
        links: {
          github: "https://github.com/prograin/Matrix_repre_py",
          liveDemo: null,
        },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1Zkx_dxIfF9TCKFLTbI0GZcuxtdLTlwxh/view?usp=drive_link",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "steel-defect-detection",
        title: "Steel Defect Detection",
        shortDescription:
          "Industrial computer vision system for defect detection and localization using TensorFlow + EfficientNetB0, mask-driven training, and a custom loss for bbox/confidence/classification.",
        roles: ["ML"],
        tags: [
          "TensorFlow",
          "EfficientNetB0",
          "Computer Vision",
          "Object Detection",
          "Image Processing",
          "Albumentations",
          "Data Augmentation",
          "Custom Loss",
          "CNN",
        ],
        highlights: [
          "Defect detection + localization in industrial images",
          "EfficientNetB0 backbone with custom conv/dense heads",
          "Grid-based output (7×7) for location-aware predictions",
          "Custom loss for bounding boxes, confidence, and classification",
          "Mask-based dataset preprocessing + strong augmentations (Albumentations)",
          "Trained for 100 epochs and evaluated on diverse test images",
        ],
        details: [
          "This project focuses on automated defect detection in industrial steel manufacturing, aiming to improve quality control by accurately detecting and localizing defects in images.",
          "I used a public dataset containing defect masks and built a preprocessing pipeline to prepare training targets and improve robustness. Data diversity was increased using Albumentations-based augmentations to help the model generalize to real-world variations.",
          "The model is built with TensorFlow and uses EfficientNetB0 as the feature extractor, followed by a custom head. Outputs are produced as a 7×7 grid to enable location-aware predictions and more precise defect localization.",
          "To optimize detection quality, I implemented a custom loss function that jointly learns bounding box regression, confidence estimation, and defect classification—improving convergence and feature learning under challenging defect patterns.",
          "The network was trained for 100 epochs and tested across multiple scenarios. The results demonstrate reliable defect detection and localization, with example outputs provided in the project media and repository.",
        ],
        links: {
          github: "https://github.com/prograin/Steel-defect-detection",
          liveDemo: null,
        },
        media: {
          videoUrl: null,
          images: [
            "./assets/images/steel_defect_1.png",
            "./assets/images/steel_defect_2.png",
          ],
        },
        isPrivate: false,
      },

      {
        id: "flooded-area-segmentation",
        title: "Flooded Area Detection & Segmentation",
        shortDescription:
          "U-Net-based deep learning model for detecting flooded regions from aerial imagery, optimized with EfficientNet-B4 and custom techniques.",
        roles: ["ML"],
        tags: [
          "U-Net",
          "EfficientNet-B4",
          "Image Segmentation",
          "Deep Learning",
          "Dice Loss",
          "Data Augmentation",
        ],
        highlights: [
          "Designed U-Net with EfficientNet-B4 backbone for flood segmentation",
          "Implemented custom decoder and Dice Loss function",
          "Applied data augmentation and smart training callbacks",
          "Evaluated model performance with visual segmentation outputs",
        ],
        details: [
          "Developed a deep learning pipeline to detect flooded areas from aerial imagery.",
          "Used U-Net architecture with EfficientNet-B4 as the encoder backbone and a custom decoder for improved segmentation accuracy.",
          "Implemented a custom Dice Loss function and data augmentation techniques to enhance model robustness.",
          "Applied callbacks for model checkpointing, logging, and dynamic learning rate adjustments during training.",
          "Tested the model on a separate dataset and analyzed segmentation performance through visual output images.",
          "Project code and further details are available on GitHub for reference and replication.",
        ],
        links: {
          github: "https://lnkd.in/du2Xe3jV",
          liveDemo: null,
        },
        media: {
          videoUrl: null,
          images: [
            "./assets/images/flood_area_1.png",
            "./assets/images/flood_area_2.png",
          ],
        },
        isPrivate: false,
      },

      {
        id: "cnn-rectangle-predict",
        title: "CNN Rectangle Prediction",
        shortDescription:
          "A hands-on CNN experiment to predict rectangle geometry from synthetic images.",
        roles: ["ML"],
        tags: [
          "Convolutional Neural Networks",
          "Image Processing",
          "Deep Learning",
          "Python",
          "Synthetic Dataset",
        ],
        highlights: [
          "Custom dataset generation with random rectangles",
          "CNN-based feature extraction with BatchNorm and Dropout",
          "Regression of rectangle center, width, and height",
          "Visualization of predictions vs ground truth",
        ],
        details: [
          "Generated a synthetic dataset of 100x100 images containing randomly placed rectangles.",
          "Designed and trained a CNN followed by a fully connected network to regress geometric parameters.",
          "Evaluated model performance using loss curves and correlation analysis between predictions and true values.",
          "Visualized test samples by overlaying predicted rectangle centers against ground-truth centers.",
          "Project focused on practical understanding of CNNs and image-based regression tasks.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl: null,
          images: [
            "./assets/images/rect_predict_3.png",
            "./assets/images/rect_predict_2.png",
            "./assets/images/rect_predict_1.png",
          ],
        },
        isPrivate: false,
      },

      {
        id: "mnist-digit-recognition",
        title: "Handwritten Digit Recognition",
        shortDescription:
          "CNN-based handwritten digit recognition system using PyTorch and MNIST with an interactive drawing interface.",
        roles: ["ML"],
        tags: [
          "PyTorch",
          "CNN",
          "MNIST",
          "Image Processing",
          "OpenCV",
          "PyQt",
          "PIL",
        ],
        highlights: [
          "CNN + FFN architecture for digit classification",
          "Interactive PyQt widget for real-time digit drawing",
          "Image preprocessing using OpenCV and PIL",
          "End-to-end inference from user input to prediction",
        ],
        details: [
          "Built a deep learning model combining CNN layers for feature extraction and a feedforward network for digit classification.",
          "Trained and evaluated the model using the MNIST handwritten digits dataset.",
          "Developed an interactive PyQt widget allowing users to draw digits directly on the screen.",
          "Applied OpenCV for contour detection and PIL for resizing and enhancing image quality before inference.",
          "Project focused on hands-on experience with deep learning workflows and real-time user interaction.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1LdBkhb8vczB2nLgRt6KQdUpeZrnfd-Xt/view?usp=sharing",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "realtime-sentiment-analysis",
        title: "Real-Time Sentiment Analysis",
        shortDescription:
          "Comparative study of LSTM models with Self-Attention for real-time sentiment prediction.",
        roles: ["ML"],
        tags: [
          "Natural Language Processing",
          "LSTM",
          "Self-Attention",
          "Deep Learning",
          "Real-Time Inference",
        ],
        highlights: [
          "Multiple LSTM models enhanced with Self-Attention mechanisms",
          "Live sentiment prediction with visual feedback",
          "Model comparison based on correct vs incorrect predictions",
          "Hyperparameter tuning and performance analysis",
        ],
        details: [
          "Developed and evaluated multiple LSTM-based sentiment analysis models enhanced with Self-Attention.",
          "Compared model performance using real-time predictions on positive and negative sentiment data.",
          "Analyzed prediction accuracy across models, identifying strengths and weaknesses in generalization.",
          "Visualized correct predictions in green and incorrect predictions in red for intuitive performance analysis.",
          "Explored the impact of hyperparameter tuning and identified areas requiring further refinement.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1XS8i8TK-3Nb9ZLL_JLHv2IA9Pgy9U3FD/view?usp=drive_link",
          images: [],
        },
        isPrivate: false,
      },
    ],
  },

  fa: {
    ui: {
      heroKicker: "نمونه‌کارها",
      rolesHint: "",
      contactHint:
        "برای همکاری، مشاوره یا موقعیت تمام‌وقت پیام بدهید. از هر کدام از راه‌های زیر می‌توانید ارتباط بگیرید.",
      cvUrl: "#",

      nav: {
        roles: "نوع پروژه‌ها",
        skills: "مهارت‌ها",
        projects: "پروژه‌ها",
        experience: "سوابق کاری",
        education: "تحصیلات",
        contact: "تماس",
        about: "درباره من",
      },

      sections: {
        roles: "نوع پروژه‌ها",
        skills: "مهارت‌ها",
        projects: "پروژه‌ها",
        experience: "سوابق کاری",
        education: "تحصیلات",
        contact: "تماس",
      },

      labels: {
        roles: "نقش‌ها",
        stack: "تکنولوژی‌ها",
        highlights: "نکات کلیدی",
        notes: "توضیحات",
      },

      pills: {
        privateNda: "خصوصی / NDA",
        detailsUponRequest: "جزئیات در صورت درخواست ارائه می‌شود.",
      },

      modal: {
        projectDetails: "جزئیات پروژه",
        watchVideo: "تماشای ویدیو",
        images: "تصاویر",
      },

      buttons: {
        theme: "Theme",
        language: "EN",
        details: "جزئیات",
        github: "گیت‌هاب",
        liveDemo: "دموی آنلاین",
        viewImages: "مشاهده تصاویر",
        watchVideo: "تماشای ویدیو",
        clearRole: "پاک کردن",
        url: "مشاهده سایت",
      },

      projectFilters: [
        {
          key: "all",
          name: "همه",
          hint: "تمام نمونه‌کارها",
          icon: "layout-grid",
          roles: null,
        },
        {
          key: "websites",
          name: "سایت و فروشگاه",
          hint: "سایت، پنل، پرداخت",
          icon: "globe-2",
          roles: ["Frontend", "Fullstack"],
          projectIds: ["oildb", "rokesh-mehdi", "heychat"],
        },
        {
          key: "backend",
          name: "بک‌اند و API",
          hint: "سرویس، لاگین، اتصال‌ها",
          icon: "server",
          roles: ["Backend"],
        },
        {
          key: "data",
          name: "داده و داشبورد",
          hint: "گزارش، ETL، تحلیل",
          icon: "database",
          roles: ["DataEng"],
        },
        {
          key: "ai",
          name: "هوش مصنوعی",
          hint: "بینایی ماشین و مدل‌ها",
          icon: "brain",
          roles: ["ML"],
        },
        {
          key: "desktop",
          name: "ابزار دسکتاپ",
          hint: "برنامه‌های Qt/PyQt",
          icon: "monitor",
          roles: ["Desktop"],
        },
      ],

      empty: {
        noProjectsTitle: "هیچ پروژه‌ای با این فیلتر تطابق ندارد.",
        noProjectsHint: "برای مشاهده همه پروژه‌ها، فیلتر را پاک کنید.",
      },
    },

    personal: {
      name: "Ahmadreza Rezaei",
      title:
        "مهندس داده | مهندس بک‌اند | توسعه‌دهنده فول‌استک | مهندس یادگیری ماشین",
      location: "تهران، ایران",
      timezone: "GMT+3:30 (تهران)",
      employmentType: "تمام‌وقت",
      workModes: ["حضوری", "دورکاری", "هیبرید"],
      email: "ahmadreza.pcg1377@gmail.com",
      number: "989185240247+",
      links: {
        github: "https://github.com/prograin",
        linkedin: "https://www.linkedin.com/in/ahmadreza-rezaei-b60866304",
        youtube: "https://www.youtube.com/@Prograin_ARR",
      },
      about: `
توسعه‌دهنده و پژوهشگر در حوزه‌ی یادگیری عمیق و مهندسی بک‌اند، با تجربه‌ی طراحی و پیاده‌سازی APIهای RESTful و کار با معماری‌های ماژولار، میکروسرویس و رویدادمحور. آشنا با الگوی ارتباطی Pub/Sub و مسلط به JavaScript، Python و TypeScript.

دارای تجربه‌ی استقرار پروژه‌ها روی سرور، کار با Docker و Docker Compose، استفاده از محیط‌های لینوکسی (Ubuntu، Debian) و طراحی معماری نرم‌افزار.

مسلط به مدل‌های یادگیری عمیق، بینایی ماشین و مبانی ریاضی هوش مصنوعی.

تجربه عملی کار با پایگاه‌داده‌های SQL و NoSQL مانند MongoDB، Elasticsearch، ClickHouse، PostgreSQL و BigQuery در پروژه‌های OLTP و OLAP. علاقه‌مند به نقش‌های R&D با تمرکز بر مدل‌سازی هوشمند و سیستم‌های مقیاس‌پذیر، با توانایی بالا در حل مسائل پیچیده.
`,
    },

    roles: [
      {
        key: "Backend",
        name: "بک‌اند",
        icon: "server",
        blurb: "API، احراز هویت، میکروسرویس‌ها، پیام‌رسانی.",
      },
      {
        key: "Frontend",
        name: "فرانت‌اند",
        icon: "layout",
        blurb: "رابط کاربری مدرن، ریسپانسیو، UX تمیز.",
      },
      {
        key: "Fullstack",
        name: "فول‌استک",
        icon: "layers",
        blurb: "سیستم انتها‌به‌انتها، اتصال فرانت به بک.",
      },
      {
        key: "DataEng",
        name: "مهندسی داده و تحلیل",
        icon: "database",
        blurb: "ETL، انبار داده، تحلیل، مانیتورینگ.",
      },
      {
        key: "ML",
        name: "یادگیری ماشین",
        icon: "brain",
        blurb: "مدل‌های بینایی، پایپ‌لاین آموزش، ارزیابی.",
      },
      {
        key: "Desktop",
        name: "اپلیکیشن‌های دسکتاپ",
        icon: "monitor",
        blurb: "ابزارهای Qt/PyQt و UI دسکتاپ.",
      },
    ],

    // roles keys are same as EN; filtering keeps working.
    skills: [
      {
        category: "بک‌اند",
        roles: ["Backend", "Fullstack"],
        items: [
          "Python",
          "FastAPI",
          "Express",
          "Node.js",
          "RESTful Architecture",
          "Authentication",
          "Authorization",
          "pytest",
          "Microservices",
          "Redis Streams",
          "Pub/Sub",
          "Elasticsearch",
          "Telegram Bot",
        ],
      },
      {
        category: "مهندسی داده و تحلیل",
        roles: ["DataEng"],
        items: [
          "ETL Pipelines",
          "Apache Airflow",
          "ClickHouse",
          "PostgreSQL",
          "Pandas",
          "Looker Studio",
          "Grafana",
          "Data Warehousing",
          "Data Transformation",
          "Data Automation",
        ],
      },
      {
        category: "فرانت‌اند",
        roles: ["Frontend", "Fullstack"],
        items: ["Nuxt.js", "React", "Vue", "Tailwind CSS"],
      },
      {
        category: "ابر و زیرساخت",
        roles: ["Backend", "DataEng", "Frontend", "Fullstack"],
        items: [
          "Cloudflare",
          "Docker",
          "Docker Compose",
          "Linux (Debian)",
          "Nginx",
        ],
      },
      {
        category: "اپلیکیشن‌های دسکتاپ",
        roles: ["Desktop"],
        items: ["Qt Creator", "PyQt", "Python Desktop UI"],
      },
      {
        category: "یادگیری ماشین",
        roles: ["ML"],
        items: [
          "TensorFlow",
          "PyTorch",
          "CNN",
          "RNN",
          "LSTM",
          "Image Processing",
          "Data Augmentation",
        ],
      },
      {
        category: "ریاضی و مبانی",
        roles: ["ML"],
        items: ["Linear Algebra", "Calculus", "Statistics"],
      },
    ],

    experience: [
      {
        company: "Al-Zahra Studio",
        role: "مهندس داده | تحلیل‌گر داده | توسعه‌دهنده فول‌استک",
        dates: "دسامبر ۲۰۲۴ – اکنون",
        url: "https://alzahravfx.com/",
        bullets: [
          "مشارکت فعال در تحلیل داده‌های سازمانی، شناسایی چالش‌های کلیدی و ارائه راهکارهای داده‌محور برای بهینه‌سازی فرآیندها و تصمیم‌گیری‌های مدیریتی.",
          "طراحی و پیاده‌سازی کامل سیستم Data Warehouse از مرحله معماری تا استقرار، شامل نگارش کوئری‌های پیچیده و اتوماسیون عملیات مرتبط با پروژه‌های مالی.",
          "توسعه سرویس‌های Backend با معماری Microservices و FastAPI (ماژول‌های مدیریت کاربران، ثبت لاگ‌ها، تولید گزارش) و پیاده‌سازی RESTful API برای یکپارچه‌سازی سامانه‌ها.",
          "کار عملی با MongoDB، PostgreSQL و BigQuery و پیاده‌سازی ETL و پردازش داده در محیط Production با رعایت اصول امنیت داده.",
          "استفاده از Pandas برای تحلیل داده، Pytest برای تست‌نویسی، و به‌کارگیری Fernet encryption و Hashing برای حفاظت از داده‌های حساس.",
          "تجربه کار در محیط‌های Server-based Linux و مشارکت در توسعه سیستم‌های مقاوم و مقیاس‌پذیر روی زیرساخت‌های واقعی.",
          "تسلط بر Git برای کنترل نسخه، همکاری تیمی، و توسعه ماژولار در پروژه‌های واقعی و مقیاس‌پذیر.",
        ],
      },
      {
        company: "Black Wall",
        role: "فول استک دولوپر",
        dates: "آوریل ۲۰۲۶ – اکنون",
        url: "https://black-wall.org/",
        bullets: [
          "توسعه و نگهداری هم‌زمان بخش‌های فرانت‌اند و بک‌اند با تمرکز بر پایداری، عملکرد و مقیاس‌پذیری.",
          "پیاده‌سازی و مدیریت سیستم‌های Authentication و Authorization برای کنترل دسترسی و افزایش امنیت.",
          "طراحی و توسعه رابط کاربری (UI) و منطق سمت سرور (Backend) برای ارائه تجربه‌ای روان و یکپارچه.",
          "انجام عملیات‌های Migration و بهینه‌سازی ساختار دیتابیس در فرآیند توسعه و استقرار.",
          "مدیریت پایگاه داده، پیکربندی زیرساخت و استقرار پروژه‌ها روی Cloudflare و همچنین سرورهای داخلی.",
          "راه‌اندازی و مدیریت دیتابیس‌های داخلی و لوکال برای استفاده در سامانه‌ها و سرویس‌های درون‌سازمانی.",
          "دیپلوی و نگهداری وب‌سایت‌ها و سامانه‌های داخلی با تمرکز بر دسترس‌پذیری، امنیت و سهولت توسعه.",
        ],
      },
      {
        company: "Asr-e Maharat",
        role: "مدرس پایتون پیشرفته و جنگو | آموزش خصوصی",
        dates: "۱ سال",
        url: "https://asremaharat.com/",
        bullets: [
          "تدریس خصوصی پایتون پیشرفته و جنگو با تمرکز روی کدنویسی عملی، حل مسئله و الگوهای مورد استفاده در پروژه‌های واقعی.",
          "کمک به هنرجوها برای عبور از syntax و رسیدن به ساختار کد تمیزتر، دیباگ بهتر، تفکر ماژولار و کار با کتابخانه‌های رایج پایتون.",
          "آموزش مفاهیم اصلی Django مثل مدل‌ها، viewها، routeها، templateها و مسیر عملی توسعه وب.",
          "تنظیم مسیر آموزش بر اساس سطح هر هنرجو تا مفاهیم فنی قابل فهم، کاربردی و قابل استفاده در پروژه باشند.",
        ],
      },
      {
        company: "VAYO Tech Studio",
        role: "توسعه‌دهنده نرم‌افزار | مهندس داده",
        dates: "مه ۲۰۲۳ – دسامبر ۲۰۲۴",
        bullets: [
          "توسعه قابلیت‌های بک‌اند و مهندسی داده در چند محصول با تمرکز بر پایداری و عملکرد.",
          "پیاده‌سازی یکپارچه‌سازی داده، استراتژی‌های ذخیره‌سازی و اتوماسیون برای کاهش فعالیت‌های دستی.",
          "مشارکت در معماری‌های مقیاس‌پذیر و آماده‌سازی پروداکشن (تست، مشاهده‌پذیری، استقرار).",

          "طراحی و توسعه رابط کاربری برنامه با Qt، همراه با تسلط بر HTML/CSS برای تجربه کاربری روان.",
          "پیاده‌سازی سیستم ذخیره‌سازی داده با ترکیب JSON (NoSQL) و XML برای بهینه‌سازی ذخیره/بازیابی اطلاعات.",
          "استفاده از SQLite برای ذخیره و مدیریت داده‌های ساخت‌یافته و جدولی مشابه Excel.",
          "توسعه ابزارهای متنوع برای مدیریت فایل‌ها، اسناد و داده‌ها با تمرکز بر دقت، سرعت و کارایی.",
        ],
      },
    ],

    education: [
      {
        school: "دانشگاه اراک",
        degree: "کارشناسی مهندسی مواد",
        dates: "۲۰۱۷ – ۲۰۲۱",
        details: [],
      },
    ],

    projects: [
      // FA (فارسی)
      {
        id: "heychat",
        title: "HeyChat",
        shortDescription:
          "سیستم ارتباط‌گیری و پیام‌رسانی مبتنی بر مایکروسرویس با معماری رویدادمحور، جست‌وجو و احراز هویت/مجوزدهی از طریق گیت‌وی.",
        roles: ["Backend", "DataEng", "Frontend"],
        tags: [
          "Python",
          "FastAPI",
          "PostgreSQL",
          "Redis Streams",
          "Pub/Sub",
          "Elasticsearch",
          "Caching",
          "Docker Compose",
          "Nginx",
          "React",
          "Telegram Bot",
          "Telegram Auth Widget",
          "Authentication",
          "Authorization",
          "API Gateway",
          "TailwindCSS",
          "Atomic Design",
          "Feature-based Architecture",
        ],
        highlights: [
          "معماری مایکروسرویس و ماژولار (Modular) در برخی سرویس‌ها",
          "رویدادمحور (Event-Driven) با Redis Streams و استفاده از Pub/Sub در بخش‌های منتخب",
          "عبور همه درخواست‌ها از API Gateway با Authentication/Authorization",
          "سیستم جست‌وجوی مبتنی بر Elasticsearch + ذخیره‌سازی داده در PostgreSQL + Caching",
        ],
        details: [
          "پیاده‌سازی قابلیت‌های اصلی: افزودن کانتکت، بلاک/آن‌بلاک، جست‌وجوی کاربران، مشاهده پروفایل، ارسال درخواست چت و اتصال کاربران.",
          "طراحی ارتباط بین سرویس‌ها به‌صورت ترکیبی: رویدادمحور در بخش‌های کلیدی و ارتباط REST API در برخی مسیرها برای هماهنگی سرویس‌ها.",
          "پیاده‌سازی Frontend با React (base-feature) با رعایت Hooks، استفاده از Tailwind و ساختار کامپوننت‌ها به سبک Atomic برای توسعه‌پذیری آینده.",
          "اجرای احراز هویت از طریق Telegram Authenticate Widget و صدور توکن کاربر برای دسترسی امن.",
          "طراحی دقیق Routes با اصول RESTful Resource Naming و اعمال سیاست‌های دسترسی در Gateway.",
          "راه‌اندازی زیرساخت با Docker Compose و مپ‌کردن سرویس‌ها به یک ورودی واحد؛ استفاده از Nginx Reverse Proxy برای Load Balancing و Route Management.",
        ],
        links: {
          github: "https://github.com/prograin/heychat",
          liveDemo: null,
        },
        media: {
          videoUrl: null,
          images: [],
        },
        isPrivate: false,
      },
      {
        id: "oildb",
        title: "Black Wall / Oil-DB",
        shortDescription:
          "پروژه عملیاتی Black Wall برای سایت فروشگاهی/تجاری و مسیر تماس عمومی، همراه با پنل خصوصی Oil-DB با Nuxt، Cloudflare و D1.",
        roles: ["DataEng", "Backend", "Frontend", "Fullstack"],
        tags: [
          "سایت فروشگاهی",
          "سایت تجاری",
          "Nuxt.js",
          "Vue",
          "Cloudflare",
          "Cloudflare D1",
          "SQLite",
          "Database Migrations",
          "Authentication",
          "Tailwind CSS",
          "Composables",
          "Full-Stack",
          "Production Deployment",
        ],
        highlights: [
          "ساخت و نگهداری سایت عملیاتی Black Wall و پنل خصوصی مرتبط با Oil-DB",
          "چیدمان مسیر تماس عمومی برای ارتباط سریع‌تر بازدیدکننده با کسب‌وکار",
          "زیرساخت Cloudflare و دیتابیس Cloudflare D1 (SQLite)",
          "اجرای چندین migration برای تکامل امنِ اسکیمای دیتابیس",
          "UI با Nuxt + Vue و Tailwind برای تجربه کاربری تمیز و ریسپانسیو",
          "معماری ماژولار با کامپوننت‌ها و composableهای قابل‌استفاده مجدد",
        ],
        details: [
          "Black Wall و Oil-DB مربوط به یک محدوده پروژه هستند و به جای دو کارت جدا، به صورت یک نمونه‌کار واحد نمایش داده می‌شوند.",
          "بخش عمومی Black Wall روی مسیر ساده معرفی کسب‌وکار و تماس تمرکز دارد و بخش خصوصی Oil-DB پنل داده و مدیریت داخلی پروژه را پوشش می‌دهد.",
          "برای استقرار و زیرساخت پنل خصوصی از Cloudflare استفاده شد و لایه دیتابیس Cloudflare D1 (بر پایه SQLite) بود.",
          "بخش مهم پروژه طراحی اسکیمای دیتابیس و اجرای migrationهای متعدد برای تکامل امن جداول، روابط و محدودیت‌ها با تغییر نیازمندی‌ها بود.",
          "رابط کاربری با Nuxt و Vue ساخته شد و با Tailwind CSS استایل‌دهی شد؛ با تمرکز روی خوانایی، ریسپانسیو بودن و نگهداری‌پذیری.",
          "پروژه ساختار ماژولار دارد: composableها منطق کسب‌وکار قابل استفاده مجدد را پوشش می‌دهند و کامپوننت‌ها UI را تمیز و مقیاس‌پذیر نگه می‌دارند.",
          "چالش اصلی: مدل‌سازی رابطه‌ای و تضمین یکپارچگی بین موجودیت‌ها؛ حل‌شده با طراحی دقیق اسکیمـا، مهاجرت‌های مرحله‌ای و یکپارچه‌سازی کامل فول‌استک در Nuxt.",
        ],
        links: {
          url: "https://black-wall.org/",
          github: null,
          liveDemo: null,
        },
        media: { videoUrl: "", images: [] },
        isPrivate: false,
      },

      {
        id: "rokesh-mehdi",
        title: "Rokesh Mehdi",
        shortDescription:
          "سایت عملیاتی rokesh-mehdi.ir با PHP، پیاده‌سازی اختصاصی، اتصال زرین‌پال، دریافت اینماد، پیامک‌های ملی‌پیامک و بخش مقالات سایت.",
        roles: ["Backend", "Frontend", "Fullstack"],
        tags: [
          "PHP",
          "MySQL",
          "HTML",
          "CSS",
          "JavaScript",
          "ZarinPal",
          "Enamad",
          "Melipayamak",
          "درگاه پرداخت",
          "پیامک",
          "SEO",
          "مقالات سایت",
        ],
        highlights: [
          "طراحی و پیاده‌سازی سایت و منطق بک‌اند با PHP از پایه",
          "اتصال زرین‌پال و پیاده‌سازی جریان پرداخت آنلاین",
          "آماده‌سازی و اتصال الزامات اینماد برای اعتماد و فروش آنلاین",
          "اتصال ملی‌پیامک برای پیامک‌های اطلاع‌رسانی و عملیاتی",
          "اضافه شدن بخش مقالات سایت برای محتوا و بهبود SEO",
        ],
        details: [
          "این پروژه به‌صورت یک سایت کامل و قابل استفاده پیاده‌سازی شد؛ هم صفحات عمومی سایت و هم منطق سمت سرور را پوشش می‌دهد.",
          "فرآیند پرداخت با زرین‌پال پیاده‌سازی شد و سایت برای الزامات اعتمادسازی و فروش آنلاین، از جمله اینماد، آماده و متصل شد.",
          "ملی‌پیامک به سایت وصل شد تا پیام‌های مهم برای کاربر و روندهای کاری سایت ارسال شوند.",
          "بخش مقالات سایت اضافه شد تا بازدیدکننده‌های غیرتخصصی هم بتوانند محتوای سایت را راحت دنبال کنند و سایت از نظر محتوایی و SEO کامل‌تر باشد.",
          "تمرکز اصلی روی سادگی مسیر کاربر، پایداری در اجرا، و قابل نگهداری بودن پروژه در محیط واقعی بود.",
        ],
        links: {
          url: "https://rokesh-mehdi.ir",
          github: null,
          liveDemo: null,
        },
        media: { videoUrl: null, images: [] },
        isPrivate: false,
      },

      {
        id: "analytical-dashboard",
        title: "داشبورد تحلیلی",
        shortDescription:
          "پروژه محرمانه ETL + انبار داده + داشبوردها برای گزارش‌دهی KPI محور و مانیتورینگ.",
        roles: ["DataEng"],
        tags: [
          "ETL Pipelines",
          "Apache Airflow",
          "PostgreSQL",
          "ClickHouse",
          "Looker Studio",
          "Grafana",
          "Linux (Debian)",
        ],
        highlights: [
          "استراتژی‌های ingestion افزایشی",
          "انبار داده (PostgreSQL + ClickHouse)",
          "زمان‌بندی با Airflow",
          "داشبوردهای KPI",
        ],
        details: [
          "طراحی و استقرار داشبورد تحلیلی نزدیک به real-time در Al-Zahra Studio برای مانیتور عملکرد تیم، مدیریت وظایف، و تحلیل پیشرفت پروژه‌ها در تیم‌های مالی، مدیریت ارشد، هماهنگی و مدیریت پروژه.",
          "ساخت پایپ‌لاین ETL برای دریافت داده از API داخلی، پاکسازی و تبدیل داده؛ با بارگذاری کامل و افزایشی (هر ۲ ساعت).",
          "بارگذاری داده در انبار داده و ساخت جداول SQL بهینه برای تحلیل سریع و قابل اطمینان.",
          "توسعه داشبورد شامل ۱۳ چارت در ۵ صفحه و ۵ KPI متناسب؛ با قابلیت فیلتر براساس پروژه و بازه زمانی برای مدیران و تحلیل‌گران.",
          "اتوماسیون اجرای اسکریپت‌ها با Windows Task Scheduler و مدیریت نسخه کدها و کوئری‌ها با Git.",
          "بهبود دقت و کارایی گزارش‌دهی برای تیم مالی و افزایش بینش بین‌واحدی برای مدیریت ارشد، فراهم‌سازی مانیتورینگ برای تیم هماهنگی و تصمیم‌گیری سریع‌تر برای مدیریت پروژه.",
          "حل چالش‌های ساختاردهی داده، بصری‌سازی و طراحی انبار داده با رویکرد هیبرید full/incremental برای مقیاس‌پذیری و پایداری.",
          "ایجاد بستر برای بهبودهای آینده مثل آپدیت رویدادمحور و گزارش‌دهی منعطف مطابق سیاست‌های داده سازمان.",
        ],
        links: { github: null, liveDemo: null },
        media: { videoUrl: null, images: [] },
        isPrivate: true,
      },

      {
        id: "freelancer-etl-dashboard",
        title: "ETL مدیریت فریلنسرها",
        shortDescription:
          "اتوماسیون ETL برای پایش ساعات کاری فریلنسرها، پیشرفت تسک‌ها و KPIها با Python و Google Sheets.",
        roles: ["DataEng"],
        tags: [
          "Python",
          "ETL",
          "Airflow",
          "Google Sheets",
          "API Integration",
          "Data Automation",
          "Task Management",
        ],
        highlights: [
          "طراحی پایپ‌لاین ETL برای پایش فعالیت فریلنسرها",
          "تجمیع متریک‌ها: ساعات کاری، مدت زمان تسک، زمان تکمیل و وضعیت‌ها",
          "گزارش‌گیری تعاملی روی Google Sheets برای تیم مالی",
          "اتوماسیون و زمان‌بندی با Airflow DAGs",
          "افزایش شفافیت و تصمیم‌گیری بهتر در مدیریت فریلنسرها",
        ],
        details: [
          "توسعه یک سیستم ETL مقیاس‌پذیر برای رصد و تحلیل عملکرد فریلنسرها در چند پروژه.",
          "استخراج داده از APIها، پردازش/تبدیل با Python و محاسبه متریک‌هایی مثل ساعات کار، زمان تکمیل، مدت زمان تسک و وضعیت جاری.",
          "یکپارچه‌سازی با Google Sheets برای ارائه داشبورد زنده و تعاملی برای تیم مالی.",
          "زمان‌بندی و ارکستریشن jobها با Airflow DAGها برای به‌روزرسانی خودکار، قابل اعتماد و به‌موقع.",
          "بهینه‌سازی پردازش برای دقت، کارایی و مقیاس‌پذیری جهت رشد آینده.",
          "افزایش شفافیت عملیاتی و ارائه insightهای قابل اقدام برای مدیریت بارکاری و بهره‌وری فریلنسرها.",
        ],
        links: { github: null, liveDemo: null },
        media: { videoUrl: null, images: [] },
        isPrivate: true,
      },

      {
        id: "notification-system",
        title: "سیستم نوتیفیکیشن",
        shortDescription:
          "سرویس محرمانه FastAPI برای اعلان‌های زمان‌بندی‌شده با تلگرام و احراز هویت امن.",
        roles: ["Backend"],
        tags: [
          "Python",
          "FastAPI",
          "PostgreSQL",
          "Authentication",
          "Authorization",
          "Telegram Bot",
          "pytest",
        ],
        highlights: [
          "احراز هویت امن",
          "یکپارچه‌سازی تلگرام",
          "زمان‌بندی اعلان‌ها",
          "معماری قابل تست",
          "اعلان بلادرنگ تغییر وضعیت تسک",
          "گزارش روزانه خودکار",
        ],
        details: [
          "توسعه سیستم اعلان محرمانه به‌صورت سرویس بک‌اند FastAPI و اتصال به تلگرام برای ارسال اعلان‌های به‌موقع.",
          "اتصال به پلتفرم مدیریت پروژه اصلی جهت پایش وضعیت تسک‌ها به‌صورت real-time.",
          "ارسال اعلان خودکار هنگام تغییر وضعیت تسک برای اطلاع‌رسانی سریع به کاربران.",
          "طراحی یادآوری برای تسک‌هایی که بیش از زمان مورد انتظار طول کشیده‌اند.",
          "ارسال گزارش روزانه شامل تسک‌های تکمیل‌شده، در حال انجام و دیرکرد.",
          "تمرکز بر احراز هویت/مجوزدهی امن و معماری مقیاس‌پذیر برای چند کاربر.",
          "طراحی قابل تست برای نگهداری‌پذیری و توسعه آسان در آینده.",
        ],
        links: { github: null, liveDemo: null },
        media: { videoUrl: null, images: [] },
        isPrivate: true,
      },

      {
        id: "report-bot",
        title: "ربات گزارش‌دهی",
        shortDescription:
          "ربات تحلیلی تلگرام + بک‌اند FastAPI با جریان‌های گزارش‌گیری خودکار (محرمانه).",
        roles: ["Backend", "DataEng"],
        tags: [
          "Python",
          "FastAPI",
          "Telegram Bot",
          "Matplotlib",
          "Data Analytics",
          "Predictions",
        ],
        highlights: [
          "تولید خودکار گزارش‌ها",
          "ارسال تعاملی در تلگرام",
          "بصری‌سازی با Matplotlib",
          "متریک‌ها و فیلترهای قابل تنظیم",
          "چارت‌های پیش‌بینی درخواستی",
          "پشتیبانی از گزارش‌های مدیریتی",
        ],
        details: [
          "توسعه ربات تلگرام برای ارسال گزارش‌های خودکار و تحلیل‌های بصری براساس انتخاب متریک‌ها توسط کاربر.",
          "اتصال به منابع داده و تولید نمودارها با Matplotlib برای نمایش روندها، عملکرد و KPIها.",
          "پشتیبانی از نمودارهای پیش‌بینی برای نمایش خروجی‌های آینده در صورت نیاز کاربر.",
          "ارائه گزارش‌های سطح مدیریتی برای نظارت و جمع‌بندی وضعیت تیم.",
          "طراحی برای یکپارچه‌سازی آسان با پلتفرم‌های مدیریت پروژه و سیستم اعلان‌ها.",
          "تمرکز بر انعطاف‌پذیری و گزارش‌های کاربرمحور.",
          "تضمین پایداری، مقیاس‌پذیری و امنیت در تعاملات تلگرام و بک‌اند.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1nUgbwAzzEU3B5acAwckE_pqG8-rjVuNP/view?usp=drive_link",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "vdoc",
        title: "vDoc",
        shortDescription:
          "سیستم دسکتاپ مدیریت اسناد (محرمانه) با ذخیره‌سازی XML/HTML و نمایش درختی سلسله‌مراتبی.",
        roles: ["DataEng", "Desktop"],
        tags: ["PyQt", "Qt Creator", "XML", "HTML", "Desktop UI"],
        highlights: [
          "ویرایشگر متن غنی + ذخیره خودکار",
          "ذخیره اسناد با XML/HTML",
          "مدیریت پوشه/درخت سلسله‌مراتبی",
          "ایندکس تیترها و ناوبری سریع در سند",
          "UI دسکتاپ با PyQt/Qt Creator",
        ],
        details: [
          "vDoc یک اپلیکیشن دسکتاپ خصوصی/NDA برای مدیریت و سازمان‌دهی اسناد با ساختار مقیاس‌پذیر است.",
          "دارای لایه کامل مدیریت متن: ایجاد، ویرایش و نگهداری اسناد با workflow ذخیره خودکار برای جلوگیری از از دست رفتن داده.",
          "ذخیره‌سازی با XML/HTML برای حفظ ساختار، جستجوپذیری و توسعه‌پذیری آینده.",
          "مدیریت پوشه‌ای درختی برای دسته‌بندی مجموعه‌های بزرگ و ناوبری ساده مثل یک Knowledge Base سبک.",
          "پشتیبانی از ایندکس تیترها و ناوبری روان در اسناد طولانی.",
          "UI با تمرکز بر سرعت و وضوح و تجربه editor-first برای استفاده روزانه.",
          "پروژه خصوصی / NDA. جزئیات فنی بیشتر در صورت درخواست قابل ارائه است.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1ogetJtmWDpi-1iOFq9u6PaLGCmRzEHjb/view?usp=sharing",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "bmc",
        title: "BMC",
        shortDescription:
          "سیستم دسکتاپ شبیه اکسل (محرمانه) با ذخیره‌سازی ساختاریافته، ورک‌بوک‌های مبتنی بر دیتابیس و موتور فرمول برای جدول‌های داینامیک.",
        roles: ["DataEng"],
        tags: [
          "XML",
          "Persistence",
          "Formula Parsing",
          "Data Modeling",
          "Desktop UI",
          "File I/O",
        ],
        highlights: [
          "مدیریت ورک‌بوک شبیه اکسل با ذخیره/بارگذاری",
          "ذخیره‌سازی فایل‌ها با فرمت .db",
          "موتور فرمول (پارس، ارزیابی، نمایش)",
          "جدول‌های قابل ویرایش با مدیریت Sheet/Tab",
          "ویرایش متن/سلول‌ها با مدل‌سازی داده ساختاریافته",
        ],
        details: [
          "BMC یک اپلیکیشن دسکتاپ خصوصی/NDA شبیه اکسل برای مدیریت داده‌های جدولی با ذخیره‌سازی قابل اطمینان و تجربه ویرایش روان است.",
          "پشتیبانی از ذخیره و بارگذاری ورک‌بوک‌ها در قالب دیتابیس (.db) برای ذخیره‌سازی پایدار و بارگذاری سریع.",
          "امکان ساخت/مدیریت چندین شیت (Tab)، افزودن/حذف شیت‌ها و کار با جدول‌های قابل ویرایش مشابه اسپردشیت.",
          "موتور فرمول داخلی برای نوشتن فرمول، پارس و ارزیابی و نمایش خروجی، همراه با نگهداری فرمول اصلی برای ویرایش.",
          "ویرایش کامل جدول: تغییر متن سلول‌ها، بروزرسانی مقادیر و حفظ یکپارچگی داده بین شیت‌ها و فایل‌ها.",
          "پروژه خصوصی / NDA. جزئیات بیشتر در صورت درخواست قابل ارائه است.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1lakH1BSma0JWRzMAMTDgBFkS1u2JA3Kf/view?usp=drive_link",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "mgv",
        title: "نمایش گرافیکی ماتریس (MGV)",
        shortDescription:
          "اپ دسکتاپ PyQt6 برای نمایش تعاملی ماتریس، جدول‌های مبتنی بر فرمول، و انیمیشن‌های Python با ویرایشگر کد داخلی.",
        roles: ["Desktop"],
        tags: [
          "PyQt6",
          "Qt Creator",
          "Python",
          "Desktop UI",
          "Linear Algebra",
          "2D Graphics",
          "Formula Parsing",
        ],
        highlights: [
          "Graphics View دوبعدی (نمایش فضای سطری/ستونی)",
          "مدیریت رنگ قابل تنظیم برای آیتم‌های ماتریس",
          "ویرایش ماتریس در جدول با پشتیبانی از فرمول",
          "تبدیل مقادیر ماتریس به آیتم‌های گرافیکی دوبعدی",
          "ویرایشگر Python داخلی با auto-complete و syntax highlight بهتر",
          "انیمیشن‌سازی نمایش ماتریس با اسکریپت‌های Python",
        ],
        details: [
          "MGV یک اپلیکیشن دسکتاپ مبتنی بر PyQt6 برای تبدیل تجربه کار با ماتریس‌ها به حالت بصری، تعاملی و قابل برنامه‌نویسی است.",
          "دارای نمای دوبعدی اختصاصی برای نمایش ماتریس در فضای سطری یا ستونی با کنترل رنگ برای خوانایی بهتر.",
          "Table View مسیر کامل مدیریت مقدارهای ماتریس را پوشش می‌دهد: ویرایش، تبدیل به آیتم‌های دوبعدی و نوشتن فرمول در سلول‌ها.",
          "شامل ویرایشگر Python داخلی با auto-completion قوی‌تر و syntax highlighter برای کنترل workflowهای داخل برنامه.",
          "قابلیت کلیدی: انیمیشن‌سازی — تولید انیمیشن‌های نمایش ماتریس (دوبعدی و رنگی) با Python؛ مناسب دمو، آموزش و شبیه‌سازی.",
        ],
        links: {
          github: "https://github.com/prograin/Matrix_repre_py",
          liveDemo: null,
        },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1Zkx_dxIfF9TCKFLTbI0GZcuxtdLTlwxh/view?usp=drive_link",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "steel-defect-detection",
        title: "تشخیص عیوب فولاد",
        shortDescription:
          "سیستم بینایی ماشین صنعتی برای تشخیص و مکان‌یابی عیوب با TensorFlow + EfficientNetB0 و loss سفارشی (bbox/confidence/classification).",
        roles: ["ML"],
        tags: [
          "TensorFlow",
          "EfficientNetB0",
          "Computer Vision",
          "Object Detection",
          "Image Processing",
          "Albumentations",
          "Data Augmentation",
          "Custom Loss",
          "CNN",
        ],
        highlights: [
          "تشخیص و مکان‌یابی عیوب در تصاویر صنعتی",
          "بک‌بون EfficientNetB0 با هدهای سفارشی",
          "خروجی شبکه به صورت گرید ۷×۷ برای پیش‌بینی مکان‌محور",
          "Loss سفارشی برای bbox + confidence + classification",
          "پیش‌پردازش مبتنی بر mask و augmentationهای قوی",
          "آموزش ۱۰۰ epoch و ارزیابی روی تصاویر متنوع",
        ],
        details: [
          "تمرکز پروژه روی تشخیص خودکار عیوب در تولید فولاد و بهبود کنترل کیفیت با مکان‌یابی دقیق عیب‌ها در تصویر است.",
          "از دیتاست عمومی شامل mask عیوب استفاده شد و پایپ‌لاین پیش‌پردازش برای تولید targetهای آموزش ساخته شد؛ با augmentationهای Albumentations برای افزایش robustness.",
          "مدل با TensorFlow ساخته شد و EfficientNetB0 به عنوان استخراج‌کننده ویژگی استفاده شد و هد سفارشی برای خروجی‌های تشخیص اضافه شد. خروجی‌ها به شکل گرید ۷×۷ تولید می‌شوند.",
          "برای بهبود همگرایی و یادگیری ویژگی‌ها، loss سفارشی شامل رگرسیون bbox، برآورد confidence و طبقه‌بندی عیب پیاده‌سازی شد.",
          "مدل ۱۰۰ epoch آموزش داده شد و نتایج، تشخیص و مکان‌یابی قابل اتکا را نشان می‌دهد (نمونه خروجی‌ها در مدیا/ریپازیتوری).",
        ],
        links: {
          github: "https://github.com/prograin/Steel-defect-detection",
          liveDemo: null,
        },
        media: {
          videoUrl: null,
          images: [
            "./assets/images/steel_defect_1.png",
            "./assets/images/steel_defect_2.png",
          ],
        },
        isPrivate: false,
      },

      {
        id: "flooded-area-segmentation",
        title: "تشخیص و سگمنتیشن نواحی سیل‌زده",
        shortDescription:
          "مدل یادگیری عمیق مبتنی بر U-Net برای تشخیص نواحی سیل‌زده از تصاویر هوایی با EfficientNet-B4 و تکنیک‌های سفارشی.",
        roles: ["ML"],
        tags: [
          "U-Net",
          "EfficientNet-B4",
          "Image Segmentation",
          "Deep Learning",
          "Dice Loss",
          "Data Augmentation",
        ],
        highlights: [
          "طراحی U-Net با بک‌بون EfficientNet-B4 برای سگمنتیشن سیل",
          "پیاده‌سازی decoder سفارشی و Dice Loss",
          "استفاده از augmentation و callbackهای آموزشی",
          "ارزیابی با خروجی‌های بصری سگمنتیشن",
        ],
        details: [
          "توسعه پایپ‌لاین یادگیری عمیق برای شناسایی مناطق سیل‌زده از تصاویر هوایی.",
          "استفاده از U-Net با EfficientNet-B4 به‌عنوان encoder و decoder سفارشی برای افزایش دقت.",
          "پیاده‌سازی Dice Loss و تکنیک‌های افزایش داده برای بهبود robustness.",
          "استفاده از callbackها برای ذخیره checkpoint، لاگ‌گیری و تنظیم پویا نرخ یادگیری.",
          "تست روی دیتاست جداگانه و تحلیل عملکرد با خروجی‌های بصری.",
          "کد و جزئیات بیشتر در GitHub قابل دسترسی است.",
        ],
        links: {
          github: "https://lnkd.in/du2Xe3jV",
          liveDemo: null,
        },
        media: {
          videoUrl: null,
          images: [
            "./assets/images/flood_area_1.png",
            "./assets/images/flood_area_2.png",
          ],
        },
        isPrivate: false,
      },

      {
        id: "cnn-rectangle-predict",
        title: "پیش‌بینی مستطیل با CNN",
        shortDescription:
          "یک آزمایش عملی CNN برای پیش‌بینی ویژگی‌های هندسی مستطیل از تصاویر مصنوعی.",
        roles: ["ML"],
        tags: [
          "Convolutional Neural Networks",
          "Image Processing",
          "Deep Learning",
          "Python",
          "Synthetic Dataset",
        ],
        highlights: [
          "تولید دیتاست سفارشی با مستطیل‌های تصادفی",
          "استخراج ویژگی با CNN همراه BatchNorm و Dropout",
          "رگرسیون مرکز، عرض و ارتفاع مستطیل",
          "نمایش مقایسه پیش‌بینی و واقعیت",
        ],
        details: [
          "ساخت دیتاست مصنوعی شامل تصاویر ۱۰۰×۱۰۰ با مستطیل‌های تصادفی.",
          "طراحی و آموزش CNN به‌همراه یک شبکه fully-connected برای رگرسیون پارامترهای هندسی.",
          "ارزیابی با منحنی loss و تحلیل همبستگی پیش‌بینی‌ها با مقادیر واقعی.",
          "نمایش نمونه‌ها با رسم مرکز پیش‌بینی‌شده و مرکز واقعی.",
          "هدف پروژه: درک عملی CNN در مسئله‌های رگرسیون مبتنی بر تصویر.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl: null,
          images: [
            "./assets/images/rect_predict_3.png",
            "./assets/images/rect_predict_2.png",
            "./assets/images/rect_predict_1.png",
          ],
        },
        isPrivate: false,
      },

      {
        id: "mnist-digit-recognition",
        title: "تشخیص ارقام دست‌نویس",
        shortDescription:
          "سیستم تشخیص ارقام دست‌نویس مبتنی بر CNN با PyTorch و MNIST همراه با رابط طراحی تعاملی.",
        roles: ["ML"],
        tags: [
          "PyTorch",
          "CNN",
          "MNIST",
          "Image Processing",
          "OpenCV",
          "PyQt",
          "PIL",
        ],
        highlights: [
          "معماری CNN + FFN برای طبقه‌بندی ارقام",
          "ویجت PyQt برای رسم زنده رقم",
          "پیش‌پردازش تصویر با OpenCV و PIL",
          "استنتاج کامل از ورودی کاربر تا پیش‌بینی",
        ],
        details: [
          "ساخت مدل یادگیری عمیق با لایه‌های CNN برای استخراج ویژگی و شبکه feedforward برای طبقه‌بندی.",
          "آموزش و ارزیابی با دیتاست MNIST.",
          "پیاده‌سازی ویجت PyQt برای رسم رقم توسط کاربر روی صفحه.",
          "استفاده از OpenCV برای contour و PIL برای resize و بهبود کیفیت قبل از inference.",
          "تمرکز پروژه روی تجربه عملی workflow یادگیری عمیق و تعامل real-time با کاربر.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1LdBkhb8vczB2nLgRt6KQdUpeZrnfd-Xt/view?usp=sharing",
          images: [],
        },
        isPrivate: false,
      },

      {
        id: "realtime-sentiment-analysis",
        title: "تحلیل احساسات بلادرنگ",
        shortDescription:
          "مطالعه مقایسه‌ای مدل‌های LSTM همراه Self-Attention برای پیش‌بینی احساسات به‌صورت real-time.",
        roles: ["ML"],
        tags: [
          "Natural Language Processing",
          "LSTM",
          "Self-Attention",
          "Deep Learning",
          "Real-Time Inference",
        ],
        highlights: [
          "چند مدل LSTM تقویت‌شده با Self-Attention",
          "پیش‌بینی بلادرنگ با بازخورد بصری",
          "مقایسه مدل‌ها بر اساس درست/غلط بودن پیش‌بینی",
          "تنظیم هایپرپارامترها و تحلیل عملکرد",
        ],
        details: [
          "توسعه و ارزیابی چند مدل تحلیل احساسات مبتنی بر LSTM و Self-Attention.",
          "مقایسه عملکرد مدل‌ها با پیش‌بینی‌های real-time روی داده‌های مثبت/منفی.",
          "تحلیل دقت و شناسایی نقاط قوت و ضعف در generalization.",
          "نمایش بصری پیش‌بینی درست (سبز) و نادرست (قرمز) برای تحلیل شهودی.",
          "بررسی اثر تنظیم هایپرپارامترها و مشخص کردن مسیرهای بهبود.",
        ],
        links: { github: null, liveDemo: null },
        media: {
          videoUrl:
            "https://drive.google.com/file/d/1XS8i8TK-3Nb9ZLL_JLHv2IA9Pgy9U3FD/view?usp=drive_link",
          images: [],
        },
        isPrivate: false,
      },
    ],
  },
};
