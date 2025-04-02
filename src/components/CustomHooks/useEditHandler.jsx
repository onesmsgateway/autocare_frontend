import { useCallback, useImperativeHandle, useState } from "react";
import { message } from "antd";
const useEditHandler = (
  editFuntion,
  getList,
  dispatch,
  ref,
  currentPage,
  pageSize,
  formattedValues,
  filters
) => {
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [updateRecord, setUpdateRecord] = useState();
  const [isEditLoading, setEditLoading] = useState(false);
  const showModalEdit = useCallback((record) => {
    setIsModalOpenEdit(true);
    setUpdateRecord(record); // Cập nhật record khi showModalEdit được gọi
  }, []);
  const handleCancelEdit = useCallback(() => {
    setIsModalOpenEdit(false);
  }, []);
  useImperativeHandle(ref, () => ({
    showModalEdit,
    handleCancelEdit,
  }));

  const onFinish = async (values) => {
    const formatValues = formattedValues ? formattedValues(values) : values; // Format dữ liệu nếu có hàm format
    const data = {
      id: updateRecord?.id,
      ...formatValues,
    };
    console.log(data);
    setEditLoading(true);
    try {
      const response = await dispatch(editFuntion(data));
      if (editFuntion.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        if (filters) {
          await dispatch(getList({ currentPage, pageSize, status: filters }));
        } else {
          await dispatch(getList({ currentPage, pageSize }));
        }
      } else if (editFuntion.rejected.match(response)) {
        setEditLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      setEditLoading(false);
    }
  };
  return {
    isModalOpenEdit,
    onFinish,
    isEditLoading,
    updateRecord,
    showModalEdit,
    handleCancelEdit,
  };
};
export default useEditHandler;
