import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import Arrowcircle from "../../../components/Button/Arrowcircle";
import Editbtn from "../../../components/Button/Editbtn";
import Xcirclebtn from "../../../components/Button/Xcirclebtn";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import YesNoModal from "../../../components/rookiemodal/YesNoModal";
import DetailsComponent from "../../../components/DetailsComponent";
import { setParams } from "../assignmentSlice";
import { onChangePageName } from "../../home/homeSlice";
import { CreateReturnRequestAsync } from "../../returnRequest/returnRequestSlice";
import Table from "./TableList";
import {
  deleteAssignmentAsync,
  setAssignmentIdToDelete,
} from "../assignmentSlice";

const AssignmentTable = ({ listitem, onRefresh }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalRequestIsOpen, setmodalRequestIsOpen] = useState(false);
  const [assignmentInfor, setAssignmentInfor] = useState(null);
  const [Id, setAssignmentId] = useState(null);
  const history = useHistory();

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setAssignmentInfor(null);
    setAssignmentId(null);
    setmodalRequestIsOpen(false);
    setIsOpen(false);
  }
  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "auto",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleDisableAssignment = async (id) => {
    setAssignmentInfor(null);
    setAssignmentId(id);
    openModal();
  };

  const handleConfirmDisableAssignment = async () => {
    dispatch(setAssignmentIdToDelete(Id));
    dispatch(deleteAssignmentAsync(Id));
    closeModal();
  };

  const dispatch = useDispatch();
  const handleOnSort = (e) => {
    if (e[0]) {
      dispatch(setParams({ key: "OrderProperty", value: e[0].id }));
      dispatch(setParams({ key: "Desc", value: e[0].desc }));
    }
  };

  const handleRowClick = (dataRow) => {
    setAssignmentInfor({
      "Asset Code": dataRow.asset.code,
      "Asset Name": dataRow.asset.name,
      Specification: dataRow.asset.specification,
      "Assigned To": dataRow.userNameAssignedTo,
      "Assigned By": dataRow.userNameAssignedBy,
      "Assigned Date": new Date(dataRow.assignedDate).toLocaleDateString("en"),
      State: dataRow.state,
      Note: dataRow.note,
    });
    openModal();
  };

  const handleCreateRequestReturing = (e, id) => {
    setmodalRequestIsOpen(true);
    setAssignmentId(id);
  };

  const handleCreateReturnRequest = async () => {
    await dispatch(CreateReturnRequestAsync(Id));
    onRefresh();
    closeModal();
  };

  function checkRequest(stateName, requestid) {
    if (stateName !== "Accepted" || requestid !== null) {
      return true;
    }
    return false;
  }
  const columns = [
    {
      Header: "Asset Code",
      accessor: "asset.code",
    },
    {
      Header: "Asset Name",
      accessor: "asset.name",
    },
    {
      Header: "Assigned to",
      accessor: "userNameAssignedTo",
    },
    {
      Header: "Assigned by",
      accessor: "userNameAssignedBy",
    },
    {
      Header: "Assigned Date",
      accessor: "assignedDate",
    },
    {
      Header: "State",
      accessor: "state",
    },
    {
      Header: " ",
      Cell: ({ row }) => (
        <div className="rookie-group-btn">
          <Editbtn
            onClick={() => {
              dispatch(onChangePageName("Manage Assignment > Edit Assignment"));
              history.push(`/manageassignment/${row.original.id}`);
            }}
            disabled={row.original.state === "Accepted"}
          />
          <span style={{ marginLeft: "15px", marginRight: "15px" }}>
            <Xcirclebtn
              onClick={() => handleDisableAssignment(row.original.id)}
              disabled={row.original.state === "Accepted"}
            />
          </span>
          <Arrowcircle
            onClick={(e) => handleCreateRequestReturing(e, row.original.id)}
            disabled={checkRequest(
              row.original.state,
              row.original.returnRequestId,
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={listitem}
        onSort={(e) => handleOnSort(e)}
        onRowClick={(e) => handleRowClick(e)}
      ></Table>
      {Id ? (
        <YesNoModal
          title={"Are You Sure?"}
          modalIsOpen={modalRequestIsOpen ? modalRequestIsOpen : modalIsOpen}
          closeModal={closeModal}
          customStyles={customStyles}
        >
          <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
            <p>
              Do you want to{" "}
              {modalRequestIsOpen
                ? "create a returning request for this asset?"
                : "delete this assignment?"}
            </p>
            <Button
              color="danger"
              onClick={
                modalRequestIsOpen
                  ? () => handleCreateReturnRequest()
                  : () => handleConfirmDisableAssignment()
              }
            >
              {modalRequestIsOpen ? "Create" : "Delete"}
            </Button>
            <Button onClick={() => closeModal()} id="cancelUserBtn">
              Cancel
            </Button>
          </div>
        </YesNoModal>
      ) : (
        <RookieModal
          title={Id ? "Are You Sure?" : "Detailed Assignment Information"}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          customStyles={customStyles}
          isModalHeader={true}
        >
          {assignmentInfor ? (
            <>
              <DetailsComponent list={assignmentInfor} />
            </>
          ) : (
            ""
          )}
        </RookieModal>
      )}
    </>
  );
};

export default AssignmentTable;
