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
        "Nuxt full-stack app with Cloudflare D1, authentication, and Tailwind-based UI.",
      roles: [
        "Data Engineering & Analytics",
        "Backend",
        "Frontend",
        "Fullstack",
      ],
      tags: [
        "Nuxt.js",
        "Cloudflare",
        "Cloudflare D1",
        "Authentication",
        "Tailwind CSS",
      ],
      highlights: [
        "Nuxt full-stack development",
        "Cloudflare D1 database usage",
        "Authentication & session handling",
        "Cloudflare deployment",
      ],
      details: [
        "Built end-to-end flows from persistence to UI with a focus on developer ergonomics.",
      ],
      links: {
        github: "https://github.com/prograin/oil-trade",
        liveDemo: null,
      },
      media: { videoUrl: "./assets/videos/oildb.mp4", images: [] },
      isPrivate: false,
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
      media: { videoUrl: "./assets/videos/Report_bot.mp4", images: [] },
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
      highlights: ["Document model", "XML/HTML storage", "Tree visualization"],
      details: ["Private / NDA project. Details available upon request."],
      links: { github: null, liveDemo: null },
      media: { videoUrl: "./assets/videos/vDoc.mp4", images: [] }, // ✅ video added
      isPrivate: false,
    },
    // -------------------
    {
      id: "bmc",
      title: "BMC",
      shortDescription:
        "Confidential Excel-like system with formula parsing, persistence, and tab-based data management.",
      roles: ["Data Engineering & Analytics"],
      tags: [
        "XML",
        "Persistence",
        "Formula Parsing",
        "Data Modeling",
        "Desktop UI",
      ],
      highlights: [
        "Formula engine",
        "Persistence",
        "Tab-based data management",
      ],
      details: ["Private / NDA project."],
      links: { github: null, liveDemo: null },
      media: { videoUrl: "./assets/videos/BMC.mp4", images: [] }, // ✅ video added
      isPrivate: false,
    },
    // -------------------
    {
      id: "mgv",
      title: "Matrix Graphical Visualization (MGV)",
      shortDescription:
        "Python + Qt desktop app for interactive matrix visualization with embedded code editing.",
      roles: ["Desktop Applications"],
      tags: ["PyQt", "Qt Creator", "Python", "Desktop UI", "Linear Algebra"],
      highlights: [
        "Interactive matrix visualization",
        "Embedded Python code editor",
        "Educational simulation tooling",
      ],
      details: [
        "Designed a responsive UI and clear workflows for exploring matrix operations.",
      ],
      links: {
        github: "https://github.com/prograin/Matrix_repre_py",
        liveDemo: null,
      },
      media: { videoUrl: "./assets/videos/MGV.mkv", images: [] },
      isPrivate: false,
    },
    // -------------------
    {
      id: "steel-defect-detection",
      title: "Steel Defect Detection",
      shortDescription:
        "Industrial computer vision: fine-tuned deep learning models for defect detection and classification.",
      roles: ["Machine Learning"],
      tags: [
        "PyTorch",
        "TensorFlow",
        "CNN",
        "Image Processing",
        "Data Augmentation",
        "Custom Loss",
      ],
      highlights: [
        "Fine-tuning pretrained backbones",
        "Custom CNN architectures",
        "Custom loss function design",
        "Augmentation + evaluation",
      ],
      details: [
        "Compared multiple candidates and training strategies under industrial constraints.",
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
        github: "https://github.com/your-repo-link", // replace with actual link if desired
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
          "rect_predict_3.png",
          "rect_predict_2.png",
          "rect_predict_1.png",
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
        videoUrl: "./assets/video/Mnist_Predict.mp4",
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
        videoUrl: "./assets/videos/IMDB-sentiment.mp4",
        images: [],
      },
      isPrivate: false,
    },
  ],
};
