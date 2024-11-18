import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { siteCard } from "./site-card";

let items = [];
let title = "";
let siteURL = "";

export class project1 extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "project-1";
  }

  constructor() {
    super();
  }

  // Lit reactive properties
  static get properties() {
    return {};
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        #input {
          width: 50%;
          font-size: 24px;
          padding: var(--ddd-spacing-4);
        }
        #analyze {
          background-color: var(--ddd-theme-default-creekTeal);
          font-size: 24px;
          padding: var(--ddd-spacing-4);
          margin-left: var(--ddd-spacing-3);
        }
        #controls {
          display: flex;
          justify-content: center;
          margin: var(--ddd-spacing-5);
        }

        #results {
          display: flex;
          flex-wrap: wrap;
        }
        #title {
          text-align: center;
        }
      
        site-card {
          background-color: var(--ddd-theme-default-navy40);
          width: 20%;
          min-width: 300px;
          margin: var(--ddd-spacing-10);
          border: var(--ddd-border-lg);
          position: relative;
          padding-bottom: 232px;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`
      <div id="controls">
        <input id="input" placeholder="Input your site.json here" />
        <button id="analyze" @click=${this.analyzeSite}>Analyze</button>
      </div>
      <div id="title"></div>
      <div id="results"></div>
    `;
  }

  dateToString(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  }

  checkJson() {
    const input = this.shadowRoot.getElementById("input");
    let site = input.value;
    if (!input.value.includes("site.json")) {
      site = input.value + "site.json";
    }
    siteURL = site.replace("site.json", "");
    return site;
  }

  async analyzeSite() {
    // Get the JSON data
    const site = this.checkJson();
    const response = await fetch(site);
    const data = await response.json();

    // Set the title and items
    title = data.title;
    items = data.items;

    // get container
    const container = this.shadowRoot.getElementById("results");
    // clear container
    container.innerHTML = "";
    // get title element
    const titleElement = this.shadowRoot.getElementById("title");
    //set title
    titleElement.innerHTML = data.title;

    for (let i = 0; i < items.length; i++) {
      const card = document.createElement("site-card");
      card.name = items[i].title;
      card.description = items[i].description;
      card.createdTime = this.dateToString(items[i].metadata.created);
      card.updatedTime = this.dateToString(items[i].metadata.updated);

      if (items[i].metadata.images.length == 0) {
        card.logo =
          "https://iam.hax.psu.edu/ipd5080/sites/hwist256week2/assets/banner.jpg";
      } else {
        card.logo = siteURL + items[i].metadata.images[0];
      }
      console.log(card.logo);

      container.appendChild(card);
    }

    console.log(items);
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(project1.tag, project1);