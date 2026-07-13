module.exports = {
  id: "industrial-split",
  name: "Industrial Split Layout",

  promptInstructions: `
The hero introduces the solution.
The introduction explains the operational context.
The problem section describes the main manufacturing challenge.
The feature section explains four system capabilities.
The FAQ addresses buyer and implementation questions.
`,

  outputExample: {
    metaTitle: "",
    metaDescription: "",
    hero: {
      eyebrow: "",
      heading: "",
      description: "",
      primaryCta: "",
      secondaryCta: ""
    },
    introduction: "",
    problemSection: {
      label: "",
      heading: "",
      description: ""
    },
    featureSection: {
      heading: "",
      description: "",
      cards: [
        {
          title: "",
          description: ""
        },
        {
          title: "",
          description: ""
        },
        {
          title: "",
          description: ""
        },
        {
          title: "",
          description: ""
        }
      ]
    },
    faq: [
      {
        question: "",
        answer: ""
      },
      {
        question: "",
        answer: ""
      },
      {
        question: "",
        answer: ""
      },
      {
        question: "",
        answer: ""
      },
      {
        question: "",
        answer: ""
      }
    ]
  },

  render(content, escapeHtml) {
    return `
      <section class="industrial-hero">
        <div class="industrial-hero__content">
          <span class="industrial-hero__eyebrow">
            ${escapeHtml(content.hero.eyebrow)}
          </span>

          <h1>${escapeHtml(content.hero.heading)}</h1>

          <p>${escapeHtml(content.hero.description)}</p>

          <div class="industrial-hero__actions">
            <a href="/demo" class="primary-btn">
              ${escapeHtml(content.hero.primaryCta)}
            </a>

            <a href="/contact" class="secondary-btn">
              ${escapeHtml(content.hero.secondaryCta)}
            </a>
          </div>
        </div>

        <div class="industrial-hero__image">
          {{FEATURED_IMAGE}}
        </div>
      </section>

      <section class="industrial-introduction">
        <p>${escapeHtml(content.introduction)}</p>
      </section>

      <section class="industrial-problem">
        <span>${escapeHtml(content.problemSection.label)}</span>
        <h2>${escapeHtml(content.problemSection.heading)}</h2>
        <p>${escapeHtml(content.problemSection.description)}</p>
      </section>

      <section class="industrial-features">
        <h2>${escapeHtml(content.featureSection.heading)}</h2>
        <p>${escapeHtml(content.featureSection.description)}</p>

        <div class="industrial-features__grid">
          ${content.featureSection.cards
            .map(
              (card, index) => `
                <article class="industrial-feature-card">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <h3>${escapeHtml(card.title)}</h3>
                  <p>${escapeHtml(card.description)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }
};
