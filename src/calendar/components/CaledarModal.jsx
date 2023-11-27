import { addHours, differenceInSeconds } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import Swal from "sweetalert2";
import { useCalendarStore, useUIStore } from "../../hooks";

registerLocale("es", es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {


  const { isDateModalOpen, closeDateModal } = useUIStore();
  const {  activeEvent,startSavingEvent} = useCalendarStore();

  const [formSubmit, setFormSubmit] = useState(false);

  const [formValues, setFormValues] = useState({
    title: "Jorge",
    notes: "Salgado",
    start: new Date(),
    end: addHours(new Date(), 2),
  });

  const titleClass = useMemo(() => {
    if (!formSubmit) return "";
    return formValues.title.length > 0 ? "" : "is-invalid";
  }, [formValues.title, formSubmit]);


  useEffect(() => {
    if(activeEvent!== null){
      setFormValues({...activeEvent})
    }
  
    
  }, [activeEvent])
  


  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onDateChange = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  const onCloseModal = () => {
    console.log("Cerrando Modal");
    closeDateModal();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmit(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(difference) || difference <= 0) {
      Swal.fire("Fechas Incorrectas", "Revisar fechas incorrectos", "error");
      return;
    }

    if (formValues.title.length === 0) return;

  

   await startSavingEvent(formValues);
    closeDateModal();
    setFormSubmit(false);
  };

  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>
          <DatePicker
            locale="es"
            timeCaption="Hora"
            selected={formValues.start}
            onChange={(event) => onDateChange(event, "start")}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha y hora fin</label>
          <DatePicker
            locale="es"
            timeCaption="Hora"
            minDate={formValues.start}
            selected={formValues.end}
            onChange={(event) => onDateChange(event, "end")}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            value={formValues.title}
            onChange={onInputChange}
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            value={formValues.notes}
            onChange={onInputChange}
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
