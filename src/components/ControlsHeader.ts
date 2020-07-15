import controlsHeaderStyles from '../css/components/header.scss';

import shareIcon from '../icons/share.svg';

const styles = document.createElement('style');
styles.type = 'text/css';
styles.appendChild(document.createTextNode(controlsHeaderStyles));

const template = document.createElement('template');
template.innerHTML = `
  <h1 id="videoTitle"></h1>
  <div class="player_controls-settings">
    <button id="share" title="Share">
      ${shareIcon}  
    </button>
    <span id="actionAlert">
    </span>
  </div>
`;

class ControlsHeader extends HTMLElement {
  mediaTitle: HTMLElement;
  btns: HTMLButtonElement;
  titleText: string;
  actionAlert: HTMLElement;
  iconsShare: any;

  set title(title: string) {
    this.titleText = title;
    this.mediaTitle.innerText = this.titleText;
  }

  set share(share: string) {
    if (share === 'false') {
      this.btns.style.display = 'none';
    } else {
      this.btns.style.display = 'block';
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styles);
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.mediaTitle = this.shadowRoot.getElementById('videoTitle');
    this.actionAlert = this.shadowRoot.getElementById('actionAlert');

    this.btns = this.shadowRoot.querySelector('button');
    this.btns.removeChild(this.btns.firstChild);

    this.btns.onmouseover = () => {
      this.shareVideo()
    };
    this.btns.onfocus = () => {
      this.btns.parentElement.focus();
      this.shareVideo();
    }
  }

  showActionAlert(msg: string) {
    this.actionAlert.innerHTML = msg;
  }

  hideActionAlert(time: number) {
    setTimeout(() => {
      this.actionAlert.innerHTML = '';
    }, time);
  }

  shareVideo() {
    if (this.actionAlert.style.display === 'flex') {
      this.actionAlert.onmouseleave = () => {
        this.hideActionAlert(0);
      };
    }
    const url = document.location.href;
    if (navigator.share !== undefined) {
      navigator.share({
        title: this.titleText,
        text: '',
        url,
      })
        .catch(error => {
          this.showActionAlert('Error al compartir');
          this.hideActionAlert(3000);
        });
    } else {
      const copyLink = () => {
        navigator.clipboard.writeText(url).then(() => {
          this.showActionAlert(`Enlace copiado: ${url}`);
          this.hideActionAlert(1800);
        }, () => {
          this.showActionAlert('Error al compartir');
          this.hideActionAlert(1800);
        });
      }
      this.showActionAlert(`
        <div tabindex="0" title="Share by Twitter">
          <a
            class="iconShare"
            href="https://twitter.com/intent/tweet?url=${url}&text=${this.titleText}"
            target="_blank"
            rel="noopener noreferrer"
          > 
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-twitter" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z"/>
              <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.009z" />
            </svg>
          </a>
        </div>
        <div tabindex="0" title="Share by Facebook">
          <a
            class="iconShare"
            href="https://www.facebook.com/sharer/sharer.php?u=${url}&display=popup"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-facebook" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z"/>
              <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
            </svg>
          </a>
        </div>
        <div tabindex="0" title="Copy link">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-copy" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        </div>
      `);
      this.iconsShare = this.shadowRoot.querySelectorAll('.icon');
      this.iconsShare[0].onclick = () => {
        this.hideActionAlert(3000);
      };
      this.iconsShare[1].onclick = () => {
        this.hideActionAlert(3000);
      };
      this.iconsShare[2].onclick = () => copyLink();
    }
  }
}

customElements.define('tf-controls-header', ControlsHeader);
export default ControlsHeader;