class MyPage extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="center">
				<div className="botoes">
					<h1>Welcome to ES 2021/22</h1>
					<input id="button" type="button" value="Customer" onClick={this.IamCustomer.bind(this)} />
					<input id="button" type="button" value="Staff" onClick={this.IamKitchenStaff.bind(this)} />
				</div>
			</div>
		)
	}

	IamCustomer() {
		window.location.replace("/clientES/") // GET
	}

	IamKitchenStaff() {
		window.location.replace("/ProjetoES/") // GET
	}

}

ReactDOM.render(<MyPage />, reacthere)
