import React, { Component } from 'react';
import '../App.css';

import { connect } from 'react-redux';
import { set } from '../actions'

import Header from '../components/Header';
import Track from '../components/Track';

class Playlist extends Component {
  constructor(props) {
    super(props);
    fetch(`http://localhost:3000/api${window.location.pathname}`)
      .then(res => res.json())
      .then(res => {
        if (JSON.parse(window.localStorage.getItem('user')).username === res.admin) {
          this.setState({
            ...res,
            isAdmin: true,
          });
        } else {
          this.setState(res);
        }
      })
      .catch(e => console.error(e));
  }

  //========================================= RENDERING

  renderTracks(tracks) {
    return tracks.map((el, i) => {
      return <Track key={i} 
        img={el.image}
        title={el.name}
        artists={el.artist}
        album={el.album}
        popularity={el.popularity}/>
    })
  }

  render() {
    console.log(this.state);
    let generate = (this.state && this.state.isAdmin)
      ? (<button className="Generate">GENERATE</button>)
      : (<button className="Collaborate">COLLABORATE</button>);
    let extra = (this.state && this.state.tracks.length === 50) 
      ? (<p className="MoreSongs">{`... and ${this.state.length - this.state.tracks.length} songs more`}</p>)
      : (<p className="MoreSongs">this playlist needs a little help, why not collaborate with it?</p>)
    let tracks = this.state ? this.renderTracks(this.state.tracks) : 'waiting';
    let name = this.state ? this.state.name : 'Pending';
    let admin = this.state ? this.state.admin : 'admin';
    return (
      <div className="Wrapper">
        <Header />
        <div className="MaxWidthCreate">
          <div className="PlaylistTitleWrapper">
            <div className="PlaylistTitle">
              <h1>{name}</h1>
              <p>{'created by ' + admin}</p>
            </div>
            {generate}
          </div>
          <div className="TrackWrapper">
            {tracks}
          </div>
          {extra}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state,
})

const mapDispatchToProps = (dispatch) => ({
  set: (playlist) => dispatch(set(playlist)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
