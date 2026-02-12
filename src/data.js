// data.js
// Define ALL content here (single source of truth).
window.PORTFOLIO_DATA = {
  ui: {
    heroKicker: "Portfolio",
    rolesHint:
      "Pick one to filter projects. Skills will highlight automatically.",
    contactHint:
      "Interested in collaboration, consulting, or a full-time role? Reach out via any channel below.",
    cvUrl: "#", // put your real CV link here (optional)
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
    links: {
      github: "https://github.com/prograin",
      linkedin: "https://www.linkedin.com/in/ahmadreza-rezaei-b60866304",
    },
    about:
      "Data Engineer, Backend Engineer, Full-Stack Developer, and Machine Learning Engineer with hands-on experience in scalable backend systems, ETL pipelines, analytical dashboards, event-driven architectures, desktop tools, and industrial ML solutions.",
  },

  roles: [
    {
      name: "Backend",
      icon: "server",
      blurb: "APIs, auth, microservices, messaging.",
    },
    {
      name: "Frontend",
      icon: "layout",
      blurb: "Modern UI, responsive layouts, clean UX.",
    },
    {
      name: "Fullstack",
      icon: "layers",
      blurb: "End-to-end systems, frontend to backend integration.",
    },
    {
      name: "Data Engineering & Analytics",
      icon: "database",
      blurb: "ETL, warehouses, analytics, monitoring.",
    },
    {
      name: "Machine Learning",
      icon: "brain",
      blurb: "Vision models, training pipelines, evaluation.",
    },
    {
      name: "Desktop Applications",
      icon: "monitor",
      blurb: "Qt/PyQt tooling, desktop UI systems.",
    },
  ],

  // Skills highlight rules: each skill group can have `roles` to highlight under that role.
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
        "Microservices", // from HeyChat
        "Redis Streams", // from HeyChat
        "Pub/Sub", // from HeyChat
        "Elasticsearch", // from HeyChat
        "Telegram Bot", // from Notification System & Report Bot
      ],
    },
    {
      category: "Data Engineering & Analytics",
      roles: ["Data Engineering & Analytics", "ETL Development", "Automation"],
      items: [
        "ETL Pipelines",
        "Apache Airflow",
        "ClickHouse",
        "PostgreSQL",
        "Pandas",
        "Looker Studio",
        "Grafana",
        "Data Warehousing", // from Analytical Dashboard
        "Data Transformation",
        "Data Automation", // from Freelancer ETL
      ],
    },
    {
      category: "Frontend",
      roles: ["Frontend", "Fullstack"],
      items: ["Nuxt.js", "React", "Vue", "Tailwind CSS"],
    },
    {
      category: "Cloud & Infrastructure",
      roles: ["Backend", "Data Engineering & Analytics", "Frontend"],
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
      roles: ["Desktop Applications"],
      items: ["Qt Creator", "PyQt", "Python Desktop UI"],
    },
    {
      category: "Machine Learning",
      roles: ["Machine Learning", "Computer Vision", "NLP"],
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
      roles: ["Machine Learning", "Math & Fundamentals"],
      items: ["Linear Algebra", "Calculus", "Statistics"],
    },
  ],
  experience: [
    {
      company: "Al-Zahra Studio",
      role: "Data Engineer | Data Analyst | Full-Stack Developer",
      dates: "Dec 2024 – Present",
      bullets: [
        "Designed and maintained ETL workflows and analytics-ready datasets aligned with business KPIs.",
        "Built and extended backend services and internal tooling to support reporting, automation, and data quality.",
        "Developed dashboards and monitoring for operational visibility and stakeholder reporting.",
      ],
    },
    {
      company: "VAYO Tech Studio",
      role: "Software Developer | Data Engineer",
      dates: "May 2023 – Dec 2024",
      bullets: [
        "Delivered backend and data engineering features across multiple products, emphasizing reliability and performance.",
        "Implemented data integrations, storage strategies, and automation to reduce manual operational effort.",
        "Contributed to scalable architectures and production hardening (testing, observability, deployment).",
      ],
    },
  ],

  education: [
    {
      school: "Arak University",
      degree: "Bachelor’s Degree in Materials Engineering",
      dates: "2017 – 2021",
      details: [
        "Strengthened analytical thinking through math-heavy and engineering problem solving.",
      ],
    },
  ],
  // -------------------
  projects: [
    {
      id: "heychat",
      title: "HeyChat",
      shortDescription:
        "Microservice-based messaging system with event-driven architecture, search, and gateway auth.",
      roles: ["Backend", "Data Engineering & Analytics", "Frontend"],
      tags: [
        "Python",
        "FastAPI",
        "PostgreSQL",
        "Redis Streams",
        "Pub/Sub",
        "Elasticsearch",
        "Docker Compose",
        "Nginx",
        "React",
        "Authentication",
        "Authorization",
      ],
      highlights: [
        "Microservice-based system design",
        "Event-driven architecture (Redis Streams, Pub/Sub)",
        "API Gateway with authentication & authorization",
        "Elasticsearch-powered search",
      ],
      details: [
        "Designed service boundaries and communication patterns for scalability.",
        "Implemented search and data modeling considerations for high-read workloads.",
        "Integrated Telegram authentication for streamlined onboarding.",
      ],
      links: { github: "https://github.com/prograin/heychat", liveDemo: null },
      media: { videoUrl: "./assets/videos/heychat.mp4", images: [] },
      isPrivate: false,
    },
    // -------------------
    {
      id: "oildb",
      title: "Oil-DB",
      shortDescription:
        "A private full-stack Nuxt app deployed on Cloudflare, built around a D1 (SQLite) database with evolving migrations and a modular Vue/Tailwind UI.",
      roles: [
        "Data Engineering & Analytics",
        "Backend",
        "Frontend",
        "Fullstack",
      ],
      tags: [
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
      ],
      highlights: [
        "Private, client-commissioned full-stack application (not publicly released)",
        "Built on Cloudflare infrastructure with Cloudflare D1 (SQLite) as the primary database",
        "Implemented multiple database migrations to evolve schema safely over time",
        "Nuxt + Vue UI with Tailwind CSS for a clean, responsive user experience",
        "Modular architecture using reusable components and composables",
        "Handled non-trivial relational modeling and data consistency challenges",
      ],
      details: [
        "Oil-DB is a private, client-commissioned full-stack application designed for a specific group of users and not intended for public release.",
        "I used Cloudflare for deployment and infrastructure, with Cloudflare D1 as the database layer (built on SQLite).",
        "A key part of the work was designing the database schema and implementing multiple migrations to safely evolve tables, relationships, and constraints as requirements changed.",
        "The UI was built with Nuxt and Vue, styled with Tailwind CSS, focusing on clarity, responsiveness, and maintainability.",
        "On the engineering side, the project follows a modular structure: composables encapsulate reusable business logic while components keep the interface clean and scalable.",
        "The main technical challenges centered around relational data modeling and ensuring data integrity across entities—solved through careful schema design, iterative migrations, and robust full-stack integration in Nuxt.",
      ],
      links: { github: null, liveDemo: null },
      media: { videoUrl: "", images: [] },
      isPrivate: true,
    },

    // -------------------
    {
      id: "analytical-dashboard",
      title: "Analytical Dashboard",
      shortDescription:
        "Confidential ETL + warehouse + dashboards for KPI-driven reporting and monitoring.",
      roles: ["Data Engineering & Analytics"],
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
    // -------------------
    {
      id: "freelancer-etl-dashboard",
      title: "Freelancer Management ETL",
      shortDescription:
        "Automated ETL pipeline to monitor freelancer work hours, task progress, and performance metrics using Python and Google Sheets.",
      roles: ["Data Engineering & Analytics"],
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
      links: {
        github: null,
        liveDemo: null,
      },
      media: {
        videoUrl: null,
        images: [],
      },
      isPrivate: true,
    },
    // -------------------
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
    // -------------------
    {
      id: "report-bot",
      title: "Report Bot",
      shortDescription:
        "Confidential Telegram analytics bot + FastAPI backend with MongoDB and automated reporting flows.",
      roles: ["Backend", "Data Engineering & Analytics"],
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
      links: { github: null, liveDemo: null },
      media: {
        videoUrl:
          "https://drive.google.com/file/d/1nUgbwAzzEU3B5acAwckE_pqG8-rjVuNP/view?usp=drive_link",
        images: [],
      },
      isPrivate: false,
    },
    // -------------------
    {
      id: "vdoc",
      title: "vDoc",
      shortDescription:
        "Confidential desktop document system with XML/HTML storage and hierarchical tree visualization.",
      roles: ["Data Engineering & Analytics", "Desktop Applications"],
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
      }, // ✅ video added
      isPrivate: false,
    },
    // -------------------
    {
      id: "bmc",
      title: "BMC",
      shortDescription:
        "A confidential Excel-like desktop system focused on structured persistence, database-backed workbooks, and a formula engine for dynamic, editable tables.",
      roles: ["Data Engineering & Analytics"],
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
    // -------------------
    {
      id: "mgv",
      title: "Matrix Graphical Visualization (MGV)",
      shortDescription:
        "PyQt6 desktop app for interactive matrix visualization, formula-driven tables, and Python-powered animations with an embedded code editor.",
      roles: ["Desktop Applications"],
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
    // -------------------
    {
      id: "steel-defect-detection",
      title: "Steel Defect Detection",
      shortDescription:
        "Industrial computer vision system for defect detection and localization using TensorFlow + EfficientNetB0, mask-driven training, and a custom loss for bbox/confidence/classification.",
      roles: ["Machine Learning"],
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

    // -------------------
    {
      id: "flooded-area-segmentation",
      title: "Flooded Area Detection & Segmentation",
      shortDescription:
        "U-Net-based deep learning model for detecting flooded regions from aerial imagery, optimized with EfficientNet-B4 and custom techniques.",
      roles: ["Machine Learning"],
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
        github: "https://lnkd.in/du2Xe3jV", // replace with actual link if desired
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
    // -------------------
    {
      id: "cnn-rectangle-predict",
      title: "CNN Rectangle Prediction",
      shortDescription:
        "A hands-on CNN experiment to predict rectangle geometry from synthetic images.",
      roles: ["Machine Learning"],
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
      links: {
        github: null,
        liveDemo: null,
      },
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
    // -------------------
    {
      id: "mnist-digit-recognition",
      title: "Handwritten Digit Recognition",
      shortDescription:
        "CNN-based handwritten digit recognition system using PyTorch and MNIST with an interactive drawing interface.",
      roles: ["Machine Learning"],
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
      links: {
        github: null,
        liveDemo: null,
      },
      media: {
        videoUrl:
          "https://drive.google.com/file/d/1LdBkhb8vczB2nLgRt6KQdUpeZrnfd-Xt/view?usp=sharing",
        images: [],
      },
      isPrivate: false,
    },
    // -------------------
    {
      id: "realtime-sentiment-analysis",
      title: "Real-Time Sentiment Analysis",
      shortDescription:
        "Comparative study of LSTM models with Self-Attention for real-time sentiment prediction.",
      roles: ["Machine Learning"],
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
      links: {
        github: null,
        liveDemo: null,
      },
      media: {
        videoUrl:
          "https://drive.google.com/file/d/1XS8i8TK-3Nb9ZLL_JLHv2IA9Pgy9U3FD/view?usp=drive_link",
        images: [],
      },
      isPrivate: false,
    },
  ],
};
