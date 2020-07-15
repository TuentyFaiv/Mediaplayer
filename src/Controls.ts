import ControlsHeader from './components/ControlsHeader';
import ControlsTimeText from './components/TextTime';
import ControlsSound from './components/ControlsSound';
import ControlsPlay from './components/ControlsPlay';
import ControlsModes from './components/ControlsModes';
import controlsStyles from './css/controls.scss';

import './components/ControlsHeader';
import './components/ControlsPlay';
import './components/TextTime';
import './components/ControlsSound';
import './components/ControlsModes';

const styles = document.createElement('style');
styles.type = 'text/css';
styles.appendChild(document.createTextNode(controlsStyles));

const template = document.createElement('template');
template.innerHTML = `
  <div class="player_controls" tabindex="0">
    <tf-controls-header></tf-controls-header>
    <div class="player_controls-footer">
      <div class="player_controls-time">
        <input
          id="timeInput"
          class="player_controls-inputTime"
          type="range"
          min="0"
          value="0"
        />
        <div class="player_played">
        </div>
        <div class="player_buffered">
        </div>
      </div>
      <div class="player_controls-timeAndSound">
        <tf-controls-text-time></tf-controls-text-time>
        <tf-controls-sound></tf-controls-sound>
      </div>
      <tf-controls-play></tf-controls-play>
      <tf-controls-modes></tf-controls-modes>
    </div>
  </div>
`;

class Controls extends HTMLElement {
  header: ControlsHeader;
  durationInput: any;
  textTime: ControlsTimeText;
  sound: ControlsSound;
  play: ControlsPlay;
  modes: ControlsModes;
  video: HTMLVideoElement;
  container: HTMLElement;
  played: number;
  buffered: number;
  playedEl: HTMLElement;
  bufferedEl: HTMLElement;
  duration: number;

  set title(title: string) {
    this.header.title = title;
  }

  set time(time: any) {
    this.duration = time.duration;
    this.textTime.time = time;
    this.durationInput.max = this.duration;
  }

  set currentTime(current: any) {
    this.textTime.currentTime = current;
    if (this.video.buffered.length === 0) {
      this.buffered = this.video.buffered.end(0);
    } else {
      this.buffered = this.video.buffered.end(this.video.buffered.length - 1);
    }
    this.updateTime(current.current);
    this.durationInput.value = current.current;
  }

  set media(media: any) {
    this.video = media;
    this.sound.media = this.video;
    this.play.media = this.video;
    this.modes.media = this.video;
  }

  set share(share: any) {
    this.header.share = share;
  }

  set styles(styles: any) {
    this.modes.styles = styles;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styles.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot.querySelector('.player_controls');
    this.header = this.shadowRoot.querySelector('tf-controls-header');
    this.durationInput = this.shadowRoot.getElementById('timeInput');
    this.textTime = this.shadowRoot.querySelector('tf-controls-text-time');
    this.sound = this.shadowRoot.querySelector('tf-controls-sound');
    this.play = this.shadowRoot.querySelector('tf-controls-play');
    this.modes = this.shadowRoot.querySelector('tf-controls-modes');

    this.playedEl = this.shadowRoot.querySelector('.player_played');
    this.bufferedEl = this.shadowRoot.querySelector('.player_buffered');

    this.durationInput.onchange = (event: any) => this.updateProgress(event);
    this.durationInput.oninput = (event: any) => this.updateProgress(event);

    this.container.onmousemove = () => {
      this.showControls();
    }
    this.container.onmouseenter = (event) => {
      this.showControls();
      this.hideControls(event);
    }
    this.container.onmouseover = (event) => {
      this.showControls();
      this.hideControls(event);
    }
  }

  showControls() {
    this.container.style.opacity = '1';
    this.container.style.cursor = 'pointer';
  }

  hideControls(event: any) {
    let timeout;
    const moveX = event.movementX;
    const moveY = event.movementY;
    if ((moveX === 0 && moveY === 0)) {
      timeout = setTimeout(() => {
        this.container.style.opacity = '0';
        this.container.style.cursor = 'none';
      }, 4000);
    }
  }

  updateProgress(event: any) {
    this.video.currentTime = event.target.value;
    this.updateTime(event.target.value);

    this.buffered = this.video.buffered.end(this.video.buffered.length - 1);
  }

  updateTime(time: number) {
    const widthPlayedEl: number = (time * 100) / this.duration;
    const widthBuffereddEl: number = (this.buffered * 100) / this.duration;

    this.playedEl.style.width = `calc(${widthPlayedEl}% + 4px)`;
    this.bufferedEl.style.width = `${widthBuffereddEl}%`;
  }
}

customElements.define('tf-player-controls', Controls);
export default Controls;