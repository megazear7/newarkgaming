import { LitElement, html } from '/vendor/lit-html-element/lit-element.js';
import TnngCard from "/js/tngg-card.js";

export default class TnggFeed extends LitElement {
  static get is() {
    return "tngg-feed";
  }

  static get properties() {
    return {
    }
  }

  constructor() {
    super();
    this.db = firebase.database();
    this.s = this.shadowRoot.querySelector;
    this.posts = [ ];
    this.loadCards();
  }

  loadCards() {
    this.db.ref("/posts").orderByChild("publishDate").on('child_added', (postSnapshot) => {
      var post = postSnapshot.val();
      this.db.ref("/users/"+post.author).once('value', (authorSnapshot) => {
        post.uid = postSnapshot.key;
        post.author = authorSnapshot.val();
        post.published = new Date(post.publishDate);
        this.posts.push(post)
        this.invalidate();
      });
    });
  }

  render() {
    return html`
      ${this._styles()}
      <div class="container">
        ${this.posts.map((post) => html`
          <tngg-card image="${post.image}" data-uid="${post.uid}">
            <h2 slot="title">${post.title}</h2>
            <p slot="message">${post.description}</p>
            <div slot="opened">
              <h2>${post.title}</h2>
              <div class="pull-right">
                <div>${post.author ? "By: " + post.author.displayName : ""}</div>
                <div>Published ${formatDate(post.published)}</div>
              </div>
              <div class="clear">
                ${post.content.map((i) => { if (i.type === "header") { return html`
                  <h3>${i.text}</h3>
                `} else { return html`
                  <p>${i.text}</p>
                `}})}
              </div>
            </div>
          </tngg-card>
        `)}
      </div>
    `
  }

  _styles() {
    return html`<style>
      .container {
        margin: 1rem;
      }

      tngg-card {
        margin-bottom: 1rem;
        text-shadow: 1px 1px 1px #111d;
      }

      tngg-card [slot="message"] {
        color: #48464a;
        text-shadow: none;
      }

      tngg-card h1[slot="message"] {
        color: white;
      }

      tngg-card small {
        display: block;
        font-size: 1rem;
      }

      @supports (display: grid) {
        @media (min-width: 800px) {
          .container {
            display: grid;
            grid-gap: 1rem;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;
          }

          tngg-card {
            margin-bottom: 0;
          }
        }

        @media (min-width: 1000px) {
          .container {
            display: grid;
            grid-gap: 1rem;
            max-width: 950px;
            margin: 1rem auto;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
          }

          tngg-card {
            margin-bottom: 0;
            grid-column: span 1;
          }

          tngg-post {
            width: 950px;
            display: block;
            margin: auto;
          }

          .container tngg-card:nth-of-type(4n+2) {
            grid-column: 2 / 4;
          }

          .container tngg-card:nth-of-type(4n+3) {
            grid-column: 1 / 3;
          }
        }
      }
    </style>`
  }
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

window.addEventListener('load', function() {

});
customElements.define(TnggFeed.is, TnggFeed.withProperties());
