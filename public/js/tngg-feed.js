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
    this.idb = idb.open('newarkgaming', 1, (upgradeDB) => {
      switch (upgradeDB.oldVersion) {
        case 0:
          upgradeDB.createObjectStore('posts', {keyPath: 'uid'}).createIndex('publishDate', 'publishDate');
      }
    });

    this.idb.then(db => {
      const tx = db.transaction('posts');
      tx.objectStore('posts').index("publishDate").iterateCursor(cursor => {
        if (!cursor) return;
        this.posts.unshift(cursor.value);
        this.invalidate();
        cursor.continue();
      });
    });

    this.loadCards();
  }

  loadCards() {
    var addPost = (postSnapshot, callback) => {
      var post = postSnapshot.val();
      post.uid = postSnapshot.key;
      if (! this.posts.map(i => i.uid).includes(post.uid)) {
        this.db.ref("/users/"+post.author).once('value', (authorSnapshot) => {
          post.author = authorSnapshot.val();
          post.published = new Date(post.publishDate);
          callback(post);
          this.invalidate();
          this.idb.then(db => {
            const tx = db.transaction('posts', 'readwrite');
            tx.objectStore('posts').put(post);
            return tx.complete;
          });
        });
      }
    }

    this.db.ref("/posts").orderByChild("publishDate").once('value', (posts) => {
      posts.forEach((postSnapshot) => {
        addPost(postSnapshot, (post) => {
          this.posts.push(post);
        });
      });

      this.db.ref("/posts").on('child_added', (postSnapshot) => {
        addPost(postSnapshot, (post) => {
          this.posts.unshift(post);
        });
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
              </div>
              <div class="clear">
                ${post.content ? this._renderContent(post.content) : ""}
              </div>
            </div>
          </tngg-card>
        `)}
      </div>
    `
  }

  _renderContent(content) {
    return content.map((i) => {
      if (i.type === "header") {
        return html`<h3>${i.text}</h3>`
      } else {
        return html`<p>${i.text}</p>`
      }
    });
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
