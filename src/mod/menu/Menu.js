import React from 'react';
// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
// import { withRouter } from "react-router-dom";
// import Platform from 'react-platform-js'
import { platform } from '@vkontakte/vkui';
import Icon24Back from '@vkontakte/icons/dist/24/browser_back';
import './Menu.css';

const osname = platform();

var showMenu = false;
class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	menuClick = () => {
		showMenu = !showMenu;
		var Menu = document.getElementsByClassName('menu');
		var Overlow = document.getElementsByClassName('overlow');
		if (showMenu) {
			Menu[0].style.left = "0";
			Overlow[0].style.visibility = "visible";
			Overlow[0].style.opacity = "1";
		} else {
			Menu[0].style.left = "-234px";
			Overlow[0].style.visibility = "hidden";
			Overlow[0].style.opacity = "0";
		}
	}

	componentDidMount() {
		if (osname === "android") {
            document.getElementsByClassName('menu')[0].style.paddingTop = "56px";
        }
        if (osname === "ios") { console.log("de ios") }
	}

	componentWillUpdate() {
		this.menuClick()
	}

	render() {
		return (
			<div className="wrapper">
				<div className="overlow" onClick={this.menuClick}></div>
				<div className="menu">
					{this.props.menuItem}
				</div>
			</div>
		);
	}
}

export default Menu;