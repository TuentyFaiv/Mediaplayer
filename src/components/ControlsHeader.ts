/* eslint-disable max-len */
import controlsHeaderStyles from "@styles/components/header.scss";

import shareIcon from "@icons/share.svg";

class ControlsHeader extends HTMLElement {
  protected container: HTMLDivElement;
  protected btnShare: HTMLButtonElement;
  protected modalShare: HTMLSpanElement;
  protected iconsShare: NodeListOf<SVGElement>;
  protected modal: boolean;
  protected share_url: string;
  //Attributes
  player_title: string;
  player_share: string;

  //Life cycle
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.modal = false;
  }

  static get observedAttributes(): string[] {
    return ["player_title", "player_share"];
  }

  attributeChangedCallback(attr, oldAttr, newAttr): void {
    this[attr] = newAttr;
  }

  protected getTemplate(): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = `
      ${this.getStyles()}
      <h1>${this.player_title}</h1>
      <div class="player_controls-share">
        <button
          id="share"
          title="Share"
          style="${this.player_share === "true" ? "" : "display: none;"}"
          ${this.player_share === "true" ? "" : "disabled=\"true\""}
        >
          ${shareIcon}
        </button>
        <span id="modalShare"></span>
      </div>
    `;

    return template;
  }

  protected getStyles(): string {
    return `
      <style type="text/css">
        :host {
          cursor: normal;
        }
        ${controlsHeaderStyles}
      </style>
    `;
  }

  protected render(): void {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.container = this.shadowRoot.querySelector(".player_controls-share");
    this.btnShare = this.shadowRoot.querySelector("button#share");
    this.modalShare = this.shadowRoot.getElementById("modalShare");

    this.share_url = document.location.href;

    this.btnShare.removeChild(this.btnShare.firstChild);

    this.container.onmouseenter = () => {
      if (navigator.share === undefined) {
        this.shareVideo();
      }
    };
    this.container.onmouseleave = () => {
      if (navigator.share === undefined) {
        if (this.modal === true) {
          this.toggleModal();
        }
        this.removeModalContent(0);
      }
    };

    this.btnShare.onclick = () => {
      if (navigator.share !== undefined) {
        this.shareVideoByNavigator();
      }
    };
  }

  connectedCallback(): void {
    this.render();
  }

  //Features
  protected toggleModal(): void {
    if (this.modal === false) {
      this.modalShare.style.display = "flex";
      this.btnShare.style.marginLeft = "1.5em";
    } else {
      this.modalShare.style.display = "none";
      this.btnShare.style.marginLeft = "0";
    }
    this.modal = !this.modal;
  }

  protected addModalContent(content: string): void {
    this.modalShare.innerHTML = content;
    this.toggleModal();
  }

  protected removeModalContent(time: number): void {
    setTimeout(() => {
      this.modalShare.innerHTML = "";
    }, time);
  }

  protected shareVideo(): void {
    const copyLink = () => {
      navigator.clipboard.writeText(this.share_url).then(() => {
        this.addModalContent(`Enlace copiado: ${this.share_url}`);
        this.removeModalContent(2000);
      }, () => {
        this.addModalContent("Error al compartir");
        this.removeModalContent(2000);
      });
    };
    this.addModalContent(`
      <div tabindex="0" title="Share by Twitter">
        <a
          class="iconShare"
          href="https://twitter.com/intent/tweet?url=${this.share_url}&text=${this.player_title}"
          target="_blank"
          rel="noopener noreferrer"
        > 
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-twitter" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.009z" />
          </svg>
        </a>
      </div>
      <div tabindex="0" title="Share by Facebook">
        <a
          class="iconShare"
          href="https://www.facebook.com/sharer/sharer.php?u=${this.share_url}&display=popup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-facebook" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
          </svg>
        </a>
      </div>
      <div tabindex="0" title="Copy link">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-copy" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
      </div>
    `);
    this.iconsShare = this.shadowRoot.querySelectorAll(".icon");
    this.iconsShare[0].onclick = () => {
      this.removeModalContent(3000);
      this.toggleModal();
    };
    this.iconsShare[1].onclick = () => {
      this.removeModalContent(3000);
      this.toggleModal();
    };
    this.iconsShare[2].onclick = () => {
      copyLink();
      this.toggleModal();
    };
  }

  protected shareVideoByNavigator(): void {
    navigator.share({
      title: this.player_title,
      text: "",
      url: this.share_url
    })
      .catch(() => {
        this.addModalContent("Error al compartir");
        setTimeout(() => {
          this.toggleModal();
        }, 3000);
        this.removeModalContent(3000);
      });
  }
}

customElements.define("tf-controls-header", ControlsHeader);
