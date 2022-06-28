class MyPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { username: "", password: "" }
        this.changeText = this.changeText.bind(this);
        this.textreference = React.createRef();
    }

    render() {
        return (
            <div className="wrapper">
                <div className="login">
                    <p className="title">Log in</p>
                    <input value={this.state.username} name="username" id="username" type="text" placeholder="Username" onChange={this.changeText} />
                    <i className="fa fa-user"></i>
                    <input value={this.state.password} name="password" id="password" type="password" placeholder="Password" onChange={this.changeText} />
                    <i className="fa fa-key"></i>
                    <input id="button" type="button" value="Login" onClick={this.login.bind(this)} />
                </div>
            </div>
        )
    }

    changeText(e) {
        e.preventDefault();
        const target = e.target;
        this.setState({ [target.name]: target.value });
    }

    login() {
        // POST to login!
        fetch("/ProjetoES/orders/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
        }).then(async (response) => {
            // status 404 or 500 will set ok to false
            if (response.ok) {
                // Success: convert data received & run callback
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })).then(res => {
                    if (res.data.msg == "Success") {
                        window.localStorage.setItem("username", this.state.username);
                        window.sessionStorage.setItem("token", res.data.token)
                        window.location.replace("/ProjetoES/orders/") // GET
                    } else if (res.data.msg == "Error") {
                        alert("Incorrect Credentials! Try Again...")
                    }
                });
            }
            else {
                throw new Error(response.status + " Failed Fetch ");
            }
        }).catch(e => console.error('EXCEPTION: ', e))

    }

}

ReactDOM.render(<MyPage />, reacthere)
