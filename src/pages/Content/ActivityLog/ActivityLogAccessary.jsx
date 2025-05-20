import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Select,
    Input,
    Row,
    Col,
    Tag,
    Button,
    Modal,
    Descriptions,
    Divider
} from 'antd';
import {
    SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getListActivityLogs } from '../../../services/activityLog/activityLog';
import { useDispatch } from 'react-redux';

const { Option } = Select;

export default function ActivityLogAccessary() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = useState({
        actionType: null,
        searchText: ''
    });

    const dispatch = useDispatch();

    // Fetch activity logs
    const fetchActivityLogs = async (params = {}) => {
        setLoading(true);
        try {
            const response = await dispatch(getListActivityLogs({
                currentPage: params.current || 1,
                pageSize: params.pageSize || 10,
                model: 'accessary', // Mặc định model là accessary
                search: filters.searchText,
                action: filters.actionType
            })).unwrap();

            setDataSource(response.data || []);
            setPagination(prev => ({
                ...prev,
                total: response.total || 0
            }));
        } catch (error) {
            console.error('Lỗi tải nhật ký:', error);
            setDataSource([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivityLogs({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    }, [pagination.current, filters]);

    const columns = [
        {
            title: 'Thời Gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm:ss')
        },
        {
            title: 'Người Thực Hiện',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Loại Hành Động',
            dataIndex: 'action',
            key: 'action',
            render: (action) => {
                const actionColors = {
                    'created': 'green',
                    'updated': 'blue',
                    'deleted': 'red',
                };
                return (
                    <Tag color={actionColors[action] || 'default'}>
                        {action}
                    </Tag>
                );
            }
        },
        {
            title: 'Chi Tiết Thay Đổi',
            dataIndex: 'changes',
            key: 'changes',
            render: (changes) => {
                try {
                    const parsedChanges = JSON.parse(changes || '[]');
                    return (
                        <div>
                            {parsedChanges.map((change, index) => (
                                <div key={index}>
                                    <strong>{change.field}:</strong>
                                    {change.old_value ? ` ${change.old_value} →` : ' '}
                                    {change.new_value}
                                </div>
                            ))}
                        </div>
                    );
                } catch {
                    return 'Không có thay đổi';
                }
            }
        },
        {
            title: 'Hành Động',
            key: 'actions',
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => handleViewDetails(record)}
                >
                    Chi Tiết
                </Button>
            )
        }
    ];

    const handleViewDetails = (record) => {
        try {
            const changes = JSON.parse(record.changes || '[]');

            Modal.info({
                title: `Chi Tiết Hoạt Động - ${record.action}`,
                width: 800,
                content: (
                    <div>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Người Thực Hiện">
                                {record.user_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời Gian">
                                {dayjs(record.created_at).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider>Dữ Liệu Thay Đổi</Divider>

                        <Table
                            columns={[
                                {
                                    title: 'Trường',
                                    dataIndex: 'field',
                                    key: 'field'
                                },
                                {
                                    title: 'Giá Trị Cũ',
                                    dataIndex: 'old_value',
                                    key: 'old_value'
                                },
                                {
                                    title: 'Giá Trị Mới',
                                    dataIndex: 'new_value',
                                    key: 'new_value'
                                }
                            ]}
                            dataSource={changes}
                            pagination={false}
                        />
                    </div>
                )
            });
        } catch {
            Modal.error({
                title: 'Lỗi',
                content: 'Không thể hiển thị chi tiết thay đổi'
            });
        }
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    return (
        <Card title="Nhật Ký Hoạt Động Phụ Tùng">
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xl={6} lg={8} md={12} sm={24}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Loại Hành Động"
                        allowClear
                        onChange={(value) => setFilters(prev => ({
                            ...prev,
                            actionType: value
                        }))}
                    >
                        <Option value="created">Tạo Mới</Option>
                        <Option value="updated">Cập Nhật</Option>
                        <Option value="deleted">Xóa</Option>
                    </Select>
                </Col>
                <Col xl={6} lg={8} md={12} sm={24}>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tìm kiếm theo người sửa"
                        allowClear
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            searchText: e.target.value
                        }))}
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="id"
                scroll={{ x: 800 }}
            />
        </Card>
    );
}
