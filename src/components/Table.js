import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import DealerEditModal from "./edit/DealerEditModal";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function BasicExample() {
  const [visible, setVisible] = useState(false);
  const [editVisible, seteditVisible] = useState(false);
  const [dealerList, setDealerList] = useState([]);
  const [originalDealerList, setOriginalDealerList] = useState([]);
  const navigate = useNavigate();
  const [dealerName, setDealerName] = useState();
  const [totalBudget, setTotalBudget] = useState();
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [userId, setuserId] = useState("");
  const [owner, setowner] = useState({
    firstName: "",
    lastName: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleGetDealerList = () => {
    fetch("http://localhost:3001/dealers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDealerList(data);
        setOriginalDealerList(data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const onSave = () => {
    let data = {
      name: dealerName,
      location,
      totalBudget,
      owner,
      remainingBudget: "$0",
      cars: [],
    };
    fetch("http://localhost:3001/dealers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => setVisible(false), handleGetDealerList())
      .catch((error) => console.error("Error:", error));
  };

  const HandleDeleteDealer = (id) => {
    let confirm = window.confirm("Are you sure you want to delete this Dealer");
    if (confirm) {
      fetch("http://localhost:3001/dealers/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => handleGetDealerList())
        .catch((error) => console.error("Error:", error));
    }
  };

  const HandleEdit = (id) => {
    seteditVisible(true);
    let [data] = dealerList?.filter((item) => item?.id == id);
    setuserId(data.id);
  };

  const HandleSearchDealer = (value) => {
    setSearchQuery(value);
  };

  const HandleNavigate = (id) => {
    const [selectedDealer] = dealerList.filter((dealer) => dealer.id == id);
    navigate("/car", { state: { Data: selectedDealer } });
  };

  useEffect(() => {
    if (searchQuery?.length > 0) {
      const filteredDealerList = originalDealerList.filter((dealer) =>
        dealer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDealerList(filteredDealerList);
    } else {
      setDealerList(originalDealerList);
    }
  }, [searchQuery, originalDealerList]);

  useEffect(() => {
    handleGetDealerList();
  }, []);

  return (
    <>
      <DealerEditModal
        seteditVisible={seteditVisible}
        editVisible={editVisible}
        id={userId}
        handleGetDealerList={handleGetDealerList}
      />
      <div className="dealership-cont my-5">
        <Container>
          <div className="d-flex align-items-end">
            <div>
              <h1 className="text-capitalize mn-3">dealership</h1>
              <form className="position-relative">
                <input
                  className="rounded p-2 border"
                  type="search"
                  placeholder="Search"
                  onChange={(e) => HandleSearchDealer(e.target.value)}
                />
              </form>
            </div>
            <div className="ms-auto">
              <button
                className="dealer-btn text-white rounded-pill text-capitalize d-flex align-items-center px-4  py-2 border-0"
                type="button"
                onClick={() => setVisible(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#fff"
                  class="bi bi-plus-lg me-2"
                  viewBox="0 0 16 16">
                  <path
                    fill-rule="evenodd"
                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                  />
                </svg>
                add dealer
              </button>
            </div>
          </div>
        </Container>
      </div>
      <div className="table-part">
        <Container>
          <div className="table-responsive">
            <Table bordered className="">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Name</th>
                  <th>Amount of Cars</th>
                  <th>Total Budget</th>
                  <th>Remaining Budget</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dealerList?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.name}</td>
                    <td>{item?.cars?.length}</td>
                    <td>{item?.totalBudget}</td>
                    <td>{item?.remainingBudget}</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        <button
                          type="button"
                          className="view-btn px-3 py-1 rounded-pill border-0 text-white"
                          onClick={() => HandleNavigate(item?.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#fff"
                            class="bi bi-eye me-2"
                            viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                          View
                        </button>
                        <button
                          type="button"
                          className="edit-btn px-3 py-1 rounded-pill border-0 ms-3 text-white"
                          onClick={() => HandleEdit(item?.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#fff"
                            class="bi bi-pencil me-2"
                            viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                          </svg>
                          Edit{" "}
                        </button>
                        <button
                          type="button"
                          className="delet-btn px-3 py-1 rounded-pill border-0 ms-3 text-white"
                          onClick={() => HandleDeleteDealer(item?.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="#fff"
                            class="bi bi-x me-2"
                            viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>

      {/* Start Add Dealer Modal */}
      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        backdrop="static"
        size="lg"
        keyboard={false}>
        <div className="d-flex align-items-center px-3 py-3 border-bottom">
          <div>
            <h2 className="mb-0">Add dealer</h2>
            <p className="mb-0">All fields are mandatory</p>
          </div>

          <div className="ms-auto">
            <button
              className="bg-transparent border-0"
              type="button"
              onClick={() => setVisible(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                class="bi bi-x-lg"
                viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>
          </div>
        </div>

        <Modal.Body className="px-0">
          <div className="d-flex align-items-center px-3 py-2">
            <div>Dealer's Name</div>

            <div className="ms-auto   inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="Dealer Name"
                value={dealerName}
                onChange={(e) => setDealerName(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex align-items-center px-3 py-2">
            <div>Location</div>

            <div className="ms-auto d-flex align-items-center tw-half">
              <input
                className="border rounded p-2 w-40"
                type="text"
                placeholder="longitude"
                value={location?.longitude}
                onChange={(e) =>
                  setLocation({ ...location, longitude: e.target.value })
                }
              />
              <input
                className="border rounded p-2 mr-2 w-40"
                type="text"
                placeholder="latitude"
                value={location?.latitude}
                onChange={(e) =>
                  setLocation({ ...location, latitude: e.target.value })
                }
              />
            </div>
          </div>
          <div className="d-flex align-items-center px-3 py-2">
            <div>Total budget</div>

            <div className="ms-auto inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="$0.00"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex align-items-center px-3 py-2">
            <div>Owner's First Name</div>

            <div className="ms-auto inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="First Name"
                value={owner?.firstName}
                onChange={(e) =>
                  setowner({ ...owner, firstName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="d-flex align-items-center px-3 py-2">
            <div>Owner's Last Name</div>

            <div className="ms-auto inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="Last Name"
                value={owner?.lastName}
                onChange={(e) =>
                  setowner({ ...owner, lastName: e.target.value })
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={onSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {/* End Add Dealer Modal */}
    </>
  );
}

export default BasicExample;

// json-server --watch data.json --port 3001
