---
layout: base
title: À Propos de Moi
---

<!-- About Header -->
<section class="about-header">
  <div class="about-header-content">
    <h1 class="about-title">À Propos de Moi</h1>
    <p class="about-subtitle">
      Data Scientist & AI Engineer passionné par la data, le soccer et le basketball
    </p>
  </div>
</section>

<!-- About Profile Section -->
<section class="about-profile-section">
  <div class="about-profile-wrapper">
    <!-- Avatar & Social -->
    <div class="about-avatar-wrapper">
      {% assign avatar_path = site.avatar | default: '/assets/img/portofolio-rond.jpg' %}
      <img 
        src="{{ avatar_path | relative_url }}" 
        alt="Daya - Data Scientist & AI Engineer" 
        class="about-avatar"
        loading="eager"
        onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';"
      >
      <div style="display: none; width: 100%; max-width: 300px; height: 300px; background: linear-gradient(135deg, #E31E24 0%, #1E40AF 100%); border-radius: 16px; align-items: center; justify-content: center; color: white; font-size: 4rem; font-weight: 700; margin: 0 auto 1.5rem;">
        D
      </div>
      
      <div class="about-social-links">
        <a href="https://github.com/smdlabtech" class="about-social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/dayasylla/" class="about-social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="https://x.com/BrainYadzo" class="about-social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="mailto:smdlabtech@gmail.com" class="about-social-link" aria-label="Email" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-envelope"></i>
        </a>
      </div>
    </div>
    
    <!-- Content -->
    <div class="about-content-wrapper">
      <div class="about-content">
        <h2>👋 Salut, je suis Daya</h2>
        
        <p>
          Je suis un <strong>Data Scientist & AI Engineer</strong> avec une passion pour le soccer et le basketball. 
          Ce blog est une façon de partager ma passion pour la Business Intelligence, la data science et la programmation 
          à travers les langages : <strong>Python</strong>, <strong>R</strong>, <strong>SQL</strong>, <strong>Javascript</strong> 
          et des outils comme <strong>Power BI</strong>, <strong>Shiny</strong>, <strong>Streamlit</strong>, 
          <strong>Excel VBA</strong> et <strong>Google Sheets</strong> (via <strong>Google Apps Script</strong>).
        </p>
        
        <p>
          😎 J'adore travailler sur des sujets comme : Chatbot Assistant, Text Mining & NLP, Web App Machine Learning, 
          Deep Learning, AI Assistant et Web Scraping ⭐
        </p>
        
        <details>
          <summary>➡️ <em>Voir plus de détails sur moi...</em></summary>
          
          <div>
            <h3>🧑‍💻 Developer (Full Stack + AI)</h3>
            <ul>
              <li>Développement end-to-end d'applications <strong>Web, Data et AI</strong>, du MVP au produit déployé.</li>
              <li>Stack technologique maîtrisée :
                <ul>
                  <li><strong>Frontend</strong> : React (TypeScript, TailwindCSS), Streamlit, PWA</li>
                  <li><strong>Backend</strong> : FastAPI, Firebase, Node.js, Python</li>
                  <li><strong>Cloud & DevOps</strong> : GCP (Cloud Run, Vertex AI), Firebase, Azure, GitHub Actions, Docker</li>
                </ul>
              </li>
              <li>Intégration d'<strong>agents IA</strong> (RAG, Gemini, GPT) dans des applications métier et copilots documentaires.</li>
              <li>Expertise en REST APIs, bases de données (NoSQL/SQL), CI/CD, et authentification sécurisée (JWT, Firebase Auth).</li>
            </ul>
          </div>
          
          <div>
            <h3>🧠 Problem Solver (Tech + Product)</h3>
            <ul>
              <li>Décomposition logique de défis complexes.</li>
              <li>Conception de solutions concrètes à partir de besoins métier flous.</li>
              <li>Prototypage rapide, automatisation, IA générative et systèmes de scoring intelligents.</li>
              <li>Utilisation agile d'outils low-code, scripting, cloud, IA et environnements de développement natifs.</li>
            </ul>
          </div>
          
          <div>
            <h3>📦 Product Owner / Product Builder</h3>
            <ul>
              <li>Cadrage produit, définition MVP, planification roadmap, gestion backlog et user stories.</li>
              <li>Livraison de produits complets : plateformes SaaS, outils IA, solutions internes.</li>
              <li>Pilotage de projets hybrides (tech + business) avec itérations rapides.</li>
              <li>Propriété full-stack permettant une <strong>autonomie produit end-to-end</strong>.</li>
            </ul>
          </div>
          
          <div>
            <h3>📈 Product Marketing and Growth Manager</h3>
            <ul>
              <li>Conception de landing pages impactantes (SEO, CTA, tracking analytics).</li>
              <li>Positionnement produit clair, stratégie freemium ou SaaS.</li>
              <li>Monétisation via Stripe (checkout, abonnements).</li>
              <li>Préparation go-to-market (GitHub, Product Hunt, marketplaces).</li>
              <li>Pitching clair, storytelling produit et mise en avant des différenciateurs clés.</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  </div>
</section>

<!-- Skills Section -->
<section class="about-skills-section">
  <div class="about-skills-grid">
    <div class="about-skill-card">
      <span class="about-skill-icon">🐍</span>
      <h3 class="about-skill-title">Langages</h3>
      <ul class="about-skill-list">
        <li>Python</li>
        <li>R</li>
        <li>SQL</li>
        <li>JavaScript</li>
        <li>TypeScript</li>
      </ul>
    </div>
    
    <div class="about-skill-card">
      <span class="about-skill-icon">📊</span>
      <h3 class="about-skill-title">Outils Data</h3>
      <ul class="about-skill-list">
        <li>Power BI</li>
        <li>Tableau</li>
        <li>Excel VBA</li>
        <li>Google Sheets</li>
        <li>Shiny</li>
        <li>Streamlit</li>
      </ul>
    </div>
    
    <div class="about-skill-card">
      <span class="about-skill-icon">🤖</span>
      <h3 class="about-skill-title">IA & ML</h3>
      <ul class="about-skill-list">
        <li>Machine Learning</li>
        <li>Deep Learning</li>
        <li>NLP & Text Mining</li>
        <li>Chatbots & AI Assistants</li>
        <li>RAG & LLMs</li>
      </ul>
    </div>
    
    <div class="about-skill-card">
      <span class="about-skill-icon">☁️</span>
      <h3 class="about-skill-title">Cloud & DevOps</h3>
      <ul class="about-skill-list">
        <li>GCP (Cloud Run, Vertex AI)</li>
        <li>Firebase</li>
        <li>Azure</li>
        <li>GitHub Actions</li>
        <li>Docker</li>
      </ul>
    </div>
  </div>
</section>

<!-- Contact Section -->
<section class="about-contact-section">
  <div class="about-contact-content">
    <h2 class="about-contact-title">🌎 Contactez-moi</h2>
    <p class="about-contact-description">
      N'hésitez pas à me contacter pour discuter de projets, collaborations ou simplement échanger sur la data et l'IA !
    </p>
    <div class="about-contact-buttons">
      <a href="mailto:smdlabtech@gmail.com" class="about-contact-button">
        <i class="fas fa-envelope"></i>
        Envoyer un Email
      </a>
      <a href="https://www.linkedin.com/in/dayasylla/" class="about-contact-button about-contact-button-secondary" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-linkedin"></i>
        LinkedIn
      </a>
      <a href="https://github.com/smdlabtech" class="about-contact-button about-contact-button-secondary" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i>
        GitHub
      </a>
    </div>
  </div>
</section>
