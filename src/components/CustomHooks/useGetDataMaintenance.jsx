import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
//custom hooks phục vụ màn danh sách bảo dưỡng
const useGetDataMaintenance = (getList, filters, typeJob, jobId) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };

  console.log('filters: ', filters);
  console.log('typeJob: ', typeJob);
  console.log('jobId: ', jobId);

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
          type_job: typeJob,
          job_id: jobId
        })
      );
    };
    fetchData();
  }, [currentPage, pageSize, dispatch, getList, filters, typeJob, jobId]);

  return {
    dispatch,
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  };
};

export default useGetDataMaintenance;
