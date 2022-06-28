class MyPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = { items : [] }
		this.textreference = React.createRef();
	}
	
	render() {
		var reslist = [];
		for(var i = 0; i < this.state.items.length ; i++){
			reslist.push(<li key={i}>{this.state.items[i]} <button onClick={this.removeList.bind(this, i)}>Delete</button></li>)
		}
		return (
			<div>
				<p>Shopping List</p>
				<input ref={this.textreference} type="text" placeholder="What do add here" defaultValue={this.state.text} onChange={this.changeText.bind(this)}/>
				<input type = "button" value="Add" onClick={this.addList.bind(this)} />
				<h1> {reslist} </h1>
			</div>
		)
	}
	
	changeText() {
		this.setState({ text : this.textreference.current.value })
	}

	addList(){
		var product = this.textreference.current.value
		this.setState(function(state, props){
			state.items.push(product)
			return {items :state.items}
		})
	}

	removeList(index){
		this.setState( function (state, props) {
			state.items.splice(index, 1)
			return { items : state.items }
		})
	}
}

ReactDOM.render(<MyPage text=""/>, reacthere)