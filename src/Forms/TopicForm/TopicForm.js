import React, { Component } from "react";
import classes from "./TopicForm.css";
import Input from "../../Utils/Input/Input";
import Button from "../../Utils/Button/Button";
import Message from "../../Utils/Message/Message";
import Heading from "../../Utils/Heading/Heading";
import axios from "axios";

class TopicForm extends Component {
  state = {
    title: "",
    error: false,
    msg: null,
    loading: false,
  };

  componentDidMount() {
    if (this.props.new) {
      return;
    }
    this.setState({
      error: false,
      msg: this.props.new ? null : "Loading...",
      loading: true,
    });
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
      .then((res) => {
        this.setState({
          title: res.data.topic.title,
          error: false,
          msg: null,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          error: true,
          msg: err.response.data.errors[0].msg,
          loading: false,
        });
      });
  }

  onChangeHandler = (event) => {
    this.setState({
      title: event.target.value,
    });
  };

  onCancelHandler = () => {
    let pathname = "/";
    if (this.props.id) {
      pathname = pathname + this.props.id;
    }
    this.props.history.replace({ pathname: pathname });
  };

  onSubmitHandler = () => {
    this.setState({
      loading: true,
      error: false,
      msg: this.props.new ? "Adding..." : "Updating...",
    });
    let url = "/topic";
    if (this.props.id) {
      url = url + "/" + this.props.id;
    }
    let method;
    if (this.props.new) {
      method = "post";
    } else {
      method = "patch";
    }
    axios({
      url: url,
      method: method,
      data: {
        title: this.state.title,
      },
      headers: {
        Authorization: this.props.token,
      },
    })
      .then((res) => {
        this.setState({
          error: false,
          msg: null,
          loading: false,
        });
        let pathname = "/";
        if (this.props.id) {
          pathname = pathname + this.props.id;
        }
        this.props.history.replace({ pathname: pathname });
      })
      .catch((err) => {
        this.setState({
          error: true,
          msg: err.response.data.errors[0].msg,
          loading: false,
        });
      });
  };

  render() {
    return (
      <div className={classes.TopicForm}>
        {this.state.loading ? (
          <Message clas="Loading" msg={this.state.msg} />
        ) : null}
        {this.state.error ? (
          <Message clas="Error" msg={this.state.msg} />
        ) : null}

        <Heading heading={this.props.new ? "New Topic" : "Edit Topic"} />
        <Input
          name="title"
          type="text"
          value={this.state.title}
          changed={this.onChangeHandler}
        />
        <div className={classes.Buttons}>
          <Button
            text="cancel"
            clas={["redBg", "white", "vertical", "horizontal", "normal"]}
            clicked={this.onCancelHandler}
          />
          <Button
            text="submit"
            clas={["cadetBg", "white", "vertical", "horizontal", "normal"]}
            clicked={this.onSubmitHandler}
          />
        </div>
      </div>
    );
  }
}

export default TopicForm;
