class MyPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			orders: []
		}
	}

	render() {

		if (!window.sessionStorage.token) {
			window.location.replace("/ProjetoES/");
			return (<div></div>)
		}

		var ordersView = []
		for (var i = 0; i < this.state.orders.length; i++) {
			ordersView.push(
				<tr>
					<td class="text-center">{this.state.orders[i]['ClientName']['S']}</td>
					<td class="text-center">{this.state.orders[i]['LocationTag']['S']}</td>
					<td class="text-center">{this.state.orders[i]['menu']['S']}</td>
					<td class="text-center">{this.state.orders[i]['price']['S']}</td>
					<td class="text-center">{this.state.orders[i]['statusOrder']['S']}</td>
				</tr>
			)
		}

		return (
			<div className="father">
				<div className="topnav">
					<a id="active">Orders & Status</a>
					<a id="name">Hello {window.localStorage.getItem("username")}!</a>
					<a id="logout" onClick={this.logout.bind(this)}>Log Out</a>
					<input id="button" type="button" value="Refresh" onClick={this.refreshOrders.bind(this)} />
				</div>
				<div className="orders">
					<table class="table-fill">
						<thead>
							<tr>
								<th class="text-center">Customer</th>
								<th class="text-center">Location Tag</th>
								<th class="text-center">Order</th>
								<th class="text-center">Price</th>
								<th class="text-center">Status</th>
							</tr>
						</thead>
						<tbody class="table-hover">
							{ordersView}
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	refreshOrders() {
		fetch("/ProjetoES/orders/refresh", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": window.sessionStorage.token,
				"Body": JSON.stringify({ username: window.localStorage.getItem("username") })
			}
		}).then(async (response) => {
			// status 404 or 500 will set ok to false
			if (response.ok) {
				response.json().then(data => ({
					data: data,
					status: response.status
				})).then(res => {
					if (res.data.msg == "Success") {
						this.setState({ orders: res.data.ordersList });
					} else if (res.data.msg == "Error") {
						alert(res.data.msg)
					}
				});
			}
		})
	}

	logout() {
		fetch("/ProjetoES/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": window.sessionStorage.token
			},
		}).then(async (response) => {
			// status 404 or 500 will set ok to false
			if (response.ok) {
				window.localStorage.clear();
				window.sessionStorage.clear();
				window.location.replace("/ProjetoES/") // GET
				alert("See you next time!")
			}
		})
	}
}

ReactDOM.render(<MyPage text="" />, reacthere)