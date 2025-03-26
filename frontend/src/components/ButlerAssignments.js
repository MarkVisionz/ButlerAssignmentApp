import React, { useState, useEffect } from 'react';
import { Row, Col, Select } from 'antd';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { CheckCircleOutlined } from '@ant-design/icons';
import { updateGuestStatus, fetchAssignments } from '../redux/assignmentsSlice';

const butlerPairs = ['Marko/Ali', 'Edgar/Joyce', 'Miguel/Rodrigo', 'Sofia/Fernando', 'Daniel/Lemus', 'Jhovany/Marlon'];
const statusColors = {
    known: '#1890ff',
    contact: '#faad14',
    unknown: '#ff4d4f',
    checkedOut: '#52c41a'
};

const CardContainer = styled.div`
  padding: 20px;
`;

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

const StyledSelect = styled(Select)`
  width: 100%;
  margin-bottom: 20px;
`;

const ButlerAssignments = () => {
    const dispatch = useDispatch();
    const { assignments } = useSelector(state => state.assignments);
    const [selectedButler, setSelectedButler] = useState(null);

    useEffect(() => {
        dispatch(fetchAssignments());
    }, [dispatch]);

    const toggleStatus = (guestName, status) => {
        dispatch(updateGuestStatus({ name: guestName, status }));
    };

    const groupedGuests = {};
    assignments.forEach(guest => {
        if (!groupedGuests[guest.name]) {
            groupedGuests[guest.name] = {
                name: guest.name,
                assignedButler: guest.assignedButler,
                rooms: [],
                begin_date: guest.begin_date,
                departure_date: guest.departure_date,
                status: guest.status,
                checkedOutTime: guest.checkedOutTime
            };
        }
        groupedGuests[guest.name].rooms.push(guest.roomNo);
    });

    const filteredAssignments = selectedButler
        ? Object.values(groupedGuests).filter(guest => {
            if (guest.assignedButler !== selectedButler) return false;
            if (guest.status === 'checkedOut' && guest.checkedOutTime) {
                return moment().diff(moment(guest.checkedOutTime), 'hours') <= 24;
            }
            return true;
        }).sort((a, b) => new Date(a.begin_date) - new Date(b.begin_date))
        : [];

    const groupedAssignments = {
        known: [],
        contact: [],
        unknown: [],
        checkedOut: []
    };

    filteredAssignments.forEach(guest => {
        groupedAssignments[guest.status || 'unknown'].push(guest);
    });

    return (
        <CardContainer>
            <StyledSelect
                placeholder="Select Butler"
                onChange={(value) => setSelectedButler(value)}
                value={selectedButler || null}
                allowClear
            >
                {butlerPairs.map(pair => (
                    <Select.Option key={pair} value={pair}>{pair}</Select.Option>
                ))}
            </StyledSelect>

            {selectedButler && (
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    {Object.entries(groupedAssignments).map(([status, guests]) => (
                        <Col span={6} key={status}>
                            <h3 style={{ color: statusColors[status] }}>{status.toUpperCase()}</h3>
                            {guests.length > 0 ? (
                                guests.map(guest => (
                                    <NoteBox key={guest.name}>
                                        <h3>{guest.name}</h3>
                                        <p>Rooms: {guest.rooms.join(', ')}</p>
                                        <p><strong>Arrival: {moment(guest.begin_date).format('YYYY-MM-DD')}</strong></p>
                                        <p><strong>Departure: {moment(guest.departure_date).format('YYYY-MM-DD')}</strong></p>
                                        <StatusContainer>
                                            {Object.entries(statusColors).map(([s, color]) => (
                                                <StatusCircle
                                                    key={s}
                                                    active={guest.status === s}
                                                    style={{ color }}
                                                    onClick={() => toggleStatus(guest.name, s)}
                                                />
                                            ))}
                                        </StatusContainer>
                                    </NoteBox>
                                ))
                            ) : (
                                <p>No guests</p>
                            )}
                        </Col>
                    ))}
                </Row>
            )}
        </CardContainer>
    );
};

export default ButlerAssignments;
