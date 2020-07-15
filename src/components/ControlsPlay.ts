import { changeIcon } from '../utils/globalUtils';
import controlsPlayStyles from '../css/components/play.scss';

import playIcon from '../icons/play.svg';
import pauseIcon from '../icons/pause.svg';
import forwardIcon from '../icons/forward.svg';
import replayIcon from '../icons/replay.svg';

const styles = document.createElement('style');
styles.type = 'text/css';
styles.appendChild(document.createTextNode(controlsPlayStyles));

const template = document.createElement('template');
template.innerHTML = `
  <div id="divPlay">
  </div>
  <button id="backward" title="Backward 10s (Arrow left)">
    ${replayIcon}
  </button>
  <button id="play" title="Play/Pause (Spacebar)">
    ${pauseIcon}
  </button>
  <button id="forward" title="Forward 10s (Arrow right)">
    ${forwardIcon}
  </button>
`;

class ControlsPlay extends HTMLElement {
  btns: any;
  video: HTMLVideoElement;
  playbox: HTMLElement;

  set media(media: HTMLVideoElement) {
    this.video = media;
    this.playbox.style.top = `calc(-${this.video.offsetHeight}px + 90px)`;
    this.playbox.style.width = `${this.video.offsetWidth}px`;
    this.playbox.style.height = `calc(${this.video.offsetHeight}px - 110px)`;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styles);
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.playbox = this.shadowRoot.querySelector('#divPlay');
    this.btns = this.shadowRoot.querySelectorAll('button');
    this.btns.forEach((element: HTMLElement) => {
      element.removeChild(element.firstChild);
    });

    this.playbox.onclick = () => this.togglePlay();
    this.btns[1].onclick = () => this.togglePlay();
    this.btns[0].onclick = () => this.moveTo(-10);
    this.btns[2].onclick = () => this.moveTo(10);
    document.addEventListener('keydown', this.keyPress.bind(this));
  }

  keyPress(event: any) {
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

  moveTo(secs: number) {
    this.video.currentTime = this.video.currentTime + secs;
  }

  togglePlay() {
    if (this.video.paused) {
      changeIcon(this.btns[1], pauseIcon);
      this.video.play();
    }
    else {
      changeIcon(this.btns[1], playIcon);
      this.video.pause();
    }
  }
}

customElements.define('tf-controls-play', ControlsPlay);
export default ControlsPlay;