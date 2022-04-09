import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom"

class Homepage extends Component {

    //Store the state of a component, we should make the constructor
    constructor() {
        super();
        this.state = {
            pictures: [],
            indexValue: 0,
            textInput: 'elephant'
        };
    }

    //componentDidMount is executed after the render（part of lifecycle）
    //response is what we are calling, the name we give whatever comes back
    //Return response object(JSON file)
    //Then we take the value we get, then call function(j)
    componentDidMount() {
        this.ReloadImages();
    }

    ReloadImages = () => {
        //Fetch JSON file using a REST API from Flickr
        fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + process.env.REACT_APP_API_KEY + '&tags=' + this.state.textInput + '&per_page=10&page=1&format=json&nojsoncallback=1')
            //Hide the API key for security
            .then(function (response) {
                return response.json();
            })
            .then(function (j) {
                //alert(JSON.stringify(j)); check whether j bring all the information
                let picArray = j.photos.photo.map((pic) => {
                    //Derive the source path of that photo, create the location of the picture
                    var srcPath = 'https://farm' + pic.farm + '.staticflickr.com/' + pic.server + '/' + pic.id + '_' + pic.secret + '.jpg';
                    //After parsing JSON and mapping here to build the path, then return the element that we build in this image
                    return (
                        <img alt="elephant" className="pictureClass" src={srcPath}></img>
                    )
                })
                this.setState({ pictures: picArray });//Store picArray value into the state
            }.bind(this))//Bind to the function to component
    }

    NextHandler = () => {
        var currentIndex = this.state.indexValue;
        if (currentIndex === 9) {
            //Picture number can not be 10
            currentIndex = 0;
        }
        else {
            currentIndex++;
        }
        this.setState({ indexValue: currentIndex })
    }

    PrevHandler = () => {
        var currentIndex = this.state.indexValue;
        if (currentIndex === 0) {
            //Picture number can not be negative
            currentIndex = 9;
        }
        else {
            currentIndex--;
        }
        this.setState({ indexValue: currentIndex })
    }

    //When the user change the input in the search box, call this function
    HandleChange = (e) => {
        this.setState({ textInput: e.target.value });
    }

    Delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    render() {
        return (
            <div className="App">
                <p className="App-intro">
                    <div>
                        Picture #{this.state.indexValue}
                    </div>
                    {this.state.pictures[this.state.indexValue]}
                </p>
                <p>
                    <label htmlFor='header-search'>
                        <span className='visually-hidden'>Search images</span>
                    </label>
                    <input text="text" id="header-search" placeholder="Seach images" name="s"
                        onChange={this.HandleChange}
                        onKeyUp={() => this.Delay(function () {
                            this.ReloadImages();
                        }.bind(this), 1000)}>

                    </input>
                </p>
                <div>
                    <button onClick={this.PrevHandler}>Prev</button>&nbsp;
                    <button onClick={this.NextHandler}>Next</button>
                </div>

                <div className="w-100 text-center mt-2">
                    Back to profile? <Link to="/dashboard">Back</Link>
                </div>
            </div>
        );
    }
}

export default Homepage;