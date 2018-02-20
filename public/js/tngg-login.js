import { LitElement, html } from '/vendor/lit-html-element/lit-element.js';

export default class TnggLogin extends LitElement {
  static get is() {
    return "tngg-login";
  }

  constructor() {
    super();
  }

  firstInit() {
    this.firstInitCalled = true;
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;

        firebase.database().ref('users/' + uid).update({
          uid: uid,
          displayName: displayName,
          email: email,
          profile_picture : photoURL
        });

        user.getIdToken().then((accessToken) => {
          this.shadowRoot.getElementById('login').style.opacity = "0";
          document.querySelector("tngg-account").displayName = displayName;
          if (photoURL) {
            document.querySelector("tngg-account").avatar = photoURL;
          } else {
            document.querySelector("tngg-account").avatar = '/images/user.png';
          }
          document.querySelector("tngg-account").reveal();
        });
      } else {
        ui.start('#firebaseui-auth-container', this.uiConfig());
        document.querySelector("tngg-account").hide();
        this.shadowRoot.getElementById('login').style.opacity = "1";
        this.shadowRoot.getElementById('login-opener').addEventListener("click", () => {
          this.querySelector('#firebaseui-auth-container').classList.toggle("show");
          this.shadowRoot.getElementById('login').classList.toggle("show");
          this.shadowRoot.getElementById('login-toggle').classList.toggle("show");
          this.shadowRoot.getElementById('login-message').classList.toggle("hide");
        });
      }
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    return html`
      ${this._styles()}
      <div id="login">
        <slot></slot>
        <div id="login-opener">
          <span id="login-message">Login</span>
          <div id="login-toggle"></div>
        </div>
      </div>
    `
  }

  _styles() {
    return html`<style>
      #login {
        position: absolute;
        right: 40px;
        top: 0;
        z-index: 5;
        opacity: 0;
        transition: opacity 225ms ease-in-out;
        cursor: pointer;
        text-align: center;
        border-radius: 0 0 50px 50px;
        background-color: #4ABDAC;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
      }

      #login.show {
        background-color: #0000;
        box-shadow: none;
      }

      #login-message {
        padding: 10px;
      }

      #login-message.hide {
        display: none;
      }

      #login-toggle {
        transition: transform 0.5s ease-in-out;
        margin-top: 5px;
        height: 2rem;
        line-height: 2rem;
        margin: auto;
      }

      #login-toggle:after {
        content: "▼";
      }

      #login-toggle.show {
        transform: rotate(180deg);
        border-radius: 50px;
        background-color: #4ABDAC;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        width: 2rem;
      }
    </style>`
  }

  uiConfig() {
    var clientId;
    if (window.location.hostname.indexOf("stage") >= 0) {
      clientId = "1051435527349-b6pp97dsgms9q6ckqm42s51gfdq3gk4d.apps.googleusercontent.com";
    } else {
      clientId = "838382712391-38utf875dfbieg6ovfem73ddhl98kr00.apps.googleusercontent.com";
    }

    return {
      signInSuccessUrl: '/',
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          authMethod: 'https://accounts.google.com',
          clientId: clientId
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
    };
  }

  renderCallback() {
    super.renderCallback();
    if (! this.firstInitCalled) this.firstInit();
  }
}

customElements.define(TnggLogin.is, TnggLogin.withProperties());
