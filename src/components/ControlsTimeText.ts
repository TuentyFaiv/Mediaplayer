import timeTextStyles from '@styles/components/textTime.scss';

class ControlsTimeText extends HTMLElement {
  currentText: HTMLSpanElement;
  durationText: HTMLSpanElement;
  //Attributes
  player_duration_text: string;
  player_current_text: string;

  set duration(duration: string) {
    this.player_duration_text = duration;
    this.durationText.innerHTML = this.player_duration_text;
  }

  set current(current: string) {
    this.player_current_text = current;
    this.currentText.innerHTML = this.player_current_text;
  }

  //Life cycle
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.player_duration_text = '00:00';
    this.player_current_text = '00:00';
  }

  static get observedAttributes(): string[] {
    return ['player_duration_text', 'player_current_text'];
  }

  attributeChangedCallback(attr, oldAttr, newAttr): void {
    this[attr] = newAttr;
  }

  getTemplate(): HTMLTemplateElement {
    const template = document.createElement('template');
    template.innerHTML = `
      ${this.getStyles()}
      <span id="currentText">${this.player_current_text}</span>
      <span>/</span>
      <span id="durationText">${this.player_duration_text}</span>
    `;

    return template;
  }

  getStyles(): string {
    return `
      <style type="text/css">
        :host {}
        ${timeTextStyles}
      </style>
    `;
  }

  render(): void {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.currentText = this.shadowRoot.querySelector('span#currentText');
    this.durationText = this.shadowRoot.querySelector('span#durationText');
  }

  connectedCallback(): void {
    this.render();
  }
}

customElements.define('tf-controls-time-text', ControlsTimeText);
export default ControlsTimeText;
