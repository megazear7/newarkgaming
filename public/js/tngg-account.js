import { LitElement, html } from '../vendor/lit-html-element/lit-element.js';

export default class TnggAccount extends LitElement {
  static get is() {
    return "tngg-account";
  }

  static get properties() {
    return {
      avatar: {
        type: String,
        attrName: "avatar"
      },
      displayName: {
        type: String,
        attrName: "display-name"
      }
    }
  }

  constructor() {
    super();
  }

  reveal() {
    const account = this.shadowRoot.getElementById('account');
    if (account) account.style.opacity = "1";
  }

  hide() {
    const account = this.shadowRoot.getElementById('account');
    if (account) account.style.opacity = "0";
  }

  slideToggle() {
    const signOut = this.shadowRoot.getElementById('sign-out');
    if (signOut) signOut.classList.toggle("show");
  }

  signOut() {
    firebase.auth().signOut().then(() => {
      console.log('Signed Out');
    }, (error) => {
      console.error('Sign Out Error', error);
    });
  }

  render() {
    return html`
      ${this._styles()}
      <div id="account">
        <div id="display-name">${this.displayName}</div>
        <div id="sign-out" on-click=${() => this.signOut()}>Sign Out</div>
        <img id="avatar" src="${this.avatar}" on-click=${() => this.slideToggle()}>
      </div>
    `
  }

  _styles() {
    return html`<style>
      #account {
        position: absolute;
        top: 0;
        border-radius: 0 0 120px 120px;
        z-index: 5;
        text-shadow: 1px 1px 1px #111d;
        opacity: 0;
        transition: opacity 225ms ease-in-out;
        text-align: center;
        min-height: 100px;
        margin: 0;
        right: 0;
        width: 80px;
        background-color: #0000;
        box-shadow: none;
      }

      #avatar {
        margin-top: 5px;
        display: block;
        border-radius: 120px 0 0 120px;
        width: 80px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
      }

      #sign-out {
        cursor: pointer;
        height: 0;
        overflow: hidden;
        transition: height 225ms ease-in-out;
      }

      #sign-out:hover {
        text-decoration: underline;
      }

      #sign-out.show {
        height: 1.25rem;
      }

      #display-name {
        display: none;
      }

      @supports (display: grid) {
        @media (min-width: 800px) {
          #account {
            right: 20px;
            width: 120px;
            background-color: #4ABDAC;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
          }

          #avatar {
            border-radius: 120px;
            width: 120px;
          }

          #display-name {
            display: block;
          }
        }
      }
    </style>`
  }
}

customElements.define(TnggAccount.is, TnggAccount.withProperties());
