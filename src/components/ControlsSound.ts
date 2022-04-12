import { changeIcon } from "@utils";
import soundStyles from "@styles/components/sound.scss";

import volumeUpIcon from "@icons/volume_up.svg";
import volumeMuteIcon from "@icons/volume_mute.svg";
import volumeDownIcon from "@icons/volume_down.svg";
import volumeOffIcon from "@icons/volume_off.svg";

class ControlsSound extends HTMLElement {
  volumeBtn: HTMLButtonElement;
  volumeInput: HTMLInputElement;
  volumeActive: HTMLDivElement;
  //Attributes
  player_media: HTMLVideoElement;

  set media(media: HTMLVideoElement) {
    this.player_media = media;
    this.activeVolume(this.player_media.volume);
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
      <div class="container" tabindex="0">
        <button title="Mute (m)">
          ${volumeUpIcon}
        </button>
        <div class="soundInput">
          <input
            tabindex="-1"
            type="range"
            min="0"
            max="1"
            step=".01"
            value="1"
            title="Volume (Arrow up) or (Arrow down)"
          />
          <div class="soundInput_active">
          </div>
        </div>
      </div>
    `;

    return template;
  }

  getStyles(): string {
    return `
      <style type="text/css">
        :host {}
        ${soundStyles}
      </style>
    `;
  }

  render(): void {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.volumeBtn = this.shadowRoot.querySelector("button");
    this.volumeInput = this.shadowRoot.querySelector("input");
    this.volumeActive = this.shadowRoot.querySelector(".soundInput_active");

    this.volumeBtn.removeChild(this.volumeBtn.firstChild);

    this.volumeBtn.onclick = () => this.toggleMute();
    this.volumeInput.onchange = this.handleInput;
    this.volumeInput.oninput = this.handleInput;
    document.addEventListener("keydown", this.keyPress.bind(this));
  }

  handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;

    this.changeVol(parseFloat(target.value));
  };

  connectedCallback(): void {
    this.render();
  }

  //Features
  keyPress(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 77:
        this.toggleMute();
        break;
      case 38:
        const volumePlus = this.player_media.volume + 0.01;
        this.changeVol(volumePlus);
        break;
      case 40:
        const volumeLess = this.player_media.volume - 0.01;
        this.changeVol(volumeLess);
        break;
      default:
        break;
    }
  }

  setVolumeIcon(volume: number): void {
    if (volume >= 0.6) {
      changeIcon(this.volumeBtn, volumeUpIcon);
    } else if (volume >= 0.3 && volume <= 0.6) {
      changeIcon(this.volumeBtn, volumeDownIcon);
    } else if (volume >= 0.01 && volume <= 0.3) {
      changeIcon(this.volumeBtn, volumeMuteIcon);
    } else {
      changeIcon(this.volumeBtn, volumeOffIcon);
    }
  }

  toggleMute(): void {
    if (this.player_media.muted) {
      this.volumeInput.value = this.player_media.volume.toString();
      this.activeVolume(this.player_media.volume);
      this.setVolumeIcon(this.player_media.volume);
      this.player_media.muted = false;
    } else {
      changeIcon(this.volumeBtn, volumeOffIcon);
      this.volumeInput.value = "0";
      this.activeVolume(0);
      this.player_media.muted = true;
    }
  }

  changeVol(volume: number): void {
    if (volume >= 0.01) {
      this.player_media.muted = false;
    }

    this.player_media.volume = volume;
    this.activeVolume(this.player_media.volume);
    this.setVolumeIcon(volume);
  }

  activeVolume(volume: number): void {
    const widthVolActiveEl: number = (volume * 100) / 1;
    this.volumeActive.style.width = `${widthVolActiveEl}%`;
  }
}

customElements.define("tf-controls-sound", ControlsSound);
export default ControlsSound;