import React, {Component} from 'react';
const styles = {position: 'relative'};

export default class Rotation extends Component {
  state = {current: 0};

  constructor(props) {
    super(props);
    this.handleWheel = ::this.handleWheel;
    this.handleTouchStart = ::this.handleTouchStart;
    this.handleTouchMove = ::this.handleTouchMove;
    this.handleTouchEnd = ::this.handleTouchEnd;
  }

  componentDidMount() {
    const el = React.findDOMNode(this.refs.container);
    el.addEventListener('wheel', this.handleWheel, false);
    el.addEventListener('touchstart', this.handleTouchStart, false);
    el.addEventListener('touchmove', this.handleTouchMove, false);
    el.addEventListener('touchend', this.handleTouchEnd, false);
    el.addEventListener('mousedown', this.handleTouchStart, false);
    el.addEventListener('mousemove', this.handleTouchMove, false);
    document.addEventListener('mouseup', this.handleTouchEnd, false);
  }

  componentWillUnmount() {
    const el = React.findDOMNode(this.refs.container);
    el.removeEventListener('wheel', this.handleWheel, false);
    el.removeEventListener('touchstart', this.handleTouchStart, false);
    el.removeEventListener('touchmove', this.handleTouchMove, false);
    el.removeEventListener('touchend', this.handleTouchEnd, false);
    el.removeEventListener('mousedown', this.handleTouchStart, false);
    el.removeEventListener('mousemove', this.handleTouchMove, false);
    document.removeEventListener('mouseup', this.handleTouchEnd, false);
  }

  handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY === 0 ? 0 : e.deltaY / Math.abs(e.deltaY);
    this.setCurrent(this.state.current + delta);
  }

  handleTouchStart(e) {
    e.preventDefault();
    this.pointerPosition = this.calculatePointerPosition(e);
    this.startFrame = this.state.current;
  }

  handleTouchMove(e) {
    e.preventDefault();
    if (typeof this.pointerPosition !== 'number') return;
    const el = React.findDOMNode(this.refs.container);
    const pointer = this.calculatePointerPosition(e);
    const max = this.props.vertical ? el.offsetHeight : el.offsetWidth;
    const offset = pointer - this.pointerPosition;
    const delta = Math.floor(offset / max * this.props.data.length);
    this.setCurrent(this.startFrame + delta);
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.pointerPosition = null;
    this.startFrame = null;
  }

  calculatePointerPosition(e) {
    e = e.type.indexOf('touch') === 0 ? e.changedTouches[0] : e;
    const el = React.findDOMNode(this.refs.container);
    const pos = this.props.vertical ?
      e.clientY - el.offsetTop :
      e.clientX - el.offsetLeft;
    return pos;
  }

  setCurrent(n) {
    const len = this.props.data.length;
    if (n < 0) n = this.props.cycle ? n + len : 0;
    if (n > len - 1) n = this.props.cycle ? n - len : len - 1;
    if (n !== this.state.current) this.setState({current: n});
  }

  render() {
    return (
      <div ref='container' style={styles}>
        {this.props.data.map((src, i) => {
          const display = this.state.current === i ? 'block' : 'none';
          const imgStyles = {display, width: '100%'};
          return <img src={src} alt='' key={i} style={imgStyles} />;
        })}
      </div>
    );
  }
}
