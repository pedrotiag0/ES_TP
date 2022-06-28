class MyPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			// Info for display
			rendered: false,
			itemsOrder: [],
			itemsEntrees: [],
			itemsMainCourse: [],
			itemsDesert: [],
			itemsDrinks: [],
			modalStyle: { display: 'none' },
			receiveOrdermodal: { display: 'none' },
			// User input
			itemsTotal: 0.0,
			locationTagNumber: -1,
			price: 0.0,
			picture: null,
			filePicture: null,
			// Receive Order
			receiveFullName: "",
			receiveLocationTagNumber: -1
		}
		this.textreference = React.createRef();	// LocationTagNumber
		this.refReceiveFullName = React.createRef(); // ReceiveFullName
		this.refReceiveLocationTagNumber = React.createRef();	// ReceiveLocationTagNumber
	}

	componentDidMount() {
		var itemsMainCourse2 = []
		var itemsEntrees2 = []
		var itemsDesert2 = []
		var itemsDrinks2 = []

		fetch("/clientES/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		}).then(async (response) => {
			// status 404 or 500 will set ok to false
			if (response.ok) {
				// Success: convert data received & run callback
				response.json().then(data => ({
					data: data,
					status: response.status
				})).then(res => {

					Object.keys(res.data).forEach(function (key) {
						var obj = res.data[key];

						switch (obj[1]) {
							case "Principal":
								itemsMainCourse2.push({ name: key, price: obj[0] })
								break;
							case "Entrada":
								itemsEntrees2.push({ name: key, price: obj[0] })
								break;
							case "Sobremesa":
								itemsDesert2.push({ name: key, price: obj[0] })
								break;
							case "Bebida":
								itemsDrinks2.push({ name: key, price: obj[0] })
								break;
						}
					})
				})
			}
		})

		this.setState({ itemsEntrees: itemsEntrees2, itemsMainCourse: itemsMainCourse2, itemsDesert: itemsDesert2, itemsDrinks: itemsDrinks2 });
	}

	render() {
		var listOrder = [];
		for (var i = 0; i < this.state.itemsOrder.length; i++) {
			listOrder.push(<li key={i} id="item" className="w3-container w3-center w3-white w3-padding-12">
				<span className="w3-left">{this.state.itemsOrder[i]}</span>
				<button className="w3-right w3-button w3-white" id="remove" onClick={this.removeList.bind(this, i)}>&#10060;</button>
			</li>)
		}

		var mainCourseView = []
		var entreesView = []
		var drinksView = []
		var dessertView = []

		for (var i = 0; i < this.state.itemsMainCourse.length; i++) {
			mainCourseView.push(<li key={i} id="item" className="w3-container w3-center w3-white w3-padding-12">
				<span className="w3-left">{this.state.itemsMainCourse[i].name}</span>
				<span className="w3-center w3-tag w3-dark-grey w3-round">{this.state.itemsMainCourse[i].price}&euro;</span>
				<button className="w3-right w3-button w3-black" id="buy" onClick={this.addCart.bind(this, this.state.itemsMainCourse[i])}>+</button>
			</li>)
		}
		for (var i = 0; i < this.state.itemsEntrees.length; i++) {
			entreesView.push(<li key={i} id="item" className="w3-container w3-center w3-white w3-padding-12">
				<span className="w3-left">{this.state.itemsEntrees[i].name}</span>
				<span className="w3-center w3-tag w3-dark-grey w3-round">{this.state.itemsEntrees[i].price}&euro;</span>
				<button className="w3-right w3-button w3-black" id="buy" onClick={this.addCart.bind(this, this.state.itemsEntrees[i])}>+</button>
			</li>)
		}
		for (var i = 0; i < this.state.itemsDrinks.length; i++) {
			drinksView.push(<li key={i} id="item" className="w3-container w3-center w3-white w3-padding-12">
				<span className="w3-left">{this.state.itemsDrinks[i].name}</span>
				<span className="w3-center w3-tag w3-dark-grey w3-round">{this.state.itemsDrinks[i].price}&euro;</span>
				<button className="w3-right w3-button w3-black" id="buy" onClick={this.addCart.bind(this, this.state.itemsDrinks[i])}>+</button>
			</li>)
		}
		for (var i = 0; i < this.state.itemsDesert.length; i++) {
			dessertView.push(<li key={i} id="item" className="w3-container w3-center w3-white w3-padding-12">
				<span className="w3-left">{this.state.itemsDesert[i].name}</span>
				<span className="w3-center w3-tag w3-dark-grey w3-round">{this.state.itemsDesert[i].price}&euro;</span>
				<button className="w3-right w3-button w3-black" id="buy" onClick={this.addCart.bind(this, this.state.itemsDesert[i])}>+</button>
			</li>)
		}

		if (this.state.rendered) {
			return (
				<div>
					<div className="entradas">
						<h1>Entrees</h1>
						<div className="items">{entreesView}</div>
					</div>
					<div className="principal">
						<h1>Main Course</h1>
						<div className="items">{mainCourseView}</div>
					</div>
					<div className="sobremesas">
						<h1>Dessert</h1>
						<div className="items">{dessertView}</div>
					</div>
					<div className="bebidas">
						<h1>Drinks</h1>
						<div className="items">{drinksView}</div>
					</div>
					<div className="carrinho">
						<h1>Your Menu</h1>
						<div className="items">{listOrder}</div>
					</div>
					<div className="locationTag">
						<label>Location Tag:</label>
						<input ref={this.textreference} type="number" id="locationTag" name="locationTag" min="1" max="999" onChange={this.changeLocationTag.bind(this)} />
					</div>
					<input id="button" type="button" value="Checkout" onClick={this.checkOut.bind(this)} />
					<div id="teste">
						<button class="button-82-pushable" role="button" onClick={this.returnMainMenu.bind(this)}>
							<span class="button-82-shadow"></span>
							<span class="button-82-edge"></span>
							<span class="button-82-front text">Cancel</span>
						</button>
					</div>

					<div className="modal-content" style={this.state.modalStyle}>
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" onClick={this.closeModal.bind(this)}>&times;</button>
							<h4 className="modal-title">Finish your order!</h4>
						</div>
						<div className="modal-body">
							<p>Your total: {this.state.price}&euro;</p>

							<div className="upload-btn-wrapper">
								<button className="btn">Scan your face to pay - File</button>
								<input type="file" id='pictureId' name="photo" onChange={this.previewPic.bind(this)} />
							</div>

							<img className="image" src={this.state.picture} width="600" height="400" />

						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.processRequest.bind(this)}>Confirm</button>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="opening">
					<div className="openingchild">
						<h1>Welcome to ES Restaurant!<br /></h1>
						<input className="w3-center" id="buttonBeforeRender" type="button" value="Start Shopping!" onClick={this.renderScreen.bind(this)} /> <br />
						<input className="w3-center" id="buttonReceiveOrder" type="button" value="Receive Order!" onClick={this.receiveOrder.bind(this)} />
					</div>
					<div className="modal-content" style={this.state.receiveOrdermodal}>
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" onClick={this.closeReceiveModal.bind(this)}>&times;</button>
							<h4 className="modal-title">Receive your order!</h4>
						</div>
						<div className="modal-body">
							<label>Customer Name:</label>
							<input ref={this.refReceiveFullName} type="text" id="receiveFullName" name="receiveFullName" onChange={this.changeReceiveFullName.bind(this)} /> <br />
							<label>Location Tag:</label>
							<input ref={this.refReceiveLocationTagNumber} type="number" id="receiveLocationTag" name="receiveLocationTag" min="1" max="999" onChange={this.changeReceiveLocationTagNumber.bind(this)} />
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.receiveOrderRequest.bind(this)}>Confirm</button>
						</div>
					</div>
				</div>
			)
		}
	}

	returnMainMenu() {
		this.setState(function (state, props) {
			state.rendered = false,
				state.itemsOrder = []
			return { rendered: state.rendered, itemsOrder: state.itemsOrder }
		})
	}

	receiveOrder() {
		this.setState(() => ({ receiveOrdermodal: { display: 'inline-block' } }));
	}

	receiveOrderRequest() {
		fetch("/clientES/", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: this.state.receiveFullName, locationTagNumber: this.state.receiveLocationTagNumber }),
		}).then(async (response) => {
			// status 404 or 500 will set ok to false
			if (response.ok) {
				// Success: convert data received & run callback
				response.json().then(data => ({
					data: data,
					status: response.status
				})).then(res => {
					if (res.data.msg == "Success") {
						alert(res.data.orderStatus)
					} else if (res.data.msg == "Error") {
						alert(res.data.msg)
					}
				});
			}
			else {
				throw new Error(response.status + " Failed Fetch ");
			}
		}).catch(e => console.error('EXCEPTION: ', e))
	}

	changeLocationTag() {
		this.setState({ locationTagNumber: this.textreference.current.value })
	}

	changeReceiveFullName() {
		this.setState({ receiveFullName: this.refReceiveFullName.current.value })
	}

	changeReceiveLocationTagNumber() {
		this.setState({ receiveLocationTagNumber: this.refReceiveLocationTagNumber.current.value })
	}

	addCart(product) {
		this.setState(function (state, props) {
			state.itemsOrder.push(product.name)
			return { itemsOrder: state.itemsOrder }
		})
	}

	removeList(index) {
		this.setState(function (state, props) {
			state.itemsOrder.splice(index, 1)
			return { itemsOrder: state.itemsOrder }
		})
	}

	previewPic(e) {
		this.setState({
			picture: URL.createObjectURL(e.target.files[0])
		})
		this.setState({
			filePicture: e.target.files[0]
		})
	}

	checkOut() {
		if (this.state.itemsOrder.length == 0) {
			alert("You must order something!")
			return;
		} else if (this.state.locationTagNumber > 999 || this.state.locationTagNumber < 1) {
			alert("Invalid location tag number! Must be a number between 1 and 999.")
			return;
		}

		fetch("/clientES/checkup/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ itemsOrder: this.state.itemsOrder, locationTagNumber: this.state.locationTagNumber }),
		}).then(async (response) => {
			// status 404 or 500 will set ok to false
			if (response.ok) {
				// Success: convert data received & run callback
				response.json().then(data => ({
					data: data,
					status: response.status
				})).then(res => {
					if (res.data.msg == "Success") {
						this.setState({ price: res.data.price })
						this.setState(() => ({ modalStyle: { display: 'inline-block' } }));
					} else if (res.data.msg == "Error") {
						alert("Error")
					}
				});
			}
			else {
				throw new Error(response.status + " Failed Fetch ");
			}
		}).catch(e => console.error('EXCEPTION: ', e))
	}

	processRequest() {
		const pic = new FormData()
		pic.append('image', this.state.filePicture, this.state.filePicture.name);
		// Save the order in the database, itemsOrder, locationTag, photo
		fetch("/clientES/checkout/", {
			method: "POST",
			body: pic,
		}).then(async (response) => {
			// status 404 or 500 will set ok to false
			if (response.ok) {
				response.json().then(data => ({
					data: data,
					status: response.status
				})).then(res => {
					if (res.data.msg == "Success") {
						fetch("/clientES/checkout/", {
							method: "PUT",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ "preco": this.state.price, "pedido": this.state.itemsOrder, "locationTagNumber": this.state.locationTagNumber, 'customer': res.data.name }),
						}).then(async (response) => {
							// status 404 or 500 will set ok to false
							if (response.ok) {
								response.json().then(data => ({
									data: data,
									status: response.status
								})).then(res => {
									if (res.data.msg == "Success") {
										alert("Thanks for the purchase! Bon apetit " + res.data.name + "!")
										window.location.replace("/clientES/")
									} else {
										alert(res.data.msg)
									}
								});
							}
						})
					} else {
						alert(res.data.msg)
					}
				});
			}
		})
	}

	closeModal() {
		this.setState({ picture: null })
		this.setState(() => ({ modalStyle: { display: 'none' } }));
	}

	closeReceiveModal() {
		this.setState({ picture: null })
		this.setState(() => ({ receiveOrdermodal: { display: 'none' } }));
	}

	renderScreen() {
		this.setState(function (state, props) {
			state.rendered = true
			return { items: state.rendered }
		})
	}

}

ReactDOM.render(<MyPage text="" />, reacthere)