import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import { CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { fetchAssignments } from '../redux/assignmentsSlice';

const { TabPane } = Tabs;

const butlerPairs = ['Marko/Ali', 'Edgar/Joyce', 'Miguel/Rodrigo', 'Sofia/Fernando', 'Daniel/Lemus', 'Jhovany/Marlon'];

const statusColors = {
  known: '#1890ff',
  contact: '#faad14',
  unknown: '#ff4d4f',
  checkedOut: '#52c41a'
};

const NoteBox = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
  width: 100%;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const CardContainer = styled.div`
  padding: 20px;
`;

const StatusContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const StatusCircle = styled(CheckCircleOutlined)`
  font-size: 24px;
  cursor: pointer;
  transition: opacity 0.3s;
  opacity: ${(props) => (props.active ? 1 : 0.3)};
`;

const FadedText = styled.span`
  color: #888;
  font-size: 12px;
  font-style: italic;
`;

const ButlerGuestList = ({ pair }) => {
  const dispatch = useDispatch();
  const { assignments } = useSelector(state => state.assignments);

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleStatusChange = async (guestName, status) => {
    try {
      await axios.put('http://localhost:5000/api/assignments/update-status', {
        name: guestName,
        status: status
      });
      dispatch(fetchAssignments());
    } catch (error) {
      message.error('Error updating guest status');
    }
  };

  const now = moment();

  const guests = assignments.filter(guest => guest.assignedButler === pair);

  const groupedGuests = {
    known: [],
    contact: [],
    unknown: [],
    checkedOut: [],
    future: {}
  };

  guests.forEach(guest => {
    const status = guest.status || 'unknown';
    const beginDate = moment(guest.begin_date, 'YYYY-MM-DD');
    const departureDate = moment(guest.departure_date, 'YYYY-MM-DD');

    if (status === 'checkedOut' && guest.checkedOutTime) {
      const checkedOutMoment = moment(guest.checkedOutTime);
      if (now.diff(checkedOutMoment, 'hours') > 24) return;
    }

    if (beginDate.isAfter(now, 'month')) {
      const month = beginDate.format('MMMM YYYY');
      if (!groupedGuests.future[month]) groupedGuests.future[month] = [];
      groupedGuests.future[month].push(guest);
    } else {
      groupedGuests[status].push(guest);
    }
  });

  return (
    <>
      {['known', 'contact', 'unknown', 'checkedOut'].map(status => (
        groupedGuests[status].length > 0 && (
          <div key={status} style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: statusColors[status] }}>{status.toUpperCase()}</h2>
            <Row gutter={[16, 16]}>
              {groupedGuests[status].map(guest => (
                <Col span={8} key={`${guest.name}-${guest.roomNo}`}>
                  <NoteBox>
                    <h3>{guest.name}</h3>
                    <p><strong>Room:</strong> {guest.roomNo} ({guest.roomType})</p>
                    <p><strong>Arrival:</strong> {moment(guest.begin_date).format('YYYY-MM-DD')}</p>
                    <p><strong>Departure:</strong> {moment(guest.departure_date).format('YYYY-MM-DD')}</p>
                    {status === 'checkedOut' && (
                      <FadedText>Checked out (visible for 24h)</FadedText>
                    )}
                    <StatusContainer>
                      {Object.entries(statusColors).map(([s, color]) => (
                        <StatusCircle
                          key={s}
                          active={status === s}
                          style={{ color }}
                          onClick={() => handleStatusChange(guest.name, s)}
                        />
                      ))}
                    </StatusContainer>
                  </NoteBox>
                </Col>
              ))}
            </Row>
          </div>
        )
      ))}

      {Object.keys(groupedGuests.future).length > 0 && (
        <div>
          <h2>Future Guests</h2>
          {Object.entries(groupedGuests.future).map(([month, guests]) => (
            <div key={month} style={{ marginTop: '1rem' }}>
              <h3>{month}</h3>
              <Row gutter={[16, 16]}>
                {guests.map(guest => (
                  <Col span={8} key={`${guest.name}-${guest.roomNo}`}>
                    <NoteBox>
                      <h3>{guest.name}</h3>
                      <p><strong>Room:</strong> {guest.roomNo} ({guest.roomType})</p>
                      <p><strong>Arrival:</strong> {moment(guest.begin_date).format('YYYY-MM-DD')}</p>
                      <p><strong>Departure:</strong> {moment(guest.departure_date).format('YYYY-MM-DD')}</p>
                    </NoteBox>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const ButlerProfiles = () => {
  return (
    <CardContainer>
      <Tabs defaultActiveKey="Marko/Ali" centered>
        {butlerPairs.map(pair => (
          <TabPane tab={pair} key={pair}>
            <ButlerGuestList pair={pair} />
          </TabPane>
        ))}
      </Tabs>
    </CardContainer>
  );
};

export default ButlerProfiles;
