import { ImportOutlined } from "@ant-design/icons";
import { Button, Modal, Progress, Upload, message } from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import { settings } from "../../../utils/config";
import { NavLink } from "react-router-dom";
import { getListMotorStore } from "../../../services/motorStore/motorStore";

export default function ModalImportCarStore({ currentPage, pageSize }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("isModalOpen", isModalOpen);

  const baseUrl = import.meta.env.VITE_API_URL;
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const beforeUpload = (file) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];
    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error(
        "Bạn chỉ có thể tải lên file định dạng .xlsx, .xls hoặc .csv!"
      );
    }
    return isAllowedType;
  };

  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      setProgress(info.file.percent || 0); // Lấy phần trăm hoàn thành upload từ info
    } else {
      setUploading(false);
      setProgress(0); // Reset progress khi upload hoàn thành hoặc gặp lỗi
    }

    if (info.file.status === "done") {
      setIsModalOpen(false);
      await store.dispatch(getListMotorStore({ currentPage, pageSize }));
      message.success(`${info.file.name} tải lên thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại`);
    }
  };
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<ImportOutlined />}>
        Import Excel
      </Button>
      <Modal
        title="Import File Excel"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          onChange={handleChange}
          action={`${baseUrl}/company/api/v1/motor-store-import`}
          headers={{
            Authorization: `Bearer ${settings.getCookie("access_token")}`,
          }}
          accept=".xlsx,.xls,.csv"
          maxCount={1}
        >
          <Button type="primary" icon={<ImportOutlined />} loading={uploading}>
            {uploading ? " Đang tải lên" : "Import Excel"}
          </Button>
        </Upload>
        {uploading && (
          <Progress
            style={{ marginTop: 10 }}
            percent={progress}
            status={progress === 100 ? "success" : "active"}
          />
        )}
        <p style={{ margin: "10px 0" }}>
          Bấm vào đây để tải file mẫu{" "}
          <NavLink target="_blank" 
            rel="noopener noreferrer" to={`${baseUrl}/company/api/v1/motor-store-excel`}>
            Tải
          </NavLink>
        </p>
      </Modal>
    </div>
  );
}
