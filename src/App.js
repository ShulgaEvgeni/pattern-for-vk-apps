import React from 'react';
// import connect from '@vkontakte/vkui-connect';
import connect from '@vkontakte/vkui-connect-mock';
import vkuiConnect from '@vkontakte/vkui-connect';
import { View, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Route } from "react-router-dom";

import Home from './panels/js/Home';
import Persik from './panels/js/Persik';

import Menu from './mod/menu/Menu'; // кастамное меню

import Main from './panels/js/Main';
import Panel1 from './panels/js/Panel1';
import Panel2 from './panels/js/Panel2';

import './App.css';
import menu from '@vkontakte/icons/dist/28/menu';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'main', // активная панель
			history: ['main'], // история переходов для свайпа на iOS
			loadApp: false,
			fetchedUser: null,
			showMenu: false,
		};
	}

	// метод для открытия/закрытия меню
	chMenu = () => {
		this.setState({ showMenu: !this.state.showMenu });
	}

	componentDidMount() {
		// прослушавие событий изменеий истории аппы, нужен для нормальной работы нативной кнопки назад на android
		window.addEventListener('popstate', (event) => {
			console.log("назад")
			const his = [...this.state.history];
			his.pop();
			const active = his[his.length - 1];
			if (active === 'main') {
				vkuiConnect.send('VKWebAppDisableSwipeBack');
			}
			this.setState({ history: his, activePanel: active });
		}, false);
		/////////////////////////////////////////////////////////////
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					setTimeout(()=>{this.setState({ fetchedUser: e.detail.data, loadApp: true });},500)					
					break;
				default:
					console.log(e.detail.type);
			}
		});
		vkuiConnect.subscribe((e) => {
			switch (e.detail.type) {
				default:
					console.log("qwe ", e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
		// connect.send("VKWebAppSetViewSettings", { "status_bar_style": "dark", "action_bar_color": "#87C2E7" });

	}

	// метод удаления перехода из истории аппы
	goBack = () => {
		window.history.back();
	}

	// метод добавления перехода из истории аппы
	goForward = (activePanel) => {
		const history = [...this.state.history];
		history.push(activePanel);
		if (this.state.activePanel === 'main') {
			vkuiConnect.send('VKWebAppEnableSwipeBack');
		}
		window.history.pushState({}, '', activePanel)

		this.setState({ history, activePanel });
	}



	render() {
		if (this.state.loadApp) {
			let menuItem =
				<div>
					<div className="menu-item" onClick={() => { this.chMenu(); this.goForward("Panel1") }}><b>Panel1</b></div>
					<div className="menu-item" onClick={() => { this.chMenu(); this.goForward("Panel2") }}><b>Panel2</b></div>
				</div>
			return (
				<ConfigProvider>
					{/* кастамное меню */}
					<Menu
						menuItem={menuItem}
						showMenu={this.state.showMenu}
					/>
					{/*  */}
					<View
						activePanel={this.state.activePanel}
						history={this.state.history}
						onSwipeBack={this.goBack} // для свайпа на iOS
					>
						{/* <Home id="home"
							fetchedUser={this.state.fetchedUser}
							go={this.go}
							goForward={this.goForward}
							chMenu={this.chMenu}
						/>
						<Persik id="persik"
							go={this.go}
							goBack={this.goBack}
							goForward={this.goForward}
						/> */}
						<Main
							fetchedUser={this.state.fetchedUser}
							id="main"
							goBack={this.goBack}
							goForward={this.goForward}
							chMenu={this.chMenu}
						/>
						<Panel1
							fetchedUser={this.state.fetchedUser}
							id="Panel1"
							goBack={this.goBack}
							goForward={this.goForward}
							chMenu={this.chMenu}
						/>
						<Panel2
							fetchedUser={this.state.fetchedUser}
							id="Panel2"
							goBack={this.goBack}
							goForward={this.goForward}
							chMenu={this.chMenu}
						/>
					</View>
				</ConfigProvider>
			);
		} else {
			return (
				<div>Loading ...</div>
			);
		}
	}
}

export default App;
