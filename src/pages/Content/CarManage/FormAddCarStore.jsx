import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Modal, Row, message } from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import {
    createSupplier,
    getListSupplier,
} from "../../../services/supplier/supplier";
import { reGexIsNumber, reGexLicensePlates, reGexPhone } from "../../../utils/config";
import { createMotorStore, getListMotorStore } from "../../../services/motorStore/motorStore";
export default function FormAddCarStore({ currentPage, pageSize }) {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            const response = await store.dispatch(createMotorStore(values));
            if (createMotorStore.fulfilled.match(response)) {
                setIsLoading(false);
                message.success("Thêm xe thành công");
                handleCancel();
                form.resetFields();
                await store.dispatch(getListMotorStore({ currentPage, pageSize }));
            } else if (createMotorStore.rejected.match(response)) {
                if (response.payload.errors) {
                    setIsLoading(false);
                    Object.keys(response.payload.errors).forEach((field) => {
                        const errorMessages = response.payload.errors[field];
                        errorMessages.forEach((errorMessage) => {
                            message.error(`${errorMessage}`);
                        });
                    });
                }
            }
        } catch (error) {
            setIsLoading(false);
            message.error("Có lỗi xảy ra");
        }
    };
    return (
        <div>
            <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
                Thêm mới
            </Button>

            <Modal
                title="Thêm xe"
                open={isModalOpen}
                footer={null}
                width={850}
                onCancel={handleCancel}
            >
                <Form
                    name="addCarStore"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark=""
                    form={form}
                >
                    <Row gutter={[8, 8]}>
                        <Col xl={12} lg={12} md={12} sm>
                            <Form.Item
                                label="Tên xe"
                                name="name_bike"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên xe",
                                    },
                                ]}
                            >
                                <Input placeholder="Tên xe" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]}>
                        <Col xl={12} lg={12} md={12} sm>
                            <Form.Item
                                label="Số khung"
                                name="frame_number"
                                rules={[
                                    {
                                        required: false,
                                        message: "Vui lòng nhập số khung",
                                    },

                                ]}
                            >
                                <Input placeholder="Số khung" />
                            </Form.Item>
                        </Col>
                        <Col xl={12} lg={12} md={12} sm>
                            {" "}
                            <Form.Item
                                rules={[
                                    {
                                        required: false,
                                        message: "Vui lòng nhập số máy ",
                                    },
                                ]}
                                name="machine_number"
                                label="Số máy"
                            >
                                <Input placeholder="Số máy" />
                            </Form.Item>
                        </Col>
                        <Col xl={12} lg={12} md={12} sm>
                            {" "}
                            <Form.Item
                                rules={[
                                    {
                                        required: false,
                                        message: "Vui lòng nhập số bảo hành ",
                                    },
                                ]}
                                name="warranty_number"
                                label="Số bảo hành"
                            >
                                <Input placeholder="Số bảo hành" />
                            </Form.Item>
                        </Col>
                        <Col xl={12} lg={12} md={12} sm>
                            <Form.Item
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số lượng xe",
                                    },
                                ]}
                            >
                                <InputNumber placeholder="Số lượng" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá xe",
                            },
                        ]}
                        name="motor_price"
                        label="Giá xe"
                    >
                        <InputNumber
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            placeholder="Giá xe"
                        />
                    </Form.Item>

                    <Row>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                icon={<PlusCircleOutlined />}
                            >
                                Thêm mới
                            </Button>
                        </Form.Item>
                        <Button
                            type="primary"
                            danger
                            onClick={handleCancel}
                            icon={<CloseCircleOutlined />}
                            style={{ marginLeft: 8 }}
                        >
                            Hủy
                        </Button>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}
