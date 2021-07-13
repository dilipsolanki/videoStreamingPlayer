import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Offline, Online } from "react-detect-offline";
import { Player, Shortcut } from 'video-react';
import 'video-react/dist/video-react.css'; // import css

export default class Video extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id,
      videoData: {},
    };
    if(localStorage.getItem("currentTime") !=null){
    this.seek(localStorage.getItem("currentTime"))
    }
    // add your own shortcuts
    this.newShortcuts = [
       {
        keyCode: 32, 
        handle: (player, actions) => {
          localStorage.setItem("currentTime",player.currentTime)
        }
      },
      // Press number 1 to jump to the postion of 10%
      {
        keyCode: 49, // Number 1
        handle: (player, actions) => {
          const duration = player.duration;
          // jump to the postion of 10%
          actions.seek(duration * 0.1);
        }
      },
      // Ctrl/Cmd + Right arrow to go forward 30 seconds
      {
        keyCode: 39, // Right arrow
        ctrl: true, // Ctrl/Cmd
        handle: (player, actions) => {
          if (!player.hasStarted) {
            return;
          }
          const operation = {
            action: 'forward-30',
            source: 'shortcut'
          };
          actions.forward(30, operation); // Go forward 30 seconds
        }
      }
    ];
  }
  seek(seconds) {
    let time=parseFloat(seconds)
    return () => {
      this.player.seek(time);
    };
  }
  async componentDidMount() {
    try {
      const res = await fetch(`http://localhost:4000/video/${this.state.videoId}/data`);
      const data = await res.json();
      this.setState({ videoData: data });
    } catch (error) {
      console.log(error);
    }
  }
  
  render() {
    return (
      <div className="App-header">
        <Header />
        <Online>
        <Player  ref={player => {
            this.player = player;
          }} src={`http://localhost:4000/video/${this.state.videoId}`} type="video/mp4">
        <Shortcut clickable={false} shortcuts={this.newShortcuts} />
      </Player> 
        <Footer />
        </Online>
        <Offline> <center>No internet connection, Please check you connection!</center></Offline>
      </div>
    )
  }
}
