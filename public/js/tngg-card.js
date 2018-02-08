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

  get open() { return this._open; }
  set open(v) { this._open = v; this.render() }

  get nonopenable() { return this._nonopenable; }
  set nonopenable(v) { this._nonopenable = v; this.render() }

  constructor() {
    super();
    this.attachShadow({mode: "open"});

    this._banner = this.getAttribute("banner") != undefined && this.getAttribute("banner") != null;
    this._image = this.getAttribute("image");
    this._bold = this.getAttribute("bold") != undefined && this.getAttribute("bold") != null;
    this._open = this.getAttribute("open") != undefined && this.getAttribute("open") != null;
    this._nonopenable = this.getAttribute("nonopenable") != undefined && this.getAttribute("nonopenable") != null;

    this.render();
    this._loadImages();
  }

  render() {
    render(html`
      ${this._styles()}
      <div class="card ${this.bold ? 'bold' : ''} ${this.image ? '' : 'no-image'} ${this.nonopenable ? 'nonopenable' : 'openable'}">
        ${this._top()}
        ${this._bottom()}
      </div>
      <div class="open-view ${this.open ? 'open' : ''}">
        <div class="open-wrapper">
          <div class="exit">X</div>
          <slot name="opened">
        </div>
      </div>
    `, this.shadowRoot);

    if (! this.nonopenable) {
      this._addEventHandlers();
    }
  }

  _addEventHandlers() {
    var card = this.shadowRoot.querySelector(".card")
    var openView = this.shadowRoot.querySelector(".open-view")
    var exit = this.shadowRoot.querySelector(".open-view .exit")
    var save = { };
    var rect;

    var cardClicked = (event) => {
      rect = card.getBoundingClientRect();
      card.removeEventListener("click", cardClicked);
      this.open = true;

      save.display = openView.style.display;
      save.position = openView.style.position;
      save.top = openView.style.top;
      save.left = openView.style.left;
      save.width = openView.style.width;
      save.height = openView.style.height;
      save.zIndex = openView.style.zIndex;

      openView.style.display = "block";
      openView.style.position = "fixed";
      openView.style.top = rect.top + "px";
      openView.style.left = rect.left + "px";
      openView.style.width = rect.width + "px";
      openView.style.height = rect.height + "px";
      openView.style.zIndex = "100";

      setTimeout(() => {
        openView.style.width = window.innerWidth + "px";
        openView.style.height = window.innerHeight + "px";
        openView.style.left = "0";
        openView.style.top = "0";

        setTimeout(() => {
          openView.style.width = "100%";
          openView.style.height = "100%";
        }, 1000);
      }, 10);
    };

    var exitClicked = (event) => {
      exit.removeEventListener("click", exitClicked);
      card.removeEventListener("click", cardClicked);
      this.open = false;

      openView.style.display = "block";
      openView.style.position = "fixed";
      openView.style.top = rect.top + "px";
      openView.style.left = rect.left + "px";
      openView.style.width = rect.width + "px";
      openView.style.height = rect.height + "px";
      openView.style.zIndex = "100";

      setTimeout(() => {
        openView.style.display = "none";
      }, 1000)
    };

    exit.addEventListener("click", exitClicked);
    card.addEventListener("click", cardClicked);
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
        transition: box-shadow 0.3s cubic-bezier(.25,.8,.25,1);
        height: 100%;
        overflow: hidden;
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

      .open-view {
        display: none;
        opacity: 0;
        background: url(${this.image}) center center / cover no-repeat fixed;
        transition: width 0.5s, height 0.5s, top 0.5s, left 0.5s, opacity 1s;
      }

      .open-view .exit {
        font-size: 35px;
        line-height: 35px;
        width: 35px;
        text-align: center;
        border-radius: 50px;
        border: 3px solid #fff;
        cursor: pointer;
        float: right;
        transition: box-shadow 0.5s, text-shadow 0.5s, transform 0.5s;
        text-shadow: none;
      }

      .open-view .exit:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transform: rotate(360deg);
        text-shadow: 2px 2px 2px #111d;
      }

      .open-view .open-wrapper {
        height: 100%;
        color: #fff;
        background-color: #7e7986bb;
        text-shadow: 2px 2px 2px #111d;
        padding: 50px;
      }

      .open-view.open {
        opacity: 1;
      }
    </style>`;
  }
}

customElements.define(TnggCard.is, TnggCard);
