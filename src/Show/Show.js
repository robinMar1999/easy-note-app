import React, { Component } from "react";
import classes from "./Show.css";
import Topics from "./Topics/Topics";
import Cards from "./Cards/Cards";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import TopicActions from "./TopicActions/TopicActions";
import axios from "axios";
import isEqual from "lodash.isequal";
import { animateScroll as scroll } from "react-scroll";

class Show extends Component {
  state = {
    id: null,
    topicContent: null,
    loading: true,
    error: false,
    msg: null,
    visibility: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (state.id !== props.id) {
      return {
        id: props.id,
        loading: true,
        error: false,
        msg: null,
      };
    } else {
      return state;
    }
  }

  updateState = () => {
    if (this.state.error) {
      return;
    }
    let url = "/topic";
    if (this.props.id) {
      url = url + "/" + this.props.id;
    }
    axios({
      url: url,
      method: "get",
      headers: {
        Authorization: this.props.token,
      },
    })
      .then((response) => {
        if (!isEqual(response.data, this.state.topicContent)) {
          this.setState({
            topicContent: response.data,
            loading: false,
            error: false,
            msg: null,
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errors) {
          this.setState({
            topicContent: null,
            loading: false,
            error: true,
            msg: err.response.data.errors[0].msg,
          });
        } else {
          this.setState({
            topicContent: null,
            loading: false,
            error: true,
            msg:
              err.message === "Network Error" ? "Server Is Down" : err.message,
          });
        }
      });
    window.MathJax.typeset();
  };

  toggleVisibility = () => {
    if (window.scrollY > 0 && !this.state.visibility) {
      this.setState({
        visibility: true,
      });
    } else if (window.scrollY === 0) {
      this.setState({
        visibility: false,
      });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.toggleVisibility);
  }

  componentDidMount() {
    this.updateState();
    window.addEventListener("scroll", this.toggleVisibility);
  }
  componentDidUpdate() {
    this.updateState();
  }
  setCrumbs = () => {
    let crumbs = [
      {
        id: null,
        url: "/",
        title: "Topics",
      },
    ];
    if (this.state.topicContent && this.state.topicContent.topic) {
      this.state.topicContent.topic.parents.forEach((parent) => {
        crumbs.push({
          id: parent.parent,
          url: `/${parent.parent}`,
          title: parent.title,
        });
      });
    }
    return crumbs;
  };
  setTopics = () => {
    let topics = [];
    if (this.state.topicContent && this.state.topicContent.topics) {
      this.state.topicContent.topics.forEach((topic) => {
        topics.push({
          id: topic._id,
          title: topic.title,
        });
      });
    }
    return topics;
  };
  setCards = () => {
    let cards = [];
    if (this.state.topicContent && this.state.topicContent.cards) {
      this.state.topicContent.cards.forEach((card) => {
        cards.push({
          id: card._id,
          text: card.sanitizedText,
          viewText: card.text,
        });
      });
    }
    return cards;
  };

  getDuration = () => {
    return Math.floor(Math.floor(window.scrollY) * 0.4);
  };

  scrollToTop = () => {
    scroll.scrollToTop({
      duration: this.getDuration(),
      delay: 100,
      smooth: true,
    });
  };
  render() {
    // console.log("[Show.js] rendering...");
    let crumbs = this.setCrumbs();
    let topics = this.setTopics();
    let cards = this.setCards();
    return this.state.loading ? (
      <div className={classes.Loading}>
        <div className={classes.ldsRing}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    ) : this.state.error ? (
      <div className={classes.Error}>
        <h1>{this.state.msg}</h1>
      </div>
    ) : (
      <div className={classes.Show}>
        <Breadcrumb crumbs={crumbs} />
        {this.props.id &&
        this.state.topicContent &&
        this.state.topicContent.topic ? (
          <TopicActions
            id={this.props.id}
            del={crumbs[crumbs.length - 2].id}
            token={this.props.token}
          />
        ) : null}
        <Topics id={this.props.id} topics={topics} />
        <Cards
          topicId={this.props.id}
          cards={cards}
          deleted={this.updateState}
          token={this.props.token}
        />
        {this.state.id && (
          <div
            className={[
              classes.Top,
              !this.state.visibility ? classes.Gray : null,
            ].join(" ")}
            onClick={this.scrollToTop}
          >
            <i className="bi bi-arrow-up-circle"></i>
          </div>
        )}
      </div>
    );
  }
}

export default Show;
