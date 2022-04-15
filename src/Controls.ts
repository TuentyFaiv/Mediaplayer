import { MediaTime } from "@interfaces";
import controlsStyles from "@styles/controls.scss";

import "@components/ControlsHeader";
import ControlsPlay from "@components/ControlsPlay";
import "@components/ControlsPlay";
import ControlsTimeText from "@components/ControlsTimeText";
import "@components/ControlsTimeText";
import ControlsSound from "@components/ControlsSound";
import "@components/ControlsSound";
import ControlsModes from "@components/ControlsModes";
import "@components/ControlsModes";

class Controls extends HTMLElement {
  protected controls_play: ControlsPlay;
  protected controls_timeText: ControlsTimeText;
  protected controls_sound: ControlsSound;
  protected controls_modes: ControlsModes;
  protected durationInput: HTMLInputElement;
  protected container: HTMLDivElement;
  protected buffered: number;
  protected playedEl: HTMLDivElement;
  protected bufferedEl: HTMLDivElement;
  protected player_duration: number;
  protected player_duration_text: string;
  protected player_current: number;
  protected player_current_text: string;
  //Attributes
  player_media: HTMLVideoElement;
  player_title: string;
  player_share: string;
  player_width: string;
  player_height: string;
  player_background: string;

  set media(media: HTMLVideoElement) {
    this.player_media = media;
    this.controls_sound.media = this.player_media;
    this.controls_play.media = this.player_media;
    this.controls_modes.media = this.player_media;
  }

  set duration(duration: MediaTime) {
    this.player_duration_text = duration.timeText;
    this.controls_timeText.duration = this.player_duration_text;
    this.player_duration = duration.timeNumber;
    this.durationInput.max = this.player_duration.toString();
  }

  set current(current: MediaTime) {
    this.player_current_text = current.timeText;
    this.controls_timeText.current = this.player_current_text;
    this.buffered = current.buffered;
    this.updateTime(current.timeNumber);
    this.player_current = current.timeNumber;
    this.durationInput.value = this.player_current.toString();
  }

  //Life cycle
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.player_current = 0;
  }

  static get observedAttributes(): string[] {
    return [
      "player_media",
      "player_title",
      "player_share",
      "player_width",
      "player_height",
      "player_background",
      "duration",
      "current"
    ];
  }

  attributeChangedCallback(attr, oldAttr, newAttr): void {
    this[attr] = newAttr;
  }

  protected getTemplate(): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = `
      ${this.getStyles()}
      <div class="controls" tabindex="0">
        <tf-controls-header
          player_title="${this.player_title}"
          player_share="${this.player_share}"
        ></tf-controls-header>
        <div class="controls__footer">
          <div class="controls__progress">
            <input
              id="progress"
              class="controls__progress-input"
              type="range"
              min="0"
              value="${this.player_current}"
              max="${this.player_duration}"
            />
            <div class="controls__progress-played"></div>
            <div class="controls__progress-buffered"></div>
          </div>
          <div class="controls__time-sound">
            <tf-controls-time-text></tf-controls-time-text>
            <tf-controls-sound></tf-controls-sound>
          </div>
          <tf-controls-play></tf-controls-play>
          <tf-controls-modes
            player_width="${this.player_width}"
            player_height="${this.player_height}"
            player_background="${this.player_background}"
          ></tf-controls-modes>
        </div>
      </div>
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
        ${controlsStyles}
      </style>
    `;
  }

  protected render(): void {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.container = this.shadowRoot.querySelector(".controls");
    this.durationInput = this.shadowRoot.querySelector("input#progress");
    this.controls_play = this.shadowRoot.querySelector("tf-controls-play");
    this.controls_timeText = this.shadowRoot.querySelector("tf-controls-time-text");
    this.controls_sound = this.shadowRoot.querySelector("tf-controls-sound");
    this.controls_modes = this.shadowRoot.querySelector("tf-controls-modes");

    this.playedEl = this.shadowRoot.querySelector(".controls__progress-played");
    this.bufferedEl = this.shadowRoot.querySelector(".controls__progress-buffered");

    const footer = this.shadowRoot.querySelector("div.controls__footer") as HTMLDivElement;
    this.controls_sound.footer = footer;

    this.durationInput.onchange = this.updateProgress;
    this.durationInput.oninput = this.updateProgress;

    this.container.onmousemove = () => {
      this.showControls();
    };
    this.container.onmouseenter = (event) => {
      this.showControls();
      this.hideControls(event);
    };
    this.container.onmouseover = (event) => {
      this.showControls();
      this.hideControls(event);
    };
  }

  connectedCallback(): void {
    this.render();
  }

  //Features
  protected showControls(): void {
    this.container.style.opacity = "1";
    this.container.style.cursor = "auto";
  }

  protected hideControls(event: MouseEvent): void {
    let timeout;
    const moveX = event.movementX;
    const moveY = event.movementY;

    if ((moveX === 0 && moveY === 0)) {
      timeout = setTimeout(() => {
        this.container.style.opacity = "0";
        this.container.style.cursor = "none";
      }, 4000);
    }
  }

  protected updateProgress = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    this.player_media.currentTime = value;
    this.updateTime(value);
  };

  protected updateTime(time: number): void {
    const widthPlayedEl: number = (time * 100) / this.player_duration;
    const widthBuffereddEl: number = (this.buffered * 100) / this.player_duration;

    this.playedEl.style.width = `calc(${widthPlayedEl}% + 4px)`;
    this.bufferedEl.style.width = `${widthBuffereddEl}%`;
  }
}

customElements.define("tf-player-controls", Controls);
export default Controls;