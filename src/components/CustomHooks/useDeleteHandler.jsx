import { useState } from "react";
import { message } from "antd";
import { useDispatch } from "react-redux";

const useDeleteHandler = (
  deleteFunction,
  getListFunction,
  currentPage,
  pageSize,
  data,
  setCurrentPage,
  filters,
  getListFunction2
) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await dispatch(deleteFunction(id));
      // console.log(response);
      if (deleteFunction.fulfilled.match(response)) {
        message.success("Xóa thành công");
        if (filters) {
          await dispatch(
            getListFunction({ currentPage, pageSize, status: filters })
          );
          getListFunction2 &&
            (await dispatch(getListFunction2({ currentPage, pageSize })));
        } else {
          await dispatch(getListFunction({ currentPage, pageSize }));
          getListFunction2 &&
            (await dispatch(getListFunction2({ currentPage, pageSize })));
        }
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else if (deleteFunction.rejected.match(response)) {
        console.log(response);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(errorMessage);
            });
          });
        } else if (response.payload.status === 400) {
          message.error(response.payload.error);
        } else {
          message.error(response.payload.message);
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleDelete };
};

export default useDeleteHandler;
