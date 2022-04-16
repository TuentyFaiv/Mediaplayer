import { changeIcon } from "@utils";

import playerStyles from "@styles/main.scss";

import playIcon from "@icons/initPlay.svg";
import replayIcon from "@icons/replayVideo.svg";

import Controls from "./Controls";
import "./Controls";
import { ReadyStateMedia } from "@interfaces";

class MediaPlayer extends HTMLElement {
  private nodeCloned: Node;
  protected player_controls: Controls;
  protected player_media: HTMLVideoElement;
  protected player_actions: HTMLButtonElement;
  protected player_loading: HTMLDivElement;
  protected buffered: number;
  //Attributes
  player_src: string;
  player_poster: null | string;
  player_share: string;
  player_title: string;
  player_width: string;
  player_height: string;
  player_background: string;
  player_theater: string;

  //Life cycle
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.player_poster = null;
    this.player_title = "";
    this.player_share = "false";
    this.player_width = "100%";
    this.player_height = "auto";
    this.player_background = "#040306";
    this.player_theater = "false";
  }

  static get observedAttributes(): string[] {
    return [
      "player_src",
      "player_poster",
      "player_share",
      "player_title",
      "player_width",
      "player_height",
      "player_background",
      "player_theater"
    ];
  }

  attributeChangedCallback(attr, oldAttr, newAttr): void {
    this[attr] = newAttr;
    this.render();
  }

  protected getTemplate(): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = `
      ${this.getStyles()}
      <div class="player">
        <video class="player__video" src=${this.player_src} poster=${this.player_poster}></video>
        <tf-player-controls
          player_title="${this.player_title}"
          player_share="${this.player_share}"
          player_width="${this.player_width}"
          player_height="${this.player_height}"
          player_background="${this.player_background}"
          player_theater="${this.player_theater}"
        ></tf-player-controls>
        <div class="player__start">
          <button class="player__start-button" title="Play or Replay (Spacebar)">
            ${playIcon}
          </button>
        </div>
        <div class="loader">
          <div class="loader__spinner">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
    `;

    return template;
  }

  protected getStyles(): string {
    return `
      <style type="text/css">
        :host {
          --player-width: ${this.player_width};
          --player-height: ${this.player_height};
          --player-background: ${this.player_background};
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        ${playerStyles}
      </style>
    `;
  }

  protected render(): void {
    this.shadowRoot.innerHTML = "";
    this.nodeCloned = this.getTemplate().content.cloneNode(true);
    this.shadowRoot.appendChild(this.nodeCloned);

    this.player_media = this.shadowRoot.querySelector("video.player__video");
    this.player_controls = this.shadowRoot.querySelector("tf-player-controls");
    this.player_actions = this.shadowRoot.querySelector("button.player__start-button");
    this.player_loading = this.shadowRoot.querySelector("div.loader");

    this.player_controls.media = this.player_media;

    this.player_actions.removeChild(this.player_actions.firstChild);

    this.player_actions.onclick = () => this.initialPlay();

    this.player_media.onloadedmetadata = this.loadedMetaData;
    this.player_media.ontimeupdate = () => this.timeUpdate();
    this.player_media.onprogress = () => this.timeUpdate();
    this.player_media.onseeking = () => this.seeking();
    this.player_media.onseeked = () => this.seeked();
    this.player_media.onended = () => this.ended();
    document.addEventListener("keydown", this.keyPress.bind(this));
  }

  connectedCallback(): void {
    this.render();
  }

  //Features
  protected keyPress(event): void {
    switch (event.keyCode) {
      case 32:
        if (this.player_media.ended) {
          this.ended();
        } else if (this.player_media.currentTime === 0) {
          this.initialPlay();
        }
        break;
      default:
        break;
    }
  }

  protected initialPlay(): void {
    this.player_media.currentTime = 0;
    this.player_media.play();
    this.player_actions.parentElement.classList.add("player__start-button--hide");
  }

  protected formatTime(seconds: string): string {
    const secondsInt = parseInt(seconds, 10);
    const secondsFloat = parseFloat(seconds).toFixed(2);

    const minutes = (secondsInt / 60).toString();
    const minutesInt = parseInt(minutes, 10).toString();
    const secondsTotal = (parseInt(secondsFloat) % 60).toString();

    return `${minutesInt.padStart(2, "0")}:${secondsTotal.padStart(2, "0")}`;
  }

  protected loadedMetaData = (event): void => {
    const video: HTMLVideoElement = event.target;
    const formatedDuration = this.formatTime(video.duration.toString());

    this.player_controls.duration = {
      timeNumber: video.duration,
      timeText: formatedDuration
    };
  };

  protected timeUpdate = (): void => {
    const video = this.player_media;
    const formatedCurrentTime = this.formatTime(video.currentTime.toString());

    if (
      video.readyState === ReadyStateMedia.HAVE_ENOUGH_DATA
      && video.buffered.length > 0
    ) {
      this.buffered = video.buffered.end(video.buffered.length - 1);
    }

    this.player_controls.current = {
      timeNumber: video.currentTime,
      timeText: formatedCurrentTime,
      buffered: this.buffered
    };
  };

  protected seeking(): void {
    this.player_loading.style.display = "grid";
  }

  protected seeked(): void {
    this.player_loading.style.display = "none";
  }

  protected ended(): void {
    this.player_actions.parentElement.classList.remove("player__start-button--hide");
    changeIcon(this.player_actions, replayIcon);
  }
}

customElements.define("tf-player", MediaPlayer);