import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertToDateEvents } from "../helpers";
import Swal from "sweetalert2";


export const useCalendarStore = () => {


    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);



    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async (calendarEvent) => {

        //TODO uPDATE EVENT

        try {

            if (calendarEvent.id) {

                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)

                dispatch(onUpdateEvent({ ...calendarEvent, user }))
                return;
            }
            const { data } = await calendarApi.post('/events/new', calendarEvent);
            console.log(data)
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));

        } catch (error) {
            console.log(error);
            Swal.fire('error al guardar', error.response.data.msg, 'error')
        }



    }

    const startDeletingEvent = async () => {

        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());

        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error')
        }

    }

    const startLoadingEvents = async () => {
        try {

            const { data } = await calendarApi.get('/events');
            console.log({ data });
            const events = convertToDateEvents(data.eventos)

            dispatch(onLoadEvents(events));
            console.log(events)

        } catch (error) {

            console.log('error al cargar')

        }
    }


    return {


        //*¨Propiedades
        activeEvent,
        events,
        hasEventSelect: !!activeEvent,


        //* Metodos
        setActiveEvent,
        startDeletingEvent,
        startSavingEvent,
        startLoadingEvents
    }
}
