import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import useAddHandler from "../../../components/CustomHooks/useAddHandler";
import {
  createWareHouse,
  getListWareHouse,
} from "../../../services/warehouse/warehouse";
export default function AddWareHouse({ currentPage, pageSize }) {
  // const { listStores, isLoadStores } = useSelector((state) => state.stores);
  const { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish } =
    useAddHandler(createWareHouse, getListWareHouse, currentPage, pageSize);
  // const { loadingScroll, handlePopupScroll, pageSizeScroll } =
  //   usePaginationSelect(getListStores);
  // const options = listStores?.data.map((item) => {
  //   return {
  //     label: item?.store_name,
  //     value: item?.id,
  //   };
  // });
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm kho"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addWareHouse"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên kho ",
                  },
                ]}
                name="name"
                label="Tên kho"
              >
                <Input placeholder="Tên kho" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Ghi Chú"
                name="content"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập ghi chú",
                  },
                ]}
              >
                <Input placeholder="Ghi chú" />
              </Form.Item>
            </Col>
          </Row>
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
