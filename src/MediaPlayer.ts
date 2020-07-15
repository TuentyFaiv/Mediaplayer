import Controls from './Controls';
import { changeIcon } from './utils/globalUtils';
import playerStyles from './css/main.scss';

import './Controls';
import playIcon from './icons/initPlay.svg';
import replayIcon from './icons/replayVideo.svg';

const styles = document.createElement('style');
styles.type = 'text/css';
styles.appendChild(document.createTextNode(playerStyles));

const template = document.createElement('template');
template.innerHTML = `
  <div class="player_container">
    <video class="player_video">
    </video>
    <tf-player-controls></tf-player-controls>
    <div class="player_actions">
      <button title="Play or Replay (Spacebar)">
        ${playIcon}
      </button>
    </div>
    <div class="loader__container">
      <div class="loader"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
`;

class MediaPlayer extends HTMLElement {
  container: HTMLElement;
  media: HTMLVideoElement;
  controls: Controls;
  actions: HTMLElement;
  loading: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styles.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot.querySelector('.player_container');
    this.media = this.shadowRoot.querySelector('.player_video');
    this.controls = this.shadowRoot.querySelector('tf-player-controls');
    this.actions = this.shadowRoot.querySelector('.player_actions button');
    this.loading = this.shadowRoot.querySelector('.loader__container');

    this.container.style.width = this.getAttribute('w') || '100%';
    this.container.style.height = this.getAttribute('h') || '100%';

    this.media.style.background = this.getAttribute('bg') || "#040305";
    this.media.setAttribute('src', this.getAttribute('src'));

    if (this.getAttribute('poster')) {
      this.media.poster = this.getAttribute('poster') || "";
    }

    this.controls.title = this.getAttribute('titleText');
    this.controls.media = this.media;
    this.controls.share = this.getAttribute('share');
    this.controls.styles = {
      width: this.getAttribute('w') || '100%',
      height: this.getAttribute('h') || '100%',
      background: this.getAttribute('bg') || '#040305',
    };

    this.actions.removeChild(this.actions.firstChild);

    this.actions.onclick = () => this.initialPlay();

    this.media.onloadedmetadata = (event) => this.loadedMetaData(event);
    this.media.ontimeupdate = (event) => this.timeUpdate(event);
    this.media.onseeking = () => this.seeking();
    this.media.onseeked = () => this.seeked();
    this.media.onended = () => this.ended();
    document.addEventListener('keydown', this.keyPress.bind(this));
  }

  keyPress(event: any) {
    switch (event.keyCode) {
      case 32:
        if (this.media.currentTime === this.media.duration) {
          this.ended();
        } else if (this.media.currentTime === 0) {
          this.initialPlay();
        }
        break;
      default:
        break;
    }
  }

  initialPlay() {
    this.media.play();
    this.actions.parentElement.classList.add('hide');
  }

  leftPad(number: string) {
    const pad = "00";
    return pad.substring(0, pad.length - number.length) + number;
  }

  formatTime(seconds: number) {
    const minN = parseInt(seconds.toString(), 10);
    const secsT = parseFloat(seconds.toString()).toFixed(2);

    const minT = minN / 60;
    const min = parseInt(minT.toString(), 10);
    const secs = parseInt(secsT) % 60;

    return `${this.leftPad(min.toString())}:${this.leftPad(secs.toString())}`;
  }

  loadedMetaData(event: any) {
    const video = event.target;
    const formatedDuration = this.formatTime(video.duration);

    this.controls.time = {
      durationText: formatedDuration,
      duration: video.duration,
    };
  }

  timeUpdate(event: any) {
    const video: HTMLVideoElement = event.target;
    const formatedCurrentTime = this.formatTime(video.currentTime);

    this.controls.currentTime = {
      currentText: formatedCurrentTime,
      current: video.currentTime,
    };
  }

  seeking() {
    this.loading.style.display = 'grid';
  }

  seeked() {
    this.loading.style.display = 'none';
  }

  ended() {
    this.actions.parentElement.classList.remove('hide');
    changeIcon(this.actions, replayIcon);
    this.actions.onclick = () => {
      this.actions.parentElement.classList.add('hide');
      this.media.currentTime = 0;
      this.media.play();
    };
  }
}

customElements.define('tf-player', MediaPlayer);