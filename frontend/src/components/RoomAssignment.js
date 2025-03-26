import React, { useEffect, useState } from 'react';
import { Table, Select, Upload, Button, message, DatePicker } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments } from '../redux/assignmentsSlice';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const { Option } = Select;
const butlerPairs = ['Marko/Ali', 'Edgar/Joyce', 'Miguel/Rodrigo', 'Sofia/Fernando', 'Daniel/Lemus', 'Jhovany/Marlon'];

const RoomAssignment = () => {
    const dispatch = useDispatch();
    const { assignments } = useSelector(state => state.assignments);
    const [loading, setLoading] = useState(false);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [roomTypeFilter, setRoomTypeFilter] = useState(null);
    const [dateRange, setDateRange] = useState(null);

    useEffect(() => {
        dispatch(fetchAssignments());
    }, [dispatch]);

    useEffect(() => {
        let filteredData = assignments;
        
        if (roomTypeFilter) {
            filteredData = filteredData.filter(item => item.roomType === roomTypeFilter);
        }

        if (dateRange && dateRange.length === 2) {
            const [startDate, endDate] = dateRange;
            filteredData = filteredData.filter(item => {
                const arrivalDate = moment(item.begin_date); // Se usa begin_date del XML
                return arrivalDate.isBetween(startDate, endDate, 'day', '[]');
            });
        }
        
        setFilteredAssignments(filteredData);
    }, [assignments, roomTypeFilter, dateRange]);

    const handleDeleteAll = async () => {
        try {
            await axios.delete('http://localhost:5000/api/assignments/delete-all');
            message.success('All assignments deleted');
            dispatch(fetchAssignments()); // Refresh data
        } catch (error) {
            message.error('Error deleting assignments');
        }
    };

    const handleUpload = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:5000/api/upload-xml', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            message.success('XML processed successfully');
            dispatch(fetchAssignments()); // Refresh data
        } catch (error) {
            message.error('Error processing XML');
        }
        setLoading(false);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Room Type', dataIndex: 'roomType', key: 'roomType' },
        { title: 'Room No.', dataIndex: 'roomNo', key: 'roomNo' },
        { title: 'Rate Amount', dataIndex: 'rateAmount', key: 'rateAmount' },
        { 
            title: 'Arrival Date', 
            dataIndex: 'begin_date', 
            key: 'begin_date',
            render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A' // Formatear la fecha correctamente
        },
        { 
            title: 'Departure Date', 
            dataIndex: 'departure_date', 
            key: 'departure_date',
            render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A' // Nueva columna para departure_date
        },
        { 
            title: 'Assigned Butler', 
            dataIndex: 'assignedButler', 
            key: 'assignedButler',
            render: (text, record) => (
                <Select value={text}>
                    {butlerPairs.map(butler => <Option key={butler} value={butler}>{butler}</Option>)}
                </Select>
            ),
        }
    ];

    return (
        <div>
            <FilterContainer>
                <RangePicker onChange={(dates) => setDateRange(dates)} />
                <Select placeholder="Filter by Room Type" allowClear onChange={setRoomTypeFilter}>
                    {assignments.map(item => (
                        <Option key={item.roomType} value={item.roomType}>{item.roomType}</Option>
                    ))}
                </Select>
            </FilterContainer>
            <ButtonContainer>
                <Upload customRequest={({ file }) => handleUpload(file)} showUploadList={false}>
                    <Button icon={<UploadOutlined />} loading={loading}>Upload XML</Button>
                </Upload>
                <Button type="danger" icon={<DeleteOutlined />} onClick={handleDeleteAll}>
                    Delete All Assignments
                </Button>
            </ButtonContainer>
            <Table columns={columns} dataSource={filteredAssignments} rowKey='roomNo' />
        </div>
    );
};

export default RoomAssignment;
