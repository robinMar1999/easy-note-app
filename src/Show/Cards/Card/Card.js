import React, { Component, Fragment } from "react";
import classes from "./Card.css";
import Button from "../../../Utils/Button/Button";
import Backdrop from "../../../Utils/Backdrop/Backdrop";
import Confirm from "../../../Utils/Confirm/Confirm";
import Modal from "../../../Utils/Modal/Modal";
import { Link } from "react-router-dom";
// import Pdf from "react-to-pdf";
import axios from "axios";

// const options = {
//   orientation: "landscape",
//   unit: "in",
//   format: "a4",
// };

class Card extends Component {
  state = {
    showMsg: false,
    error: false,
    msg: "",
    view: false,
    confirm: false,
  };
  componentDidMount() {
    this.ref = React.createRef();
  }
  deleteHandler = () => {
    axios({
      url: `/card/${this.props.cardId}`,
      method: "delete",
      headers: {
        Authorization: this.props.token,
      },
    })
      .then((res) => {
        this.props.deleted();
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          this.setState({
            error: true,
            msg: err.response.data.errors[0].msg,
          });
        } else {
          this.setState({
            error: true,
            msg: err.message,
          });
        }
      });
  };

  openConfirm = () => {
    this.setState({
      confirm: true,
    });
  };
  closeConfirm = () => {
    this.setState({
      confirm: false,
    });
  };
  closeConfirmAndDelete = () => {
    this.setState({
      confirm: false,
      error: false,
      showMsg: true,
      msg: "Deleting...",
    });
    this.deleteHandler();
  };

  openView = () => {
    this.setState({
      view: true,
    });
  };
  closeView = () => {
    this.setState({
      view: false,
    });
  };
  render() {
    return (
      <Fragment>
        {this.state.view && <Backdrop clicked={this.closeView} />}
        {this.state.view && (
          <Modal content={this.props.text} clicked={this.closeView} />
        )}
        {this.state.confirm && <Backdrop clicked={this.closeConfirm} />}
        {this.state.confirm && (
          <Confirm
            cancelled={this.closeConfirm}
            submitted={this.closeConfirmAndDelete}
          />
        )}
        {this.state.showMsg && (
          <div
            className={[
              classes.Message,
              this.state.error ? classes.Error : classes.Loading,
            ].join(" ")}
          >
            {this.state.msg}
          </div>
        )}
        <div className={classes.Frag}>
          <div
            className={classes.Card}
            dangerouslySetInnerHTML={{ __html: this.props.text }}
            ref={this.ref}
          ></div>
          <div className={classes.Buttons}>
            <Link to={`/${this.props.topicId}/card/${this.props.cardId}/edit`}>
              <Button
                text="edit"
                clas={["black", "vertical-small", "purplehover", "medium"]}
              />
            </Link>

            <Button
              text="view"
              clas={["black", "vertical-small", "greenhover", "medium"]}
              clicked={this.openView}
            />

            <Button
              text="delete"
              clas={["black", "vertical-small", "redhover", "medium"]}
              clicked={this.openConfirm}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Card;
