class MyPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            picture: null
        }
        this.textreference = React.createRef();
    }
    
    render() {
        return (
            <div>
                <div className="principal">
                    <h1>Your total:</h1>
                    <p>{window.localStorage.getItem("price")}&euro;</p>
                </div>

                <div className="upload-btn-wrapper">
                    <button className="btn">Scan your face to pay</button>
                    <input type="file" name="photo" onChange={this.previewPic.bind(this)} />
                </div>

                <div className="image-load">
                    <img src={this.state.picture} width="500" height="400" />
                </div>

                <input id="button" type="button" value="Confirm" onClick={this.checkOut.bind(this)} />
            </div>
        )
    }

    previewPic(e) {
        this.setState({
            picture: URL.createObjectURL(e.target.files[0])
        })
    }

    checkOut(e) {
        
    }
}

ReactDOM.render(<MyPage text="" />, reacthere)