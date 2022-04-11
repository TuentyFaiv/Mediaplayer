import { changeIcon } from "@utils";
import controlsPlayStyles from "@styles/components/play.scss";

import playIcon from "@icons/play.svg";
import pauseIcon from "@icons/pause.svg";
import forwardIcon from "@icons/forward.svg";
import replayIcon from "@icons/replay.svg";

class ControlsPlay extends HTMLElement {
  btns: NodeListOf<HTMLButtonElement>;
  playbox: HTMLDivElement;
  //Attributes
  player_media: HTMLVideoElement;

  set media(media: HTMLVideoElement) {
    this.player_media = media;
    this.playbox.style.top = `calc(-${this.player_media.offsetHeight}px + 90px)`;
    this.playbox.style.width = `${this.player_media.offsetWidth}px`;
    this.playbox.style.height = `calc(${this.player_media.offsetHeight}px - 110px)`;
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

  getTemplate(): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = `
      ${this.getStyles()}
      <div id="divPlay">
      </div>
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

  getStyles(): string {
    return `
      <style type="text/css">
        :host {}
        ${controlsPlayStyles}
      </style>
    `;
  }

  render(): void {
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

  //Features
  keyPress(event: KeyboardEvent): void {
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

  moveTo(secs: number): void {
    this.player_media.currentTime = this.player_media.currentTime + secs;
  }

  togglePlay(): void {
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