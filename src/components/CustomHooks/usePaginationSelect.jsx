import { useState, useEffect } from "react";
import { store } from "../../redux/configStores";

const usePaginationSelect = (getListCustomer,isModalOpenEdit) => {
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pageSizeScroll, setPageSizeScroll] = useState(200);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingScroll(true);
      const response = await store.dispatch(
        getListCustomer({ currentPage: 1, pageSize: pageSizeScroll })
      );
      setLoadingScroll(false);
      if (response?.payload?.data?.length < pageSizeScroll) {
        setHasMoreData(false);
      }
    };
    if(isModalOpenEdit){
      fetchData();
    }
  }, [getListCustomer, pageSizeScroll,isModalOpenEdit]);

  const THRESHOLD = 10; // Giá trị ngưỡng

  const handlePopupScroll = (e) => {
    const { target } = e;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + THRESHOLD;

    if (isAtBottom && !loadingScroll && hasMoreData) {
      const newPageSize = pageSizeScroll + 70;
      setPageSizeScroll(newPageSize);
    }
    
  };

  return { loadingScroll, handlePopupScroll, pageSizeScroll };
};

export default usePaginationSelect;
