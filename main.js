import React from 'react';
import {render} from 'react-dom';

const sockjs_url = '/echo';
const sockjs = new SockJS(sockjs_url);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddMessage = this.handleAddMessage.bind(this);
    this.state = {messages: []};
  }

  componentDidMount() {
    sockjs.onopen = () => {console.log('join')};
    sockjs.onmessage = ({data}) => {this.setState({messages: this.state.messages.concat([data])})};
    sockjs.onclose = () => {console.log('close')};
  }

  handleAddMessage(message) {
    sockjs.send(message);
  }

  render() {
    return (
      <div>
        <MessageInput onAddMessage={this.handleAddMessage} />
        <MessageList messages={this.state.messages} />
      </div>
    );
  }
}

class MessageInput extends React.Component {
  handleAddMessage(e) {
    e.preventDefault();
    const node = this.refs.input;
    const message = node.value.trim();
    if (!message) return;
    this.props.onAddMessage(message);
    node.value = '';
  }

  render() {
    return (
      <form onSubmit={e => this.handleAddMessage(e)}>
        <input type='text' ref='input' />
        <input type='submit' value='Add' />
      </form>
    );
  }
}

class MessageList extends React.Component {
  renderMessage(message, index) {
    return (
      <Message message={message} key={index} />
    );
  }

  render() {
    return (
      <ul>{this.props.messages.map(this.renderMessage)}</ul>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <li>{this.props.message}</li>
    );
  }
}

render(<App />, document.getElementById('app'));
