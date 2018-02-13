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
  }

  render() {
    return html``
  }

  buildContent() {
    return [
      "Example A",
      "Another Example BBB"
    ];
  }

  submitPost() {
    this.db.ref("/posts/"+index).set({
      title: this.title,
      description: this.description,
      content: this.buildContent(),
      image: this.image,
      author: firebase.auth().currentUser.uid,
      publishDate: Date()
    });
  }
}

customElements.define(TnggPost.is, TnggPost.withProperties());
