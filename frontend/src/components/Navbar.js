import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, TableOutlined, TeamOutlined } from '@ant-design/icons';
import RoomAssignment from './RoomAssignment';
import ButlerAssignments from './ButlerAssignments';
import ButlerProfiles from './ButlerProfiles';
import styled from 'styled-components';

const { Header, Content, Sider } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const Navbar = () => {
    const [selectedMenu, setSelectedMenu] = useState('assignments');

    const renderContent = () => {
        switch (selectedMenu) {
            case 'assignments':
                return <RoomAssignment />;
            case 'butlers':
                return <ButlerAssignments />;
            case 'profiles':
                return <ButlerProfiles />;
            default:
                return null;
        }
    };

    return (
        <StyledLayout>
            <Sider collapsible>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['assignments']}
                    onClick={(e) => setSelectedMenu(e.key)}
                >
                    <Menu.Item key="assignments" icon={<TableOutlined />}>Assignments</Menu.Item>
                    <Menu.Item key="butlers" icon={<UserOutlined />}>Butlers</Menu.Item>
                    <Menu.Item key="profiles" icon={<TeamOutlined />}>Profiles</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                    {selectedMenu === 'assignments' && 'Room Assignments'}
                    {selectedMenu === 'butlers' && 'Butler Assignments'}
                    {selectedMenu === 'profiles' && 'Butler Profiles'}
                </Header>
                <Content style={{ margin: '20px', padding: '20px', background: '#fff' }}>
                    {renderContent()}
                </Content>
            </Layout>
        </StyledLayout>
    );
};

export default Navbar;
