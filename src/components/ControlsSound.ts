import { changeIcon } from '../utils/globalUtils';
import soundStyles from '../css/components/sound.scss';

import volumeUpIcon from '../icons/volume_up.svg';
import volumeMuteIcon from '../icons/volume_mute.svg';
import volumeDownIcon from '../icons/volume_down.svg';
import volumeOffIcon from '../icons/volume_off.svg';

const styles = document.createElement('style');
styles.type = 'text/css';
styles.appendChild(document.createTextNode(soundStyles));

const template = document.createElement('template');
template.innerHTML = `
  <div class="container" tabindex="0">
    <button id="mute" title="Mute (m)">
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

class ControlsSound extends HTMLElement {
  volumeBtn: HTMLButtonElement;
  volumeInput: any;
  volumeActive: HTMLElement;
  video: HTMLVideoElement;

  set media(media: HTMLVideoElement) {
    this.video = media;
    this.activeVolume(this.video.volume);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styles.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.volumeBtn = this.shadowRoot.querySelector('button');
    this.volumeInput = this.shadowRoot.querySelector('input');
    this.volumeActive = this.shadowRoot.querySelector('.soundInput_active');

    this.volumeBtn.removeChild(this.volumeBtn.firstChild);

    this.volumeBtn.onclick = () => this.toggleMute();
    this.volumeInput.onchange = (event: any) => this.changeVol(event.target.value);
    this.volumeInput.oninput = (event: any) => this.changeVol(event.target.value);
    document.addEventListener('keydown', this.keyPress.bind(this));
  }

  keyPress(event: any) {
    switch (event.keyCode) {
      case 77:
        this.toggleMute();
        break;
      case 38:
        const volumePlus = this.video.volume + 0.01;
        this.changeVol(volumePlus);
        break;
      case 40:
        const volume = this.video.volume - 0.01;
        this.changeVol(volume);
        break;
      default:
        break;
    }
  }

  setVolumeIcon(volume: number) {
    if (volume >= 0.5) {
      changeIcon(this.volumeBtn, volumeUpIcon);
    } else if (volume >= 0.3 && volume <= 0.5) {
      changeIcon(this.volumeBtn, volumeDownIcon);
    } else if (volume >= 0.01 && volume <= 0.3) {
      changeIcon(this.volumeBtn, volumeMuteIcon);
    } else {
      changeIcon(this.volumeBtn, volumeOffIcon);
    }
  }

  toggleMute() {
    if (this.video.muted) {
      this.volumeInput.value = this.video.volume;
      this.activeVolume(this.video.volume);
      this.setVolumeIcon(this.video.volume)
      this.video.muted = false;
    }
    else {
      changeIcon(this.volumeBtn, volumeOffIcon);
      this.volumeInput.value = 0;
      this.activeVolume(0);
      this.video.muted = true;
    }
  }

  changeVol(volume: number) {
    if (volume >= 0.01) {
      this.video.muted = false;
    }

    this.video.volume = volume;
    this.activeVolume(this.video.volume);
    this.setVolumeIcon(volume);
  }

  activeVolume(volume: number) {
    const widthVolActiveEl: number = (volume * 100) / 1;
    this.volumeActive.style.width = `${widthVolActiveEl}%`;
  }
}

customElements.define('tf-controls-sound', ControlsSound);
export default ControlsSound;