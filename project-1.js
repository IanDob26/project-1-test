import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { siteCard } from "./site-card";
//declares variables items title and siteURL
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

  // get properties
  static get properties() {
    return {};
  }

  // sets up css 
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
          margin-left: var(--ddd-spacing-2);
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
        #description{
          text-align: center;
        }
      
        site-card {
          background-color: var(--ddd-theme-default-navy40);
          width: 20%;
          min-width: 300px;
          margin: var(--ddd-spacing-10);
          border: var(--ddd-border-sm);
          position: relative;
          padding-bottom: 232px;
        }
      `,
    ];
  }

  // Render method
  render() {
    return html`
      <div id="controls">
        <input id="input" placeholder="Input your site.json here" />
        <button id="analyze" @click=${this.analyzeSite}>Analyze</button>
      </div>
      <div id="title"></div>
      <div id="description"></div>
      <div id="results"></div>
    `;
  }

  //converts the dateto a string. 
  dateToString(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  }
//checks if the user inserted has site.json at the back. If it has do nothing. If not it adds it the site.json at the end. 
  checkJson() {
    const input = this.shadowRoot.getElementById("input");
    let site = input.value;
    //if the input value doesn't inclue site.json
    if (!input.value.includes("site.json")) {
      site = input.value + "site.json";
    }
    siteURL = site.replace("site.json", "");
    return site;
  }
//asynch returns a promise. Which means it will eventually be completed or die trying. 
  async analyzeSite() {
    //gets json data awai is used with aysnc
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
    // get title element and the description
    const titleElement = this.shadowRoot.getElementById("title");
    const descriptionElement = this.shadowRoot.getElementById("description")
  
    //set title and description
    titleElement.innerHTML = data.title;
    descriptionElement.innerHTML = data.description;
    
    for (let i = 0; i < items.length; i++) {
      const card = document.createElement("site-card");
      card.name = items[i].title;
      card.description = items[i].description;
      card.createdTime = this.dateToString(items[i].metadata.created);
      card.updatedTime = this.dateToString(items[i].metadata.updated);
//if no logo upload the hax one 
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