import { LitElement, html } from '/vendor/lit-html-element/lit-element.js';

export default class TnggPost extends LitElement {
  static get is() {
    return "tngg-post";
  }

  static get properties() {
    return {
      title: {
        type: String,
        attrName: "title"
      },
      description: {
        type: String,
        attrName: "description"
      },
      image: {
        type: String,
        attrName: "image"
      }
    }
  }

  constructor() {
    super();
    this.db = firebase.database();
    this.s = (selector) => { return this.shadowRoot.querySelector(selector) };

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref("/users/"+user.uid).once('value', (userDataSnapshot) => {
          if (userDataSnapshot.val().permissions == "admin") {
            this.s(".create-post").style.opacity = "1";
          }
        });
      }
    });
  }

  titleChanged() {
    this.title = this.s("[name='title']").value;
  }

  descriptionChanged() {
    this.description = this.s("[name='description']").value;
  }

  imageChanged() {
    this.image = this.s("[name='image']").value;
  }

  openPopup() {
    this.s(".popup-container").classList.add("open");
  }

  closePopup() {
    this.s(".popup-container").classList.remove("open");
  }

  render() {
    return html`
      ${this._styles()}
      <button class="create-post" on-click=${(e) => this.openPopup()}>Post New Article</button>
      <div class="popup-container">
        <div class="centered">
          <tngg-exit on-click=${() => this.closePopup()}></tngg-exit>
          <input placeholder="Enter a title" name="title" on-change=${(e) => this.titleChanged()} />
          <input placeholder="Enter a description" name="description" on-change=${(e) => this.descriptionChanged()} />
          <select name="image" on-change=${(e) => this.imageChanged()}>
            <option>Choose Image</option>
            <option value="/images/gaming/playing1.jpg">Playing 1</option>
            <option value="/images/gaming/deception-cover.jpg">Deception Cover</option>
            <option value="/images/gaming/meeples4.jpg">Meeples 4</option>
            <option value="/images/gaming/stack1.jpg">Stack 1</option>
            <option value="/images/gaming/viticulture-board.jpg">Viticulture Board</option>
          </select>
          <button class="submit-post" on-click=${(e) => this.submitPost()}>Submit Article</button>
        </div>
      </div>
    `
  }

  buildContent() {
    return [
      "Example A",
      "Another Example BBB"
    ];
  }

  submitPost() {
    this.db.ref("/posts").push().set({
      title: this.title,
      description: this.description,
      content: this.buildContent(),
      image: this.image,
      author: firebase.auth().currentUser.uid,
      publishDate: Date()
    });

    this.closePopup();
  }

  _styles() {
    return html`<style>
      .create-post {
        margin: 0 auto;
        display: block;
        opacity: 0;
        padding: 50px;
        font-size: 30px;
        border-style: none;
        cursor: pointer;
        color: #313131;
        background-color: #fff;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transition: box-shadow 225ms ease-in-out;
      }

      .create-post:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .popup-container {
        position: fixed;
        top: 0;
        left: 0;
        height: 0;
        width: 100%;
        transition: height 225ms ease-in-out;
        background-color: #fff;
        overflow: hidden;
        z-index: 6;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        border-radius: 0 0 5px 5px;
      }

      tngg-exit {
        color: black;
      }

      .popup-container.open {
        height: 100%;
      }

      .centered {
        width: 100%;
        margin: auto;
      }

      @media (min-width: 800px) {
        .centered {
          width: 800px;
          margin: auto;
        }
      }

      [name="title"] {
        font-size: 30px;
      }

      [name="description"] {
        font-size: 20px;
      }

      input, select, button {
        display: block;
        margin: 20px;
        color: #313131;
      }

      button.submit-post {
        padding: 10px;
        background-color: #0000;
        border-radius: 3px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transition: box-shadow 225ms ease-in-out;
      }

      button.submit-post, select {
        margin-left: 40px;
      }

      button.submit-post:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      option {
        padding: 5px;
      }

      button.submit-post:focus {
        outline: none;
      }

      input:focus, select:focus {
        outline: none;
      }

      input {
        background-color: #fff;
        border: none;
        width: 100%;
        padding-left: 20px;
        transition: border 225ms ease-in-out;
      }
    </style>`
  }
}

customElements.define(TnggPost.is, TnggPost.withProperties());
