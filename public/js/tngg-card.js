import {html, render} from '/vendor/lit-html.js';

export default class TnggCard extends HTMLElement {
  static get is() {
    return "tngg-card";
  }

  get banner() { return this._banner; }
  set banner(v) { this._banner = v; this.render() }

  get image() { return this._image; }
  set image(v) { this._image = v; this.render() }

  get bold() { return this._bold; }
  set bold(v) { this._bold = v; this.render() }

  constructor() {
    super();
    this.attachShadow({mode: "open"});

    this._banner = this.getAttribute("banner") != undefined && this.getAttribute("banner") != null;
    this._image = this.getAttribute("image");
    this._bold = this.getAttribute("bold") != undefined && this.getAttribute("bold") != null;

    this.render();
    this._loadImages();
  }

  render() {
    render(html`
      ${this._styles()}
      <div class="card ${this.bold ? 'bold' : ''} ${this.image ? '' : 'no-image'}">
        ${this._top()}
        ${this._bottom()}
      </div>
    `, this.shadowRoot);
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
          ${this.image ? html`<img src=${this.image}>` : ''}
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
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    });
  }

  _styles() {
    return html`<style>
      :host {
        display: block;
      }

      .card {
        background-color: #fff;
        border-radius: 3px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        height: 100%;
        overflow: hidden;
      }

      .card-top {
        position: relative;
        overflow: hidden;
        border-bottom: 2px solid #F78733;
        background-color: #FC4A14;
      }

      .card-top .card-header {
        position: relative;
        z-index: 2;
        padding: 1rem;
        color: #fff;
        text-shadow: 3px 3px 2px #000;
        background-color: #7e798699;
      }

      .card-top img {
        position: absolute;
        top: 0;
        opacity: 0;
        transition: opacity 1s;
        width: 100%;
      }

      .card-bottom {
        padding: 0.75em;
      }

      .card.no-image .card-header {
        background: none;
      }

      .card.bold .card-bottom {
        color: #fff;
        background-color: #FC4A14;
        text-shadow: 2px 2px 2px #111d;
      }
    </style>`;
  }
}

customElements.define(TnggCard.is, TnggCard);
