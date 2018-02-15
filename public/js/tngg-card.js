import { LitElement, html } from '/vendor/lit-html-element/lit-element.js';
import TnggExit from '/js/tngg-exit.js'

export default class TnggCard extends LitElement {
  static get is() {
    return "tngg-card";
  }

  static get properties() {
    return {
      banner: {
        type: Boolean,
        attrName: "banner"
      },
      image: {
        type: String,
        attrName: "image"
      },
      bold: {
        type: Boolean,
        attrName: "bold"
      },
      open: {
        type: Boolean,
        attrName: "open"
      },
      nonopenable: {
        type: Boolean,
        attrName: "nonopenable"
      }
    }
  }

  constructor() {
    super();
    this.needsImages = true;
  }

  render() {
    return html`
      ${this._styles()}
      <div class$="card ${this.bold ? 'bold' : ''} ${this.image ? '' : 'no-image'} ${this.nonopenable ? 'nonopenable' : 'openable'}"
           on-click=${() => this.nonopenable ? '' : this.openCard()}>
        ${this._top()}
        ${this._bottom()}
      </div>
      <div class$="open-view ${this.open ? 'open' : ''} ${this.image ? '' : 'no-image'}">
        <div class="open-wrapper">
          <tngg-exit on-click=${() => this.closeCard()}></tngg-exit>
          <div class="open-container">
            <slot name="opened">
          </div>
        </div>
      </div>
    `;
  }

  _top() {
    if (this.banner) {
      return '';
    } else {
      return html`
        <div class="card-top">
          <div class="card-header">
            <slot name="title"></slot>
          </div>
          ${this.image ? html`<img data-src$=${this.image}>` : ''}
        </div>
      `;
    }
  }

  _bottom() {
    return html`
      <div class="card-bottom">
        <slot name="message"></slot>
      </div>
    `;
  }

  renderCallback() {
    super.renderCallback();
    if (this.needsImages) {
      this._loadImages();
    }
  }

  openCard(event) {
    var card = this.shadowRoot.querySelector(".card")
    var openView = this.shadowRoot.querySelector(".open-view")
    var save = { };
    this._rect = card.getBoundingClientRect();
    this.open = true;

    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.querySelector("body").style.height = viewportHeight+"px";
    document.querySelector("body").style.overflow = "hidden";

    openView.style.display = "block";
    openView.style.position = "fixed";
    openView.style.top = this._rect.top + "px";
    openView.style.left = this._rect.left + "px";
    openView.style.width = this._rect.width + "px";
    openView.style.height = this._rect.height + "px";
    openView.style.zIndex = "100";

    setTimeout(() => {
      openView.style.width = window.innerWidth + "px";
      openView.style.height = window.innerHeight + "px";
      openView.style.left = "0";
      openView.style.top = "0";

      setTimeout(() => {
        openView.style.width = "100%";
        openView.style.height = "100%";
      }, 225);
    }, 225);
  }

  closeCard(event) {
    var openView = this.shadowRoot.querySelector(".open-view")

    document.querySelector("body").style.height = "initial";
    document.querySelector("body").style.overflow = "initial";

    openView.style.display = "block";
    openView.style.position = "fixed";
    openView.style.top = this._rect.top + "px";
    openView.style.left = this._rect.left + "px";
    openView.style.width = this._rect.width + "px";
    openView.style.height = this._rect.height + "px";
    openView.style.zIndex = "100";

    setTimeout(() => {
      openView.style.height = "0";
      this.open = false;
      setTimeout(() => {
      }, 225)
    }, 225)
  }

  _loadImages() {
    if (! this.image) return;

    var openImgLoader = new Image();
    var cardImgLoader = new Image();
    var rect = this.getBoundingClientRect();
    var extensionIndex = this.image.lastIndexOf(".");
    var openImgType = window.isMobile ? ".mobile" : ".desktop";
    var cardImgType = rect.width > 500 ? ".wide" : openImgType;
    var cardImgSrc = this.image.substring(0, extensionIndex) + cardImgType + this.image.substring(extensionIndex);
    var openImgSrc = this.image.substring(0, extensionIndex) + openImgType + this.image.substring(extensionIndex);

    openImgLoader.onload = () => {
      this.shadowRoot.querySelector(".open-view").style.background = "url("+openImgSrc+") center center / cover no-repeat fixed";
    }

    this.shadowRoot.querySelectorAll('img').forEach((img) => {
      img.src = cardImgSrc;
      img.addEventListener('load', () => {
        img.style.display = "block";
        img.style.opacity = '0.5';
      });
    });

    cardImgLoader.src = cardImgSrc;
    openImgLoader.src = openImgSrc;

    this.needsImages = false;
  }

  _styles() {
    return html`<style>
      :host {
        display: block;
      }

      .card {
        background-color: #FFF;
        border-radius: 3px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transition: box-shadow 225ms ease-in-out;
        height: 100%;
        overflow: hidden;
      }

      .card.bold {
        background-color: #FC4A14;
      }

      .card.openable {
        cursor: pointer;
      }

      .card.openable:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .card-top {
        position: relative;
        overflow: hidden;
        border-bottom: 2px solid #F78733;
        background-color: #313131;
      }

      .card-top .card-header {
        position: absolute;
        top: 0;
        z-index: 2;
        padding: 0 1rem;
      }

      .card-top img {
        width: 100%;
        opacity: 0;
        transition: opacity 225ms ease-in-out;
      }

      .card-bottom {
        padding: 0 1rem;
      }

      .card.no-image .card-header {
        background: none;
      }

      .open-view {
        height: 0;
        overflow: scroll;
        opacity: 0;
        transition: width 225ms ease-in-out, height 225ms ease-in-out, top 225ms ease-in-out, left 225ms ease-in-out, opacity 225ms ease-in-out;
      }

      .no-image.open-view {
        background-color: #FC4A14;
      }

      .open-view .open-wrapper {
        height: 100%;
        background-color: #0008;
        padding: 1rem;
        overflow: scroll;
      }

      .open-view .open-wrapper .open-container {
        max-width: 950px;
        margin: auto;
      }

      .open-view.open {
        opacity: 1;
      }
    </style>`;
  }
}

customElements.define(TnggCard.is, TnggCard.withProperties());
