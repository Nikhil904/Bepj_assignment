import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useLocation, useNavigate } from "react-router-dom";
import EditCarModal from "./edit/EditCarModal";

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

function CarTable() {
  const [visible, setVisible] = useState(false);
  const [editVisible, seteditVisible] = useState(false);
  const location = useLocation();
  const { Data } = location.state;
  const [carList, setCarList] = useState(Data?.cars);
  const [originalCarList, setOriginalCarList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [carId, setcarId] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  const HandleDeleteCar = (id) => {
    let confirm = window.confirm("Are you sure you want to delete this Dealer");
    let cars = Data.cars;
    cars = cars.filter((item) => item.id !== id);
    Data.cars = cars;
    if (confirm) {
      fetch("http://localhost:3001/dealers/" + Data.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
  };
  const handleGetCarList = () => {
    setCarList(Data?.cars || []);
    setOriginalCarList(Data?.cars || []);
  };

  const onsave = () => {
    const totalBudget = parseFloat(Data.totalBudget.replace("$", ""));
    const id = Math.ceil(Math.random() * 9999);
    let data = { id, name:Data?.name, model, brand, color, price };
    const priceNumeric = parseFloat(data.price.replace("$", ""));
    if (!isNaN(priceNumeric)) {
      const remainingBudget = totalBudget - priceNumeric;
  
      const updatedData = {
        ...Data,
        remainingBudget: "$" + remainingBudget.toFixed(2),
        cars: [...Data.cars, data],
      };
  
      fetch("http://localhost:3001/dealers/" + Data.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => response.json())
        .then((data) => {
          setCarList(data.cars);
          handleGetCarList();
          setVisible(false);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.error("Invalid price format");
    }
  };
  

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    if (searchQuery?.length > 0) {
      const filteredCarList = originalCarList.filter(
        (car) =>
          car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.price.toString().includes(searchQuery.toLowerCase())
      );
      console.log(filteredCarList);
      setCarList(filteredCarList);
    } else {
      setCarList(originalCarList);
    }
  }, [searchQuery, originalCarList]);

  useEffect(() => {
    handleGetCarList();
  }, []);
  console.log(carId);
  return (
    <>
      <EditCarModal
        dealerId={Data.id}
        carId={carId}
        seteditVisible={seteditVisible}
        editVisible={editVisible}
      />
      <div className="dealership-cont my-5">
        <Container>
          <div className="d-flex align-items-end">
            <div>
              <h1 className="text-capitalize mn-3">dealership:{Data?.name}</h1>
              <form className="position-relative">
                <input
                  className="rounded p-2 border"
                  type="search"
                  placeholder="Search"
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </form>
            </div>
            <div className="d-flex align-items-end">
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
                add Car
              </button>

              <button
                className="dealer-btn text-white rounded-pill text-capitalize d-flex align-items-center px-4  py-2 border-0 me-3"
                type="button"
                onClick={() => navigate(-1)}>
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
                Back
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
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Color</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {carList?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.brand}</td>
                    <td>{item?.model}</td>
                    <td>{item?.color}</td>
                    <td>{item?.price}</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        <button
                          onClick={() => {
                            seteditVisible(true);
                            setcarId(item.id);
                          }}
                          type="button"
                          className="edit-btn px-3 py-1 rounded-pill border-0 ms-3 text-white">
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
                          onClick={() => HandleDeleteCar(item?.id)}>
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
            <h2 className="mb-0">Add Car</h2>
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
          {/* <div className="d-flex align-items-center px-3 py-2">
            <div>Name</div>

            <div className="ms-auto   inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="Car Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div> */}

          <div className="d-flex align-items-center px-3 py-2">
            <div>Brand</div>

            <div className="ms-auto   inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="Brand's Name"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex align-items-center px-3 py-2">
            <div>Model</div>

            <div className="ms-auto inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex align-items-center px-3 py-2">
            <div>Color</div>

            <div className="ms-auto inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex align-items-center px-3 py-2">
            <div>Price</div>

            <div className="ms-auto inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="$0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onsave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {/* End Add Dealer Modal */}
    </>
  );
}

export default CarTable;

// json-server --watch data.json --port 3001
