import textTimeStyles from '../css/components/textTime.scss';

const styles = document.createElement('style');
styles.type = 'text/css';
styles.appendChild(document.createTextNode(textTimeStyles));

const template = document.createElement('template');
template.innerHTML = `
  <span id="currentTime">00:00</span>
  <span>/</span>
  <span id="totalTime">00:00</span>
`;

class ControlsTimeText extends HTMLElement {
  duration: number;
  durationSpan: HTMLElement;
  current: number;
  currentSpan: HTMLElement;

  set time(time: any) {
    this.duration = time.duration;
    this.durationSpan.innerHTML = time.durationText;
  }

  set currentTime(current: any) {
    this.current = current.current;
    this.currentSpan.innerHTML = current.currentText;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styles.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.durationSpan = this.shadowRoot.getElementById('totalTime');
    this.currentSpan = this.shadowRoot.getElementById('currentTime');
  }
}

customElements.define('tf-controls-text-time', ControlsTimeText);
export default ControlsTimeText;