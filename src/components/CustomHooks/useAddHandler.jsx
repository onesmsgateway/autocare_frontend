import { useState } from "react";
import { message } from "antd";
import { Form } from "antd";
import { store } from "../../redux/configStores";

const useAddHandler = (
  createFunction,
  getListFunction,
  currentPage,
  pageSize,
  formatValues,
  getListFunction2
) => {
  const [formAdd] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (fieldsValue) => {
    const values = formatValues ? formatValues(fieldsValue) : fieldsValue;
    console.log(values); // Format dữ liệu nếu có hàm format
    setIsLoading(true);
    try {
      const response = await store.dispatch(createFunction(values));
      if (createFunction.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm thành công");
        handleCancel();
        formAdd.resetFields();
        await store.dispatch(getListFunction({ currentPage, pageSize }));
        getListFunction2 &&
          (await store.dispatch(getListFunction2({ currentPage, pageSize })));
      } else if (createFunction.rejected.match(response)) {
        setIsLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(errorMessage);
            });
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };

  return { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish };
};

export default useAddHandler;
