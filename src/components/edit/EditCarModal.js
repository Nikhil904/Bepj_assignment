import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const intialObj = {
  id: "",
  name: "",
  model: "",
  brand: "",
  color: "",
  price: "",
};

export default function EditCarModal({
  seteditVisible: setVisible,
  editVisible: visible,
  dealerId,
  carId,
}) {
  const [dealer, setdealer] = useState({});
  const [formObj, setformObj] = useState(intialObj);
  const onChange = (e) => {
    const { name, value } = e.target;
    setformObj({ ...formObj, [name]: value });
  };

  function onSubmit(e) {
    const dataUpdatedData = dealer?.cars?.map((item) =>
      item.id == carId ? formObj : item
    );
    dealer.cars = dataUpdatedData;

    fetch(`http://localhost:3001/dealers/${dealerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dealer),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetch(`http://localhost:3001/dealers/${dealerId}`)
      .then((res) => res.json())
      .then((res) => {
        setdealer(res);
        let cars = res.cars;
        [cars] = cars.filter((item) => item.id == carId);
        setformObj(cars);
      })
      .catch((err) => console.log(err));
  }, [carId]);

  return (
    <>
      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        backdrop="static"
        size="lg"
        keyboard={false}>
        <div className="d-flex align-items-center px-3 py-3 border-bottom">
          <div>
            <h2 className="mb-0">Update Car</h2>
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
            <div>Brand</div>

            <div className="ms-auto   inp-div">
              <input
                className="border rounded p-2 w-100"
                type="text"
                placeholder="Brand's Name"
                value={formObj?.brand}
                onChange={onChange}
                name="brand"
              />
            </div>
          </div>

          <div className="d-flex align-items-center px-3 py-2">
            <div>Model</div>

            <div className="ms-auto inp-div">
              <input
                value={formObj?.model}
                className="border rounded p-2 w-100"
                type="text"
                placeholder="Model"
                onChange={onChange}
                name="model"
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
                value={formObj?.color}
                onChange={onChange}
                name="color"
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
                value={formObj?.price}
                onChange={onChange}
                name="price"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
