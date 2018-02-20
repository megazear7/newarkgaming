import { LitElement, html } from '../vendor/lit-html-element/lit-element.js';

export default class TnggExit extends LitElement {
  static get is() {
    return "tngg-exit";
  }

  static get properties() {
    return {
    }
  }

  constructor() {
    super();
  }

  render() {
    return html`
      ${this._styles()}
      <div class="outer">
        <div class="inner">&#10005;</div>
      </div>
    `
  }

  _styles() {
    return html`<style>
      .outer {
        font-size: 1.25rem;
        line-height: 1.25rem;
        width: 1.25rem;
        padding: 0.1rem;
        margin: 0.5rem;
        text-align: center;
        border-radius: 1.25rem;
        border: 3px solid;
        border-color: inherit;
        cursor: pointer;
        float: right;
        transition: box-shadow 0.5s ease-in-out;
      }

      .outer:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .inner {
        transition: transform 0.5s ease-in-out;
      }

      .inner:hover {
        transform: rotate(360deg);
      }
    </style>`
  }
}

customElements.define(TnggExit.is, TnggExit.withProperties());
