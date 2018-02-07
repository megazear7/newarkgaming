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

  get noImage() { return this._noImage; }
  set noImage(v) { this._noImage = v; this.render() }

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
        ${this.banner ? "" : this._top()}
        ${this._bottom()}
      </div>
    `, this.shadowRoot);
  }

  _top() {
    return html`
      <div class="card-top">
        <div class="card-header">
          <slot name="title">NEED TITLE</slot>
        </div>
        ${this.image ? html`<img src=${this.image}>` : ''}
      </div>
    `;
  }

  _bottom() {
    return html`
      <div class="card-bottom">
        <slot name="message">NEED MESSAGE</slot>
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
      .card {
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        margin-bottom: 0.5rem;
        height: 100%;
      }

      .card-top {
        border-radius: 2px 2px 0 0;
        position: relative;
        overflow: hidden;
        border-bottom: 2px solid #F78733;
        background-color: #FC4A14;
      }

      .card-top .card-header {
        box-sizing: border-box;
        z-index: 2;
        position: relative;
        width: 100%;
        padding: 1rem 1rem;
        font-size: 1.5rem;
        color: #fff;
        text-shadow: 3px 3px 2px #000;
        background-color: #FC4A1499;
        background-color: #7e798699;
      }

      .card-top img {
        position: absolute;
        z-index: 1;
        top: 0;
        opacity: 0;
        transition: opacity 1s;
        width: 100%;
        vertical-align: bottom;
        border-radius: 2px 0;
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
        border-radius: 0 0 2px 2px;
        text-shadow: 2px 2px 2px #111d;
      }

      @supports (display: grid) {
        @media (min-width: 600px) {
          .card-top .card-header {
            font-size: 2.25rem;
          }
        }

        @media (min-width: 800px) {
          .card {
            margin-bottom: 0;
            border-top: none;
          }

          .card-top .card-header {
            font-size: 1.75rem;
          }
        }

        @media (min-width: 1000px) {
          .card-top .card-header {
            font-size: 1.75rem;
          }
        }
      }
    </style>`;
  }
}

customElements.define(TnggCard.is, TnggCard);
