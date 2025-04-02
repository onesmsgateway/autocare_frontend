import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Tooltip } from "antd";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editMaintenanceDebt, getListMaintenanceDebt } from "../../../services/maintenanceDebt/maintenanceDebt";
import { message } from "antd";
const { Option } = Select;

const EditMaintenanceDebt = forwardRef(function EditMaintenanceDebt(props, ref) {
    const { currentPage, pageSize, record, search } = props;
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [updateRecord, setUpdateRecord] = useState();
    const [isEditLoading, setEditLoading] = useState(false);

    // Hiển thị modal chỉnh sửa
    const showModalEdit = useCallback((record) => {
        setIsModalOpenEdit(true);
        setUpdateRecord(record);
    }, []);

    // Đóng modal
    const handleCancelEdit = useCallback(() => {
        setIsModalOpenEdit(false);
    }, []);

    // Đồng bộ form với record được chọn
    useEffect(() => {
        if (updateRecord && isModalOpenEdit) {
            form.setFieldsValue({
                nameKH: updateRecord?.customer?.full_name,
                debt: updateRecord?.debt,
                status: updateRecord?.status
            });
        }
    }, [updateRecord, form, isModalOpenEdit]);

    // Gửi form cập nhật
    const onFinish = async (values) => {
        const data = {
            id: updateRecord?.id,
            ...values,
        };
        setEditLoading(true);
        try {
            const response = await dispatch(editMaintenanceDebt(data));
            if (editMaintenanceDebt.fulfilled.match(response)) {
                console.log(response);
                message.success("Cập nhật thành công");
                // Reload danh sách mà không hiển thị thông báo
                await dispatch(
                    getListMaintenanceDebt({
                        currentPage,
                        pageSize,
                        search,
                    })
                );
                setEditLoading(false);
                handleCancelEdit();
            } else {
                setEditLoading(false);
                console.log(response);
                const errorMessage =
                    response?.payload?.response?.data?.error || 
                    response?.payload?.error || 
                    "Đã xảy ra lỗi trong quá trình xử lý.";
                message.error(errorMessage);
            }
        } catch (error) {
            console.log('dd', 1);
            setEditLoading(false);
        }
    };

    return (
        <div>
            <Tooltip placement="top" title="Sửa">
                <span
                    style={{
                        fontSize: 20,
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        showModalEdit(record);
                    }}
                >
                    <EditOutlined />
                </span>
            </Tooltip>

            <Modal
                title="Công nợ"
                open={isModalOpenEdit}
                footer={null}
                onCancel={handleCancelEdit}
            >
                <Form
                    name="editMaintenanceDebt"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark=""
                    form={form}
                >
                    <Row gutter={[8, 8]}>
                        <Col xl={12} lg={12} md={12} sm={12}>
                            <Form.Item
                                label="Tên khách hàng"
                                name="nameKH"
                            >
                                <Input placeholder="Tên bộ phận" disabled />
                            </Form.Item>
                        </Col>
                        <Col xl={12} lg={12} md={12} sm={12}>
                            <Form.Item
                                label="Công nợ"
                                name="debt"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[
                                {
                                    message: "Vui lòng chọn trạng thái",
                                },
                            ]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="pending">Chờ xử lý</Option>
                                <Option value="completed">Hoàn thành</Option>
                            </Select>
                        </Form.Item>
                    </Row>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isEditLoading}
                            icon={<SyncOutlined />}
                        >
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
});

EditMaintenanceDebt.displayName = "EditMaintenanceDebt";

export default EditMaintenanceDebt;
