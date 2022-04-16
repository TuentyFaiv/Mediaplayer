import { changeIcon } from "@utils";
import controlsPlayStyles from "@styles/components/play.scss";

import playIcon from "@icons/play.svg";
import pauseIcon from "@icons/pause.svg";
import forwardIcon from "@icons/forward.svg";
import replayIcon from "@icons/replay.svg";

class ControlsPlay extends HTMLElement {
  protected btns: NodeListOf<HTMLButtonElement>;
  protected playbox: HTMLDivElement;
  protected resizeOberver: ResizeObserver;
  //Attributes
  player_media: HTMLVideoElement;

  set media(media: HTMLVideoElement) {
    this.player_media = media;
    const controls = this.player_media.nextElementSibling.shadowRoot.querySelector(".controls");
    const header = controls.firstElementChild;
    const footer = controls.lastElementChild;
    const lessHeight = header.clientHeight + footer.clientHeight;

    if (this.playbox) {
      this.resizeOberver = !this.resizeOberver ? new ResizeObserver((entries) => {
        const mediaObserved = entries[0].target;
        this.playbox.style.bottom = `${footer.clientHeight}px`;
        this.playbox.style.width = `${mediaObserved.clientWidth}px`;
        this.playbox.style.height = `calc(${mediaObserved.clientHeight}px - ${lessHeight}px)`;
        if (mediaObserved.clientWidth < 376) {
          this.playbox.style.display = "none";
          this.btns.forEach((btn) => {
            const transform = (mediaObserved.clientHeight / 2) - (btn.clientHeight / 2);
            btn.style.transform = `translateY(-${transform}px)`;
          });
        } else {
          this.playbox.style.display = "block";
          this.btns.forEach((btn) => {
            btn.style.transform = "translateY(0)";
          });
        }
      }) : this.resizeOberver;
      this.resizeOberver.observe(this.player_media);

      this.playbox.style.bottom = `${footer.clientHeight}px`;
      this.playbox.style.width = `${this.player_media.clientWidth}px`;
      this.playbox.style.height = `calc(${this.player_media.clientHeight}px - ${lessHeight}px)`;
    }
  }

  //Life cycle
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): string[] {
    return ["player_media"];
  }

  attributeChangedCallback(attr, oldAttr, newAttr): void {
    this[attr] = newAttr;
  }

  protected getTemplate(): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = `
      ${this.getStyles()}
      <div id="divPlay"></div>
      <button class="backward" title="Backward 10s (Arrow left)">
        ${replayIcon}
      </button>
      <button class="play" title="Play/Pause (Spacebar)">
        ${pauseIcon}
      </button>
      <button class="forward" title="Forward 10s (Arrow right)">
        ${forwardIcon}
      </button>
    `;

    return template;
  }

  protected getStyles(): string {
    return `
      <style type="text/css">
        :host {}
        ${controlsPlayStyles}
      </style>
    `;
  }

  protected render(): void {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.playbox = this.shadowRoot.querySelector("#divPlay");
    this.btns = this.shadowRoot.querySelectorAll("button");
    this.btns.forEach((element: HTMLButtonElement) => {
      element.removeChild(element.firstChild);
    });

    this.playbox.onclick = () => this.togglePlay();
    this.btns[1].onclick = () => this.togglePlay();
    this.btns[0].onclick = () => this.moveTo(-10);
    this.btns[2].onclick = () => this.moveTo(10);
    document.addEventListener("keydown", this.keyPress.bind(this));
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this.resizeOberver.disconnect();
  }

  //Features
  protected keyPress(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 37:
        this.moveTo(-10);
        break;
      case 39:
        this.moveTo(10);
        break;
      case 32:
        this.togglePlay();
        break;
      default:
        break;
    }
  }

  protected moveTo(secs: number): void {
    this.player_media.currentTime = this.player_media.currentTime + secs;
  }

  protected togglePlay(): void {
    if (this.player_media.paused) {
      changeIcon(this.btns[1], pauseIcon);
      this.player_media.play();
    } else {
      changeIcon(this.btns[1], playIcon);
      this.player_media.pause();
    }
  }
}

customElements.define("tf-controls-play", ControlsPlay);
export default ControlsPlay;