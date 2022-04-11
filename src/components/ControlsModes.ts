import { changeIcon } from "@utils";

import modesStyles from "@styles/components/modes.scss";

import fullscreenIcon from "@icons/fullscreen.svg";
import fullscreenExitIcon from "@icons/fullscreen_exit.svg";
import theaterOnIcon from "@icons/theaterOn.svg";
import theaterOffIcon from "@icons/theaterOff.svg";
import PinPIcon from "@icons/pinp.svg";

class ControlsModes extends HTMLElement {
  btns: NodeListOf<HTMLButtonElement>;
  teatherState: boolean;
  //Attributes
  player_media: HTMLVideoElement;
  player_width: string;
  player_height: string;
  player_background: string;

  set media(media: HTMLVideoElement) {
    this.player_media = media;
  }

  //Life cycle
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.teatherState = false;
  }

  static get observedAttributes(): string[] {
    return ["player_media", "player_width", "player_height", "player_background"];
  }

  attributeChangedCallback(attr, oldAttr, newAttr): void {
    this[attr] = newAttr;
  }

  getTemplate(): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = `
      ${this.getStyles()}
      <button title="Picture in picture (p)">${PinPIcon}</button>
      <button title="Theater mode (t)">${theaterOnIcon}</button>
      <button title="Fullscreen (f)">${fullscreenIcon}</button>
    `;

    return template;
  }

  getStyles(): string {
    return `
      <style type="text/css">
        :host {}
        ${modesStyles}
      </style>
    `;
  }

  render(): void {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.btns = this.shadowRoot.querySelectorAll("button");
    this.btns.forEach((element: HTMLElement) => {
      element.removeChild(element.firstChild);
    });

    if (!("pictureInPictureEnabled" in document)) {
      this.btns[0].style.display = "none";
    }

    this.btns[0].onclick = () => this.setPinP();
    this.btns[1].onclick = () => this.toggleTeatherMode();
    this.btns[2].onclick = () => this.toggleFullScreen();

    document.addEventListener("keydown", this.keyPress.bind(this));
  }

  connectedCallback(): void {
    this.render();
  }

  //Attributes
  keyPress(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 70:
        this.toggleFullScreen();
        break;
      case 80:
        this.setPinP();
        break;
      case 84:
        this.toggleTeatherMode();
        break;
      default:
        break;
    }
  }

  setPinP(): void {
    if (!("pictureInPictureEnabled" in document)) {
      this.btns[0].style.display = "none";
    } else {
      this.player_media.requestPictureInPicture();
    }
  }

  toggleFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      changeIcon(this.btns[2], fullscreenIcon);
    } else {
      this.player_media.parentElement.requestFullscreen();
      changeIcon(this.btns[2], fullscreenExitIcon);
    }
  }

  toggleTeatherMode(): void {
    if (this.teatherState) {
      this.player_media.parentElement.style.position = "relative";
      this.player_media.parentElement.style.width = this.player_width;
      this.player_media.parentElement.style.height = this.player_height;
      this.player_media.parentElement.style.top = "";
      this.player_media.parentElement.style.left = "";
      this.player_media.parentElement.style.right = "";
      this.player_media.style.background = this.player_background;
      changeIcon(this.btns[1], theaterOnIcon);
      this.teatherState = false;
    } else {
      this.player_media.parentElement.style.position = "absolute";
      this.player_media.parentElement.style.width = "100%";
      this.player_media.parentElement.style.height = "80vh";
      this.player_media.parentElement.style.top = "0";
      this.player_media.parentElement.style.left = "0";
      this.player_media.parentElement.style.right = "0";
      this.player_media.style.background = this.player_background;
      changeIcon(this.btns[1], theaterOffIcon);
      this.teatherState = true;
    }
  }
}

customElements.define("tf-controls-modes", ControlsModes);
export default ControlsModes;