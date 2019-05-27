import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { Panel, ListItem, Button, Group, Div, Avatar, PanelHeader, PanelHeaderContent, HeaderButton, platform } from '@vkontakte/vkui';
import Icon28Menu from '@vkontakte/icons/dist/28/menu';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    componentDidMount() {
        connect.send("VKWebAppSetViewSettings", { "status_bar_style": "dark", "action_bar_color": "#87C2E7" });
    }

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader
                    left={
                        <HeaderButton onClick={() => { this.props.goBack() }}>
                            {osname === "ios" ? <Icon28ChevronBack /> : <Icon24Back />}
                        </HeaderButton>
                    }
                >
                    Panel2
                </PanelHeader>
                <div className="vict-main">
                    ваш контент
                </div>
            </Panel>
        );
    }
}

export default Main;