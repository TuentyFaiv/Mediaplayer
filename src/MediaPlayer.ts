import { changeIcon } from '@utils/globalUtils';

import playerStyles from '@styles/main.scss';

import playIcon from '@icons/initPlay.svg';
import replayIcon from '@icons/replayVideo.svg';

import Controls from './Controls';
import './Controls';

class MediaPlayer extends HTMLElement {
  player_controls: Controls;
  player_media: HTMLVideoElement;
  player_actions: HTMLButtonElement;
  player_loading: HTMLDivElement;
  //Attributes
  player_src: string;
  player_poster: null | string;
  player_share: string;
  player_title: string;
  player_width: string;
  player_height: string;
  player_background: string;

  //Life cycle
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.player_poster = null;
    this.player_title = '';
    this.player_share = 'true';
    this.player_width = '100%';
    this.player_height = '540px';
    this.player_background = '#040306';
  }

  static get observedAttributes(): string[] {
    return [
      'player_src',
      'player_poster',
      'player_share',
      'player_title',
      'player_width',
      'player_height',
      'player_background'
    ];
  }

  attributeChangedCallback(attr, oldAttr, newAttr): void {
    this[attr] = newAttr;
  }

  getTemplate(): HTMLTemplateElement {
    const template = document.createElement('template');
    template.innerHTML = `
      ${this.getStyles()}
      <div class="player_container">
        <video class="player_video" src=${this.player_src} poster=${this.player_poster}></video>
        <tf-player-controls
          player_title="${this.player_title}"
          player_share="${this.player_share}"
          player_width="${this.player_width}"
          player_height="${this.player_height}"
          player_background="${this.player_background}"
        ></tf-player-controls>
        <div class="player_actions">
          <button title="Play or Replay (Spacebar)">${playIcon}</button>
        </div>
        <div class="loader__container">
          <div class="loader"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    `;

    return template;
  }

  getStyles(): string {
    return `
      <style type="text/css">
        :host {
          --player-width: ${this.player_width};
          --player-height: ${this.player_height};
          --player-background: ${this.player_background};
        }
        ${playerStyles}
      </style>
    `;
  }

  render(): void {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.player_media = this.shadowRoot.querySelector('video.player_video');
    this.player_controls = this.shadowRoot.querySelector('tf-player-controls');
    this.player_actions = this.shadowRoot.querySelector('.player_actions button');
    this.player_loading = this.shadowRoot.querySelector('.loader__container');

    this.player_controls.media = this.player_media;

    this.player_actions.removeChild(this.player_actions.firstChild);

    this.player_actions.onclick = () => this.initialPlay();

    this.player_media.onloadedmetadata = (event) => this.loadedMetaData(event);
    this.player_media.ontimeupdate = (event) => this.timeUpdate(event);
    this.player_media.onseeking = () => this.seeking();
    this.player_media.onseeked = () => this.seeked();
    this.player_media.onended = () => this.ended();
    document.addEventListener('keydown', this.keyPress.bind(this));
  }

  connectedCallback(): void {
    this.render();
  }

  //Features
  keyPress(event): void {
    switch (event.keyCode) {
      case 32:
        if (this.player_media.currentTime === this.player_media.duration) {
          this.ended();
        } else if (this.player_media.currentTime === 0) {
          this.initialPlay();
        }
        break;
      default:
        break;
    }
  }

  initialPlay(): void {
    this.player_media.play();
    this.player_actions.parentElement.classList.add('hide');
  }

  pad(number: string): string {
    const pad = "00";
    return pad.substring(0, pad.length - number.length) + number;
  }

  formatTime(seconds: number): string {
    const secondsInt = parseInt(seconds.toString(), 10);
    const secondsFloat = parseFloat(seconds.toString()).toFixed(2);
    
    const minutes = secondsInt / 60;
    const minutesInt = parseInt(minutes.toString(), 10);
    const secondsTotal = parseInt(secondsFloat) % 60;

    return `${this.pad(minutesInt.toString())}:${this.pad(secondsTotal.toString())}`;
  }

  loadedMetaData(event): void {
    const video: HTMLVideoElement = event.target;
    const formatedDuration = this.formatTime(video.duration);

    this.player_controls.duration = {
      timeNumber: video.duration,
      timeText: formatedDuration
    };
  }

  timeUpdate(event): void {
    const video: HTMLVideoElement = event.target;
    const formatedCurrentTime = this.formatTime(video.currentTime);

    this.player_controls.current = {
      timeNumber: video.currentTime,
      timeText: formatedCurrentTime
    };
  }

  seeking(): void {
    this.player_loading.style.display = 'grid';
  }

  seeked(): void {
    this.player_loading.style.display = 'none';
  }

  ended(): void {
    this.player_actions.parentElement.classList.remove('hide');
    changeIcon(this.player_actions, replayIcon);
    this.player_actions.onclick = () => {
      this.player_actions.parentElement.classList.add('hide');
      this.player_media.currentTime = 0;
      this.player_media.play();
    };
  }
}

customElements.define('tf-player', MediaPlayer);