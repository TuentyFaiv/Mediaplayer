import { changeIcon } from "@utils";

import modesStyles from "@styles/components/modes.scss";

import fullscreenIcon from "@icons/fullscreen.svg";
import fullscreenExitIcon from "@icons/fullscreen_exit.svg";
import theaterOnIcon from "@icons/theaterOn.svg";
import theaterOffIcon from "@icons/theaterOff.svg";
import PinPIcon from "@icons/pinp.svg";

class ControlsModes extends HTMLElement {
  protected btns: NodeListOf<HTMLButtonElement>;
  protected teatherState: boolean;
  protected pipButton: HTMLButtonElement;
  protected theaterButton: HTMLButtonElement;
  protected fullscrennButton: HTMLButtonElement;
  //Attributes
  player_media: HTMLVideoElement;
  player_width: string;
  player_height: string;
  player_background: string;
  player_theater: string;

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
    return ["player_media", "player_width", "player_height", "player_background", "player_theater"];
  }

  attributeChangedCallback(attr, oldAttr, newAttr): void {
    this[attr] = newAttr;
  }

  protected getTemplate(): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = `
      ${this.getStyles()}
      <button class="mode" id="pip" title="Picture in picture (p)">${PinPIcon}</button>
      <button class="mode" id="theaterMode" title="Theater mode (t)">${theaterOnIcon}</button>
      <button class="mode" id="fullscreen" title="Fullscreen (f)">${fullscreenIcon}</button>
    `;

    return template;
  }

  protected getStyles(): string {
    return `
      <style type="text/css">
        :host {}
        * {
          margin: 0;
          padding: 0;
        }
        ${modesStyles}
      </style>
    `;
  }

  protected render(): void {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.btns = this.shadowRoot.querySelectorAll("button.mode");
    this.btns.forEach((element: HTMLElement) => {
      element.removeChild(element.firstChild);
    });
    this.pipButton = this.shadowRoot.querySelector("button#pip");
    this.theaterButton = this.shadowRoot.querySelector("button#theaterMode");
    this.fullscrennButton = this.shadowRoot.querySelector("button#fullscreen");

    if (!("pictureInPictureEnabled" in document)) {
      this.pipButton.style.display = "none";
    }

    this.pipButton.onclick = () => this.setPinP();
    this.theaterButton.onclick = () => this.toggleTeatherMode();
    this.fullscrennButton.onclick = () => this.toggleFullScreen();

    if (this.player_theater !== "true") this.theaterButton.remove();

    document.addEventListener("keydown", this.keyPress.bind(this));
  }

  connectedCallback(): void {
    this.render();
  }

  //Attributes
  protected keyPress(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 70:
        this.toggleFullScreen();
        break;
      case 80:
        this.setPinP();
        break;
      case 84:
        if (this.player_theater === "true") this.toggleTeatherMode();
        break;
      default:
        break;
    }
  }

  protected setPinP(): void {
    if (!("pictureInPictureEnabled" in document)) {
      this.pipButton.style.display = "none";
    } else {
      this.player_media.requestPictureInPicture();
    }
  }

  protected toggleFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      changeIcon(this.fullscrennButton, fullscreenIcon);
    } else {
      this.player_media.parentElement.requestFullscreen();
      changeIcon(this.fullscrennButton, fullscreenExitIcon);
    }
  }

  protected toggleTeatherMode(): void {
    if (this.teatherState) {
      this.player_media.parentElement.style.position = "relative";
      this.player_media.parentElement.style.width = this.player_width;
      this.player_media.parentElement.style.height = this.player_height;
      this.player_media.parentElement.style.top = "";
      this.player_media.parentElement.style.left = "";
      this.player_media.parentElement.style.right = "";
      this.player_media.style.background = this.player_background;
      changeIcon(this.theaterButton, theaterOnIcon);
      this.teatherState = false;
    } else {
      this.player_media.parentElement.style.position = "absolute";
      this.player_media.parentElement.style.width = "100%";
      this.player_media.parentElement.style.height = "80vh";
      this.player_media.parentElement.style.top = "0";
      this.player_media.parentElement.style.left = "0";
      this.player_media.parentElement.style.right = "0";
      this.player_media.style.background = this.player_background;
      changeIcon(this.theaterButton, theaterOffIcon);
      this.teatherState = true;
    }
  }
}

customElements.define("tf-controls-modes", ControlsModes);
export default ControlsModes;