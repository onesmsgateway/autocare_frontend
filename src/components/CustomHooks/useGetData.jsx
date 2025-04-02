import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetData = (getList, filters) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };

  console.log('filters: ', filters);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getList({
          currentPage,
          pageSize,
          status: filters,
          group_id: filters,
          type: filters,
        })
      );
    };
    fetchData();
  }, [currentPage, pageSize, dispatch, getList, filters]);

  return {
    dispatch,
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  };
};

export default useGetData;
