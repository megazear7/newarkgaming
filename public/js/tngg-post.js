import { LitElement, html } from '/vendor/lit-html-element/lit-element.js';

export default class TnggPost extends LitElement {
  static get is() {
    return "tngg-post";
  }

  static get properties() {
    return {
    }
  }

  constructor() {
    super();
    this.db = firebase.database();
  }

  render() {
    return html`Hello, Tngg Post`
  }

  submitPost() {
    [{
      title: "Game Day February 10th",
      description: "We will be having another game day at 4pm on February 10th. Ready for some Good Cop Bad Cop?",
      author: "23DFKUpoqQX5zs9LpH1cCDoEdYa2",
      content: [
        "Contact Alex for the location details.",
        "There's no set list of games, but some that we plan on playing are:",
        "Photosynthesis",
        "Isle of Skye",
        "Good Cop Bad Cop",
        "Welcome to the Dungeon",
        "Viticulture",
        "We will probably play until 7 or 8 but there is no set end time. If you would like to bring games to play feel free. If you would like to suggest any games talk to Alex."],
      image: "/images/gaming/stack1.jpg",
      publishDate: "Tue Feb 07 2018 13:43:02 GMT-0500 (EST)"
    },
    {
      title: "Viticulture Played",
      description: "I've heard a lot of great things about Viticulture and got the game last December. This past week I finally got it to the table!",
      author: "23DFKUpoqQX5zs9LpH1cCDoEdYa2",
      content: [
        "Initial Impression",
        "The game looks amazing and the component quality is stunning. While the setup was simple it took a while for us to wrap our heads around how the vines create grapes, grapes are turned into wine and wine is sold to orders. However once we started to see that flow of the mechanics we really started to see how we could build up our vinyard to sell the most wine.",
        "Opinion on the Game",
        "So far I have played four games of Viticulture and am loving it. The subtle strategies and techniques in each stage of the wine making process, the different areas of focus, and the evolving experience from early, mid to late game come together for a great game. We'll see how I enjoy the game through more playthroughs, but so far this is one of my top games."],
      image: "/images/gaming/viticulture-board.jpg",
      publishDate: "Tue Feb 02 2018 13:43:02 GMT-0500 (EST)"
    },
    {
      title: "Game Day January 13th",
      description: "Our first game day was January 13th. Despite the weather we played some great games.",
      author: "23DFKUpoqQX5zs9LpH1cCDoEdYa2",
      content: [
        "Our first game day was January 13th. Despite the weather we played some great games."],
      image: "/images/gaming/playing1.jpg",
      publishDate: "Tue Jan 23 2018 13:43:02 GMT-0500 (EST)"
    },
    {
      title: "Deception Murder in Hong Kong",
      description: "A hidden identity murder mystery that isn't terrible.",
      author: "23DFKUpoqQX5zs9LpH1cCDoEdYa2",
      content: [
        "Actually, it's very good!"],
      image: "/images/gaming/deception-cover.jpg",
      publishDate: "Tue Feb 20 2018 13:43:02 GMT-0500 (EST)"
    },
    {
      title: "What is The Newark Gaming Group?",
      description: "We play board games, and I wanted to make a website, and it needed a name.",
      author: "23DFKUpoqQX5zs9LpH1cCDoEdYa2",
      content: [
        "Currently, as of this writing, we play board games the second Saturday of every month at 4pm. This may change as time goes on. You will be able to find the latest news here, along with announcements of game days and game nights.",
        "But really, I wanted to make a website and needed something simple to do. So a simple news feed about our board game days was something simple to do."],
      image: "/images/gaming/meeples4.jpg",
      publishDate: "Tue Feb 12 2018 13:43:02 GMT-0500 (EST)"
    }].forEach((post, index) => {
      this.db.ref("/posts/"+index).set({
        title: post.title,
        description: post.description,
        content: post.content,
        image: post.image,
        author: post.author,
        publishDate: post.publishDate
      });
    });
  }
}

customElements.define(TnggPost.is, TnggPost.withProperties());
