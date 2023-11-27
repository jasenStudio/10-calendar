
import { useCalendarStore, useUIStore } from "../../hooks";



export const FabDelete = () => {


    const { startDeletingEvent ,hasEventSelect } = useCalendarStore();

    const handleDelete = () => {
        startDeletingEvent();
    
    }


  return (
    <button 
    className="btn btn-danger fab-danger" 
    onClick={ handleDelete } 
    style={{ display: hasEventSelect ? '' : 'none'}}>
      <i className="fas fa-trash-alt"></i>
    </button>
  );
};
