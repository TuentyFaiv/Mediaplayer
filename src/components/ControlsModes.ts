import { changeIcon } from '../utils/globalUtils';
import modesStyles from '../css/components/modes.scss';

import fullscreenIcon from '../icons/fullscreen.svg';
import fullscreenExitIcon from '../icons/fullscreen_exit.svg';
import theaterOnIcon from '../icons/theaterOn.svg';
import theaterOffIcon from '../icons/theaterOff.svg';
import PinPIcon from '../icons/pinp.svg';

const styles = document.createElement('style');
styles.type = 'text/css';
styles.appendChild(document.createTextNode(modesStyles));

const template = document.createElement('template');
template.innerHTML = `
  <button title="Picture in picture (p)">
    ${PinPIcon}
  </button>
  <button title="Theater mode (t)">
    ${theaterOnIcon}
  </button>
  <button title="Fullscreen (f)">
    ${fullscreenIcon}
  </button>
`;

class ControlsModes extends HTMLElement {
  btns: any;
  video: any;
  teatherState: boolean;
  videoStyles: any;

  set media(media: HTMLVideoElement) {
    this.video = media;
  }

  set styles(styles: any) {
    this.videoStyles = styles;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styles.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.btns = this.shadowRoot.querySelectorAll('button');
    this.btns.forEach((element: HTMLElement) => {
      element.removeChild(element.firstChild);
    });

    if (!('pictureInPictureEnabled' in document)) {
      this.btns[0].style.display = 'none';
    }

    this.btns[0].onclick = () => this.setPinP();
    this.btns[1].onclick = () => this.toggleTeatherMode();
    this.btns[2].onclick = () => this.toggleFullScreen();

    this.teatherState = false;
    document.addEventListener('keydown', this.keyPress.bind(this));
  }

  keyPress(event: any) {
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

  setPinP() {
    if (!('pictureInPictureEnabled' in document)) {
      this.btns[0].style.display = 'none';
    } else {
      this.video.requestPictureInPicture();
    }
  }

  toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      changeIcon(this.btns[2], fullscreenIcon);
    } else {
      this.video.parentElement.requestFullscreen();
      changeIcon(this.btns[2], fullscreenExitIcon);
    }
  }

  toggleTeatherMode() {
    if (this.teatherState) {
      this.video.parentElement.style.position = 'relative';
      this.video.parentElement.style.width = this.videoStyles.width;
      this.video.parentElement.style.height = this.videoStyles.height;
      this.video.parentElement.style.top = '';
      this.video.parentElement.style.left = '';
      this.video.parentElement.style.right = '';
      this.video.style.background = this.videoStyles.background;
      changeIcon(this.btns[1], theaterOnIcon);
      this.teatherState = false;
    } else {
      this.video.parentElement.style.position = 'absolute';
      this.video.parentElement.style.width = '100%';
      this.video.parentElement.style.height = '80vh';
      this.video.parentElement.style.top = '0';
      this.video.parentElement.style.left = '0';
      this.video.parentElement.style.right = '0';
      this.video.style.background = '#040306';
      changeIcon(this.btns[1], theaterOffIcon);
      this.teatherState = true;
    }
  }
}

customElements.define('tf-controls-modes', ControlsModes);
export default ControlsModes;