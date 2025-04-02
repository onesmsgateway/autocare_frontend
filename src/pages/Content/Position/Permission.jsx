import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import {
  getListPositionPermission,
  assignPermissionForPosition,
  getListPosition,
  getPosition,
} from "../../../services/position/position";
import { useParams } from "react-router-dom";

export default function PositionPermission() {
  const { positionId } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState([]);

  const [position, setPosition] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const handleChange = (checkedValues) => {
    let updatedPermissions = [...checkedValues]; // Clone danh sách các quyền đã chọn
    console.log();

    permissions.forEach((permission) => {
      const childIds = permission.children.map((child) => child.id);

      if (
        updatedPermissions.includes(permission.id) &&
        !childIds.some((id) => updatedPermissions.includes(id)) &&
        !childIds.some((id) => selectedPermissions.includes(id))
      ) {
        //1....Có ID Cha và ko tồn tại Id Con và state trc đó cũng ko tồn tại id con => active full cả cha và con
        updatedPermissions = [
          ...new Set([...updatedPermissions, permission.id, ...childIds]),
        ];
      } else if (
        updatedPermissions.includes(permission.id) &&
        childIds.some((id) => updatedPermissions.includes(id))
      ) {
        //2... Nếu Có ID Cha và có Id Con => Cập nhật data như bình thường
        updatedPermissions = [...new Set([...updatedPermissions])];
      } else if (
        !updatedPermissions.includes(permission.id) &&
        childIds.some((id) => updatedPermissions.includes(id))
      ) {
        //3... Không có ID Cha và có tồn tại Id Con => Thêm logic bên dưới
        if (
          !updatedPermissions.includes(permission.id) &&
          selectedPermissions.includes(permission.id)
        ) {
          //3.1 ..... Xóa bỏ ID Cha và Các Id Con
          updatedPermissions = updatedPermissions.filter(
            (id) => id !== permission.id && !childIds.includes(id)
          );
        } else {
          //3.2 ..... Các TH còn lại của TH3
          updatedPermissions.push(permission.id);
        }
      } else {
        //4...Các TH còn lại => xóa cả id cha và id con
        updatedPermissions = updatedPermissions.filter(
          (id) => id !== permission.id && !childIds.includes(id)
        );
      }
    });

    console.log("updated_permissions final", updatedPermissions);
    setSelectedPermissions([...new Set(updatedPermissions)]); // Cập nhật danh sách quyền không trùng lặp
  };

  const handleAssignPermissions = async (positionId, checkedValues) => {
    try {
      const data = {
        position_id: positionId,
        permission_ids: checkedValues,
      };
      console.log("data", data);
      const response = await dispatch(assignPermissionForPosition(data));
      console.log(response.payload);
      if (response?.payload?.data) {
        console.log(response?.payload?.data);
        if (response?.payload?.message === "success") {
          message.success("Gán quyền thành công");
          await dispatch(getListPosition({ currentPage: 1, pageSize: 10 }));
        }
      }
    } catch (error) {
      message.error("Không thể tải danh sách quyền!");
    }
  };

  // Lấy danh sách quyền từ API
  const fetchPermissions = async () => {
    try {
      const response = await dispatch(getListPositionPermission());
      if (response?.payload?.data) {
        console.log(response.payload?.data);
        setPermissions(response.payload.data);
      }
    } catch (error) {
      message.error("Không thể tải danh sách quyền!");
    }
  };

  const fetchPositionPermission = async (positionId) => {
    try {
      const response = await dispatch(getPosition(positionId));
      console.log("res", response);
      if (response?.payload?.data) {
        console.log("dd", response.payload?.data);
        setPosition(response?.payload?.data);
        setSelectedPermissions(
          (response?.payload?.data?.permissions || []).map((p) => p?.id)
        );
      }
    } catch (error) {
      message.error("Không thể tải quyền!");
    }
  };

  useEffect(() => {
    fetchPositionPermission(positionId);
    fetchPermissions();
  }, []);
  return (
    <div>
      <h2>Phân quyền chức vụ</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Nhân sự",
          },
          {
            title: "Chức vụ",
            href: "/position",
          },
          {
            title: "Phân quyền",
            href: `/position/${positionId}/permission`,
          },
        ]}
      />
      <Divider />
      <Form
        form={form}
        name="editPosition"
        layout="vertical"
        onFinish={() => {
          handleAssignPermissions(positionId, selectedPermissions);
        }}
      >
        <Row gutter={[8, 8]}>
          <Col xl={12} lg={12} md={12} sm={6}>
            <p>Chức vụ: {position?.name}</p>
          </Col>
          <Col style={{ marginTop: 30 }} span={24}>
            <p>Phân quyền:</p>
            <Checkbox.Group
              value={selectedPermissions} // Bind the selected permissions to the value of the Checkbox Group
              onChange={handleChange} // Update selected permissions when checkbox is toggled
            >
              <Row>
                {permissions.map((permission) => (
                  <Col
                    key={permission.id}
                    span={6}
                    style={{ marginTop: 20, marginBottom: 10 }}
                  >
                    <Checkbox
                      style={{ marginBottom: 10 }}
                      value={permission.id}
                    >
                      {permission.name}
                    </Checkbox>
                    {permission.children && permission.children.length > 0 && (
                      <Row style={{ marginLeft: 20 }}>
                        {permission.children.map((child) => (
                          <Col key={child.id} span={24}>
                            <Checkbox value={child.id}>{child.name}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
