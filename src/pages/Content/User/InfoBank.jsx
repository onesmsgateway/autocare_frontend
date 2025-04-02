import { useCallback, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Skeleton,
  Flex,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createAccountBank,
  getInfoAccoutBank,
} from "../../../services/user/user";

export default function InfoBank() {
  const { infoAccountBank, isLoadInfoAccountBank } = useSelector(
    (state) => state.user
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const onFinish = async (values) => {
    setIsLoading(true);
    // console.log(data)
    try {
      const response = await dispatch(createAccountBank(values));
      // console.log(response)
      if (response.payload.message === "success") {
        setIsLoading(false);
        await dispatch(getInfoAccoutBank());
        message.success("Cập nhật thông tin thành công");
      } else {
        setIsLoading(false);
        message.success(response.payload.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };
  useEffect(() => {
    if (infoAccountBank) {
      form.setFieldsValue({
        bank_name: "OCB",
        bank_code: infoAccountBank?.data?.bank_code,
        bank_account_name: infoAccountBank.data?.bank_account_name,
        bank_account_number: infoAccountBank.data?.bank_account_number,
        bank_branch_address: infoAccountBank.data?.bank_branch_address,
      });
    }
  }, [infoAccountBank, form]);
  const [formChanged, setFormChanged] = useState(false);
  const [initialValues] = useState(() => ({
    bank_name: "OCB" || "",
    bank_code: infoAccountBank?.data?.bank_code || "",
    bank_account_name: infoAccountBank?.data?.bank_account_name || "",
    bank_account_number: infoAccountBank?.data?.bank_account_number || "",
    bank_branch_address: infoAccountBank?.data?.bank_branch_address || "",
  }));

  const onFieldsChange = useCallback(
    (_, changedFields) => {
      // Kiểm tra xem có thay đổi không
      if (changedFields.length > 0) {
        // Kiểm tra sự khác biệt giữa giá trị hiện tại và giá trị ban đầu
        const isValueChanged = changedFields.some(
          (changedField) =>
            form.getFieldValue(changedField.name) !==
            initialValues[changedField.name]
        );
        setFormChanged(isValueChanged);
      } else {
        setFormChanged(false);
      }
    },
    [form, initialValues]
  );

  return (
    <div>
      <Flex justify="center">
        <div className="boxedituser">
          {isLoadInfoAccountBank ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <Form
              form={form}
              name="account_bank"
              onFinish={onFinish}
              initialValues={initialValues}
              onFieldsChange={onFieldsChange}
              layout="vertical"
            >
              <Form.Item
                name="bank_name"
                label="Tên ngân hàng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên ngân hàng !",
                  },
                  {
                    pattern: /^[A-Z]+$/,
                    message: "Vui lòng chỉ nhập ký tự in hoa!",
                  },
                ]}
              >
                <Input placeholder="Tên ngân hàng" />
              </Form.Item>
              <Form.Item
                label="Mã ngân hàng"
                name="bank_code"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tài khoản",
                  },
                ]}
              >
                <Input placeholder="Mã ngân hàng" />
              </Form.Item>
              <Form.Item
                label="Tên tài khoản ngân hàng"
                name="bank_account_name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên tài khoản ngân hàng",
                  },
                  {
                    pattern: /^[A-Z\s]+$/,
                    message: "Tên tài khoản chưa đúng định dạng",
                  },
                ]}
              >
                <Input placeholder="Tên tài khoản ngân hàng" />
              </Form.Item>
              <Form.Item
                name="bank_account_number"
                label="Số tài khoản"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã ngân hàng",
                  },
                  // {
                  //   pattern: /^[A-Z\s]+$/,
                  //   message: "Mã ngân hàng chưa đúng định dạng",
                  // },
                ]}
              >
                <Input placeholder="Số tài khoản" />
              </Form.Item>
              <Form.Item
                name="bank_branch_address"
                label="Chi nhánh ngân hàng"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập chi nhánh ngân hàng ",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Button
                style={{
                  padding: "9px 36px",
                  height: "auto",
                  fontSize: "16px",
                  fontWeight: "500",
                  width: "100%",
                }}
                loading={isLoading}
                disabled={isLoading || !formChanged}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Cập nhật
              </Button>
            </Form>
          )}
        </div>
      </Flex>
    </div>
  );
}
