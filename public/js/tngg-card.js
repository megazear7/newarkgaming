import { LitElement, html } from '/vendor/lit-html-element/lit-element.js';

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
          <div class="exit" on-click=${() => this.closeCard()}><div>&#10005;</div></div>
          <slot name="opened">
        </div>
      </div>
    `;
  }

  renderCallback() {
    super.renderCallback();
    this._loadImages();
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

  _loadImages() {
    this.shadowRoot.querySelectorAll('img').forEach((img) => {
      var rect = this.getBoundingClientRect();
      var extensionIndex = img.dataset.src.lastIndexOf(".");
      var imgType = window.isMobile ? ".mobile" : ".desktop";
      if (rect.width > rect.height * 1.75) imgType = ".wide";
      img.src = img.dataset.src.substring(0, extensionIndex) + imgType + img.dataset.src.substring(extensionIndex);
      img.addEventListener('load', () => {
        img.style.opacity = '0.5';
      });
    });
  }

  openBackgroundImage() {
    if (this.image) {
      var imgType = window.isMobile ? ".mobile" : ".desktop";
      var extensionIndex = this.image.lastIndexOf(".");
      return this.image.substring(0, extensionIndex) + imgType + this.image.substring(extensionIndex);
    } else {
      return "";
    }
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
        min-height: 7rem;
      }

      .card-top .card-header {
        position: relative;
        z-index: 2;
        padding: 0 1rem;
      }

      .card-top img {
        position: absolute;
        top: -1px;
        opacity: 0;
        transition: opacity 225ms ease-in-out;
        width: 101%;
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
        background: url(${this.openBackgroundImage()}) center center / cover no-repeat fixed;
        transition: width 225ms ease-in-out, height 225ms ease-in-out, top 225ms ease-in-out, left 225ms ease-in-out, opacity 225ms ease-in-out;
      }

      .no-image.open-view {
        background-color: #FC4A14;
      }

      .open-view .exit {
        font-size: 1.25rem;
        line-height: 1.25rem;
        width: 1.25rem;
        padding: 0.1rem;
        text-align: center;
        border-radius: 1.25rem;
        border: 3px solid #fff;
        cursor: pointer;
        float: right;
        transition: box-shadow 0.5s ease-in-out;
      }

      .open-view .exit:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .open-view .exit div {
        text-shadow: 0px 0px 0px #111d;
        transition: text-shadow 0.5s ease-in-out, transform 0.5s ease-in-out;
      }

      .open-view .exit div:hover {
        text-shadow: 2px 2px 2px #111d;
        transform: rotate(360deg);
      }

      .open-view .open-wrapper {
        height: 100%;
        background-color: #0008;
        padding: 1rem;
        overflow: scroll;
      }

      .open-view.open {
        opacity: 1;
      }
    </style>`;
  }
}

customElements.define(TnggCard.is, TnggCard.withProperties());
