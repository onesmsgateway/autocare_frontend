import { DeleteOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Image,
  Input,
  Popconfirm,
  Row,
  Skeleton,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDateTime, { ConvertUrlImage } from "../../../utils/dateTime";

import { setHasFetchData } from "../../../redux/hasFetchData/hasFetchData";
import { debounce } from "lodash";
import { store } from "../../../redux/configStores";
import AddPostSetting from "./AddPostSetting";
import EditPostSetting from "./EditPostSetting";
import {
  deletePost,
  getListCategoryPost,
  getListPost,
  updateStatusPost,
} from "../../../services/post/post";
import { settings } from "../../../utils/config";

export default function TablePostSetting() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { listPost, isLoadPost, listCategoryPost, isLoadListCategoryPost } =
    useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);

  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const company_id =
    userData?.data?.company_id || settings?.getCookie("company_id");

  const optionsCategoryPost = listCategoryPost?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const delayedAction = useRef(
    debounce((value) => {
      store.dispatch(
        getListPost({
          currentPage,
          pageSize,
          company_id,
          search: value,
        })
      );
    }, 600)
  ).current;

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      delayedAction(value);
    },
    [delayedAction]
  );

  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  useEffect(() => {
    const callApi = async () => {
      dispatch(setHasFetchData(true));
      await Promise.all[
        dispatch(getListCategoryPost({ currentPage, pageSize }))
      ];
    };
    callApi();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListPost({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listPost?.data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        company_id: item.company_id,
        name: item.title,
        category: item.post_category,
        description: item.summary,
        status: item.status,
        image: item.image,
        target: item.target,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });
    setData(dataNew);
  }, [listPost]);
  const handleDelete = async (record) => {
    try {
      const response = await dispatch(deletePost(record.id));
      if (deletePost.fulfilled.match(response)) {
        message.success("Xóa thành công");
        await dispatch(
          getListPost({
            currentPage,
            pageSize,
            company_id,
            search: inputValue,
          })
        );
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else if (deletePost.rejected.match(response)) {
        if (response.payload.error) {
          message.error(response.payload.error);
        }
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình xóa
      message.error("Có lỗi xảy ra");
    }
  };
  const onChangeSwitch = async (checked, record) => {
    try {
      const dataIndex = data.findIndex((item) => item.key === record.key);
      if (dataIndex !== -1) {
        const updatedData = [...data];
        const dataUpdateStatus = {
          id: updatedData[dataIndex].id,
          status: checked,
        };
        await store.dispatch(updateStatusPost(dataUpdateStatus));
        updatedData[dataIndex].status = checked ? 1 : 0;
        setData(updatedData);
        message.success("Thay đổi trạng thái thành công");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thay đổi trạng thái");
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      // editable: true,
      width: "6%",
    },
    {
      title: "Loại bài viết",
      dataIndex: "category",
      // editable: true,
      width: "11%",
      render: (record) => {
        const name = record?.name || "";
        return name;
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      // editable: true,
      width: "11%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      align: "center",
      // editable: true,
      width: "11%",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      align: "center",
      // editable: true,
      render: (record) => {
        return record ? (
          <Image
            src={
              ConvertUrlImage(record) ||
              "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
            }
            // src={record || ""}
            alt=""
            height={100}
          />
        ) : (
          // <div style={{ height: "100px" }} />
          ""
        );
      },
      width: "11%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "11%",
      // editable: true,
      render: (record) => {
        const time = formatDateTime(record);
        return time;
      },
    },
    {
      title: "Trạng thái ",
      dataIndex: "status",
      align: "center",
      width: "11%",
      render: (_, record) => (
        <Switch
          onChange={() => onChangeSwitch(!record.status, record)}
          checked={record.status === 1 ? true : false}
        />
      ),
    },

    {
      title: "Sửa/Xóa",
      dataIndex: "operation",
      align: "center",
      width: "11%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditPostSetting
              record={record}
              currentPage={currentPage}
              pageSize={pageSize}
              ref={showEdit}
              company_id={company_id}
              search={inputValue}
              optionsCategoryPost={optionsCategoryPost}
              isLoadListCategoryPost={isLoadListCategoryPost}
            />
            <Tooltip placement="top" title="Xóa">
              <Popconfirm
                placement="leftTop"
                title="Bạn có chắc chắn?"
                onConfirm={() => handleDelete(record)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <DeleteOutlined style={{ color: "#f5222d", fontSize: 20 }} />
              </Popconfirm>
            </Tooltip>
          </Flex>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable || col.dataIndex === "operation") {
      return col;
    }
    return {
      ...col,
      render: (_, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleShowEdit(record)}
        >
          {col.render ? col.render(_, record) : record[col.dataIndex]}
        </div>
      ),
    };
  });

  return (
    <div>
      <h2>Danh sách bài viết</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Danh sách bài viết",
            href: "/post",
          },
        ]}
      />
      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <AddPostSetting
            currentPage={currentPage}
            pageSize={pageSize}
            company_id={company_id}
            search={inputValue}
            optionsCategoryPost={optionsCategoryPost}
            isLoadListCategoryPost={isLoadListCategoryPost}
          />
        </Col>
        <Col xl lg md sm>
          <Input
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên"
          />
        </Col>
      </Row>
      <Divider />
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listPost?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadPost : false}
          dataSource={isLoadPost ? [] : data}
          locale={{
            emptyText: isLoadPost ? (
              <Flex vertical gap={20}>
                {[...Array(data?.length || 0)].map((_, rowIndex) => (
                  <Flex gap={10} justify="space-between" key={rowIndex}>
                    {columns.map((column) => (
                      <Skeleton.Input
                        key={`${column.dataIndex}-${rowIndex}`}
                        active={true}
                        size="small"
                        style={{ width: "90%" }}
                      />
                    ))}
                  </Flex>
                ))}
              </Flex>
            ) : (
              <Empty />
            ),
          }}
          bordered
          scroll={{ x: 1000, y: 520 }}
        />
      </Form>
    </div>
  );
}
