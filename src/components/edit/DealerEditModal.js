import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const intialObj = {
  id: "",
  name: "",
  totalBudget: "",
  remainingBudget: "",
  owner: {
    firstName: "",
    lastName: "",
  },
  location: {
    latitude: "",
    longitude: "",
  },
  cars: [],
};

export default function DealerEditModal({
  seteditVisible: setVisible,
  editVisible: visible,
  id,
  handleGetDealerList,
}) {
  const [formObj, setformObj] = useState(intialObj);

  const onChange = (e) => {
    const { name, value } = e.target;
    setformObj({ ...formObj, [name]: value });
  };

  const onChangeLocation = (e, field) => {
    const { value } = e.target;
    setformObj({
      ...formObj,
      location: {
        ...formObj.location,
        [field]: value,
      },
    });
  };

  const onChangeOwner = (e, field) => {
    const { value } = e.target;
    setformObj({ ...formObj, owner: { ...formObj.owner, [field]: value } });
  };
  function onSubmit(e) {
    console.log(formObj);
    fetch(`http://localhost:3001/dealers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formObj),
    })
      .then((res) => res.json())
      .then((res) => {
        setVisible(false);
        handleGetDealerList();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetch(`http://localhost:3001/dealers/${id}`)
      .then((res) => res.json())
      .then((res) => setformObj(res))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <Modal
      show={visible}
      onHide={() => setVisible(false)}
      backdrop="static"
      size="lg"
      keyboard={false}>
      <div className="d-flex align-items-center px-3 py-3 border-bottom">
        <div>
          <h2 className="mb-0">Update dealer</h2>
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
              className="bi bi-x-lg"
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
              value={formObj.name}
              className="border rounded p-2 w-100"
              type="text"
              placeholder="Dealer Name"
              onChange={onChange}
              name="name"
            />
          </div>
        </div>
        <div className="d-flex align-items-center px-3 py-2">
          <div>Location</div>

          <div className="ms-auto d-flex align-items-center tw-half">
            <input
              className="border rounded p-2 w-40"
              type="text"
              value={formObj?.location?.longitude}
              placeholder="longitude"
              onChange={(e) => onChangeLocation(e, "longitude")}
            />
            <input
              className="border rounded p-2 mr-2 w-40"
              type="text"
              placeholder="latitude"
              value={formObj?.location?.latitude}
              onChange={(e) => onChangeLocation(e, "latitude")}
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
              value={formObj?.totalBudget}
              onChange={onChange}
              name="totalBudget"
            />
          </div>
        </div>
        <div className="d-flex align-items-center px-3 py-2">
          <div>Owner's First Name</div>

          <div className="ms-auto inp-div">
            <input
              className="border rounded p-2 w-100"
              type="text"
              value={formObj?.owner?.firstName}
              placeholder="First Name"
              onChange={(e) => onChangeOwner(e, "firstName")}
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
              value={formObj?.owner?.lastName}
              onChange={(e) => onChangeOwner(e, "lastName")}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
