import { LitElement, html } from '../vendor/lit-html-element/lit-element.js';

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
    this.sAll = (selector) => { return this.shadowRoot.querySelectorAll(selector) };
    this.content = [];

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        isAdmin().then(() => {
          this.s(".create-post").style.opacity = "1";
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
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.querySelector("body").style.height = viewportHeight+"px";
    document.querySelector("body").style.overflow = "hidden";
  }

  closePopup() {
    this.s(".popup-container").classList.remove("open");
    document.querySelector("body").style.height = "initial";
    document.querySelector("body").style.overflow = "initial";
  }

  render() {
    return html`
      ${this._styles()}
      <button class="create-post" on-click=${(e) => this.openPopup()}>Post New Article</button>
      <div class="popup-container">
        <div class="centered">
          <tngg-exit on-click=${() => this.closePopup()}></tngg-exit>
          <input placeholder="Enter a title" name="title" on-change=${(e) => this.titleChanged()} />
          <textarea placeholder="Enter a description"
                    name="description"
                    on-change=${(e) => this.descriptionChanged()}
                    on-keydown=${(e) => this.autosize()}}></textarea>
          <div class="content">
            ${this.content.map((item) => { if (item.type === "header") { return html`
                <div class="content-item header">
                  <input placeholder="Enter a Header"} />
                  <div class="remove" on-click=${(e) => this.removeItem(e.target)}>&#10005;</div>
                </div>
              `} else { return html`
                <div class="content-item">
                  <textarea placeholder="Enter a paragraph"
                            on-keydown=${(e) => this.autosize()}}></textarea>
                  <div class="remove" on-click=${(e) => this.removeItem(e.target)}>&#10005;</div>
                </div>
              `}
            })}
          </div>
          <button class="add-header" on-click=${(e) => this.addHeader()}>Add Header</button>
          <button class="add-paragraph" on-click=${(e) => this.addParagraph()}>Add Paragraph</button>
          <select name="image" on-change=${(e) => this.imageChanged()}>
            <option>Choose Image</option>
            <option value="/images/gaming/playing1.jpg">Playing 1</option>
            <option value="/images/gaming/deception-cover.jpg">Deception Cover</option>
            <option value="/images/gaming/meeples4.jpg">Meeples 4</option>
            <option value="/images/gaming/stack1.jpg">Stack 1</option>
            <option value="/images/gaming/viticulture-board.jpg">Viticulture Board</option>
          </select>
          <img src="${this.image}">
          <button class="submit-post" on-click=${(e) => this.submitPost()}>Submit Article</button>
        </div>
      </div>
    `
  }

  removeItem(target) {
    target.parentNode.remove();
  }

  addHeader() {
    this.content.push({type: "header", text: "example a"});
    this.buildContent();
    this.invalidate();
  }

  addParagraph() {
    this.content.push({type: "paragraph", text: "example b"});
    this.buildContent();
    this.invalidate();
  }

  autosize() {
    setTimeout(() => {
      this.sAll('textarea').forEach((textarea) => {
        textarea.style.cssText = 'height:auto; padding:0';
        textarea.style.cssText = 'height:' + (textarea.scrollHeight + 10) + 'px';
      });
    }, 0);
  }

  buildContent() {
    var content = [];

    this.sAll(".content > .content-item").forEach((item) => {
      if (item.classList.contains("header")) {
        content.push({
          type: "header",
          text: item.querySelector("input").value
        })
      } else {
        content.push({
          type: "paragraph",
          text: item.querySelector("textarea").value
        })
      }
    });

    return content;
  }

  submitPost() {
    if (this.title && this.description && this.image) {
      this.db.ref("/posts").push().set({
        title: this.title,
        description: this.description,
        content: this.buildContent(),
        image: this.image,
        author: firebase.auth().currentUser.uid,
        publishDate: Date.now()
      });
      this.closePopup();
    } else {
      alert("Title, description and image are required fields.")
    }
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
        overflow-y: scroll;
        overflow-x: hidden;
        top: 0;
        left: 0;
        height: 0;
        width: 100%;
        transition: height 225ms ease-in-out;
        background-color: #fff;
        z-index: 6;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        border-radius: 0 0 5px 5px;
      }

      .content {
        color: #313131;
      }

      img {
        width: 100%;
        background-color: grey;
      }

      img:not([src]) {
        height: 300px;
      }

      @media (min-width: 800px) {
        img {
          height: 300px;
          width: auto;
        }

        img:not([src]) {
          width: 300px;
        }
      }

      tngg-exit {
        color: black;
      }

      .popup-container.open {
        height: 100%;
      }

      .centered {
        box-sizing: border-box;
        padding: 20px;
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
        font-size: 1.75rem;
      }

      .header input {
        font-size: 1.25rem;
      }

      textarea, input, select, button {
        display: block;
        margin: 0 0 30px 0;
        color: #313131;
      }

      input {
        color: #313131;
      }

      .popup-container button {
        padding: 10px;
        font-size: 0.75rem;
        background-color: #0000;
        border-radius: 3px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transition: box-shadow 225ms ease-in-out;
      }

      .popup-container button:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .popup-container button:focus {
        outline: none;
      }

      select {
        font-size: 0.75rem;
        color: #555;
      }

      textarea, input:focus, select:focus {
        outline: none;
      }

      textarea, input {
        background-color: #fff;
        border: none;
        width: 100%;
        transition: border 225ms ease-in-out;
      }

      textarea {
        font-size: 1rem;
        resize: none;
        box-sizing: border-box;
        color: #555;
      }

      .popup-container .submit-post {
        background-color: #4ABDAC;
        color: #fff;
      }

      .content-item {
        position: relative;
      }

      .content-item .remove {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        transition: transform 0.5s ease-in-out;
        color: #444;
      }

      .content-item .remove:hover {
        transform: rotate(360deg);
        color: #f63;
      }
    </style>`
  }
}

customElements.define(TnggPost.is, TnggPost.withProperties());
